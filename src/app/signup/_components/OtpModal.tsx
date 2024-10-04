import Modal from "@/app/components/Modal";
import { Alert, Button, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { verifyAndCreateUser } from "../actions";

interface OtpModalProps {
    name: string;
    email: string;
    password: string;
    open: boolean;
    onClose: () => void;
}

const OtpModal = ({ name, email, password, open, onClose }: OtpModalProps) => {
    const [otp, setOtp] = useState("");
    const [resError, setResError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await verifyAndCreateUser(otp, name, email, password);

        if (result.success) {
            // OTP検証成功後に自動サインイン
            signIn("credentials", { name, email, password });
        } else {
            setResError(result.error || "エラーが発生しました。");
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Typography variant="h6" mb={2}>ワンタイムパスワード入力</Typography>
            <form onSubmit={handleSubmit}>
                {resError && <Alert severity="error">{resError}</Alert>}
                <TextField
                    fullWidth
                    label="ワンタイムパスワード"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    margin="normal"
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                    ログイン
                </Button>
            </form>
            <Button onClick={onClose} fullWidth sx={{ mt: 2 }}>キャンセル</Button>
        </Modal>
    );
};

export default OtpModal;