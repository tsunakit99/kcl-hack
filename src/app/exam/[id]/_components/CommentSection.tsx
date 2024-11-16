// src/app/exam/[id]/CommentSection.tsx

import { Comment, CommentFormData } from '@/app/types';
import { commentSchema } from '@/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { fetchComments, postComment } from '../actions';
import DeleteModal from './DeleteModal';

interface CommentSectionProps {
  examId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ examId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        const data = await fetchComments(examId);
        setComments(data);
      } catch (error) {
        console.error('コメントの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [examId]);

  const onSubmit = async (data: CommentFormData) => {
    setIsPosting(true);
    try {
      const newComment = await postComment(examId, data.content);
      setComments([newComment, ...comments]);
      reset();
    } catch (error) {
      console.error('コメントの投稿に失敗しました:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleOpenDeleteModal = (commentId: string) => {
    setSelectedCommentId(commentId);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedCommentId(null);
  };

  const handleDeleteSuccess = () => {
    setOpenDeleteSnackbar(true);
    if (selectedCommentId) {
      setComments(comments.filter((comment) => comment.id !== selectedCommentId));
      setSelectedCommentId(null);
    }
  };


  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
        コメント欄
      </Typography>

      {/* コメント一覧 */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none", // Firefox対応
          mb: 2,
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar
                  src={comment.user.imageUrl || '/icon/default-profile.png'}
                  sx={{ mr: 1 }}
                />
                <Link href={`/profile/${comment.user.id}`} passHref style={{ textDecoration: "none", color: "inherit"}}>
                <Typography variant="subtitle1">
                  {comment.user.name || '匿名ユーザー'}
                  </Typography>
                  </Link>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>
                {/* 自分のコメントの場合、削除ボタンを表示 */}
                {session?.user?.id === comment.user.id && (
                  <IconButton
                    onClick={() => handleOpenDeleteModal(comment.id)}
                    sx={{ ml: 'auto' }}
                  >
                    <Image
                      src="/icon/delete2.png"
                      alt="削除"
                      width={24}
                      height={24}
                    />
                  </IconButton>
                )}
              </Box>
              <Typography variant="body1">{comment.content}</Typography>
            </Box>
          ))
        )}
      </Box>

      {/* コメント入力欄 */}
      {session ? (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 'auto',
            mb: 2,
            pt: 2,
            borderTop: '1px solid #ccc',
          }}
        >
          <Controller
            name="content"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                placeholder="コメントを入力..."
                fullWidth
                multiline
                maxRows={4}
                error={!!errors.content}
                helperText={errors.content?.message}
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isPosting}
            sx={{ ml: 1 }}
          >
            投稿
          </Button>
        </Box>
      ) : (
        <Typography color="textSecondary" sx={{ mt: 'auto', pt: 2 }}>
          コメントを投稿するにはログインが必要です。
        </Typography>
      )}
      {selectedCommentId && (
        <DeleteModal
          examId={examId}
          commentId={selectedCommentId}
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenDeleteSnackbar(false)}
        message="コメント削除が完了しました"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default CommentSection;
