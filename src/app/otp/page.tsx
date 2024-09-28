"use client";

import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const OtpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  const [otp, setOtp] = useState("");
  const [resError, setResError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/verify-and-create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password }),
    });

    if (res.ok) {
      signIn("credentials", { email, password }); // OTP検証成功後に自動サインイン
    } else {
      const errorData = await res.json();
      setResError(errorData.error);
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(45deg, #8e44ad, #3498db)',
        minHeight: '100vh',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: '50px',
      }}
    >
      <Typography
        variant="h1"
        color="white"
        sx={{
          position: 'relative',
          top: '-50px',
          fontFamily: 'Monospace',
          paddingBottom: '5px',
          '&::before': {
            background: '#fff',
            content: '""',
            width: '100%',
            height: '5px',
            position: 'absolute',
            left: 0,
            bottom: 0,
            margin: 'auto',
            transformOrigin: 'right top',
            transform: 'scale(0, 1)',
            transition: 'transform .3s',
          },
          '&:hover::before': {
            transformOrigin: 'center top',
            transform: 'scale(1, 1)',
          },
        }}
      >
        OTP確認
      </Typography>

      <Container maxWidth="xs"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
          padding: "16px",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 8,
          }}
        >
          <Typography component="h1" variant="h4" sx={{ position: 'relative', top: '-20px', fontFamily: 'Monospace' }}>
            OTPを入力
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            {/* エラーメッセージ表示 */}
            {resError && (
              <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                {resError}
              </Alert>
            )}

            {/* OTPフィールド */}
            <TextField
              margin="normal"
              fullWidth
              id="otp"
              label="ワンタイムパスワード"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={!!resError}
              helperText={resError ? resError : ""}
            />

            {/* 確認ボタン */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              OTP確認
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default OtpForm;
