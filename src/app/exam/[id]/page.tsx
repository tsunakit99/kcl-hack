"use client";
import ErrorMessage from '@/app/components/ErrorMessage';
import { ExamData } from '@/app/types';
import { Box, Button, Card, CardContent, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CommentSection from './_components/CommentSection';
import { getExamById, getImageById } from './actions';

interface ExamPageProps {
  params: { id: string };
}

const ExamPage = ({ params }: ExamPageProps) => {
  const [exam, setExam] = useState<ExamData>();
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examData = await getExamById(params.id);
        if (!examData) {
          setError("過去問が見つかりません。");
          return;
        }
        setExam(examData);

        const image = await getImageById(examData.uploaderId);
        setImageUrl(image || "/icon/default-profile.png");
      } catch (err) {
        console.error("試験情報の取得中にエラーが発生しました：", err);
        setError("過去問情報の取得中にエラーが発生しました。もう一度お試しください。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!exam) {
            return (
    <ErrorMessage
      title="過去問が見つかりません。"
      description="お探しの過去問が存在しないか、既に削除されています。"
    />
  );
        }

  if (error) {
    return (
      <ErrorMessage
        title="エラー"
        description={error}
      />
    );
  }

  return (
       <Box
        sx={{
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(45deg, #c0d7d2, #444f7c)",
          display: "flex",
          alignItems: "center",
        justifyContent: "center",
        }}
    >
       <Box
        sx={{
          width: '90%',
          display: 'flex',
          ml: 9
        }}
      >
        {/* 左側の過去問詳細 */}
        <Box
          sx={{
            width: '60%',
          }}
        >
        <Card
          sx={{
            width: "100%",
              height: "98vh",
              margin: "auto",
            background: "none",
            overflowY: "auto",
            mt: 5,
            mb: 5,
            boxShadow: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none", // Firefox対応
            "@media(max-width: 1300px)": {
              width: "600px",
            },
          }}
        >
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            <Box
              sx={{
                  display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  fontSize: "40px",
                  fontWeight: "bold",
                  textAlign: "left",
                  "@media(max-width: 1000px)": {
                    fontSize: "20px",
                  },
                }}
              >
                過去問詳細
              </Typography>
              <Link
                href={`/profile/${exam.uploader.id}`}
                passHref
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "primary",
                      fontSize: "18px",
                      "@media(max-width: 1000px)": {
                        fontSize: "10px",
                      },
                    }}
                  >
                    投稿者:
                  </Typography>
                  <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      ml: 2,
                      border: "2px solid #000",
                      "@media(max-width: 1300px)": {
                        width: "20px",
                        height: "20px",
                        ml: 1,
                      },
                    }}
                  >
                    <Image
                      src={imageUrl || "/icon/default-profile.png"}
                      alt="プロフィール画像"
                      width={500}
                      height={500}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      "@media(max-width: 1000px)": {
                        fontSize: "10px",
                      },
                    }}
                  >
                    {exam.uploader.name}
                  </Typography>
                </Box>
              </Link>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Stack direction="column" spacing={2} sx={{ textAlign: "left" }}>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  講義名
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {exam.lecture.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  学科
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {exam.department.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  年度
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {exam.year}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  教授名
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {exam.professor || "不明"}
                </Typography>
            </Box>
            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
              <Typography variant="h5" color="primary"
                sx={{
                  fontWeight: "bold",
                  whiteSpace: "nowrap", // テキストを1行に制限
                  overflow: "hidden", // 表示範囲外を隠す
                  textOverflow: "ellipsis" // 省略記号を表示
              }}>
                  {exam.originalFileName}
                </Typography>
              <Link href={exam.fileUrl} passHref>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 1,
                    fontWeight: "bold",
                    width: "100%",
                    minWidth: "70px",
                  }}
              >
                閲覧
                </Button>
              </Link>
              </Box>
            </Stack>
          </CardContent>
          </Card>
        </Box>
        <Divider/>
         {/* 右側のコメント欄 */}
        <Box
          sx={{
            width: '50%',
            height: "98vh",
            display: 'flex',
            flexDirection: 'column',
            p: 5
          }}
        >
          <CommentSection examId={params.id} />
        </Box>
        </Box>
      </Box>
    );
};

export default ExamPage;
