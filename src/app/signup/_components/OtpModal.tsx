import Modal from "@/app/components/Modal";
import { Alert, Button, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface OtpModalProps {
    email: string;
    password: string;
    open: boolean;
    onClose: () => void;
}

const OtpModal = ({ email, password, open, onClose }: OtpModalProps) => {
    const [otp, setOtp] = useState("");
    const [resError, setResError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/verify-and-create-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp, email, password }),
        });

        if (res.ok) {
            signIn("credentials", { email, password }); // OTP検証成功後に自動サインイン
        } else {
            const errorData = await res.json();
            setResError(errorData.error);
        }
    };

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