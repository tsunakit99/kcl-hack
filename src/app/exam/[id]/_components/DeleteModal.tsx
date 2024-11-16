"use client";

import Modal from "@/app/components/Modal";
import { Alert, Button, Typography } from "@mui/material";
import { useState } from "react";
import { deleteComment } from "../actions";

interface DeleteModalProps {
    examId: string;
    commentId: string;
    open: boolean;
    onClose: () => void;
    onDeleteSuccess: () => void;
}

const DeleteModal = ({ examId, commentId, open, onClose, onDeleteSuccess }: DeleteModalProps) => {

    const [resError, setResError] = useState<string | null>(null);

    const handleDelete = async () => {
        const result = await deleteComment(examId, commentId);
        if (result.success) {
            onDeleteSuccess();
            onClose();
        } else {
            setResError(result.error)
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            {resError && <Alert severity="error">{resError}</Alert>}
            <Typography variant="h6" mb={2}>このコメントを削除しますか？</Typography>
                <Button type="submit" onClick={handleDelete} fullWidth variant="contained" sx={{ mt: 2 }}>
                    削除
                </Button>
            <Button onClick={onClose} fullWidth sx={{ mt: 2 }}>キャンセル</Button>
        </Modal>
    );
};

export default DeleteModal;