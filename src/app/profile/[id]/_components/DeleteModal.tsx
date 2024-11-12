"use client";

import Modal from "@/app/components/Modal";
import { Alert, Button, Typography } from "@mui/material";
import { useState } from "react";
import { deleteExamById } from "../actions";

interface DeleteModalProps {
    examId: string;
    open: boolean;
    onClose: () => void;
    onDeleteSuccess: () => void;
}

const DeleteModal = ({ examId, open, onClose, onDeleteSuccess }: DeleteModalProps) => {

    const [resError, setResError] = useState<string | null>(null);

    const handleDelete = async (examId: string) => {
        const result = await deleteExamById(examId);
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
            <Typography variant="h6" mb={2}>この過去問を削除しますか？</Typography>
                <Button type="submit" onClick={() => handleDelete(examId)} fullWidth variant="contained" sx={{ mt: 2 }}>
                    削除
                </Button>
            <Button onClick={onClose} fullWidth sx={{ mt: 2 }}>キャンセル</Button>
        </Modal>
    );
};

export default DeleteModal;