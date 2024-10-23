"use client";

import { validationRegistSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SignupFormData } from "../types";
import OtpModal from "./_components/OtpModal";
import { sendOtp } from "./actions";

const SignupPage = () => {
  const { data: session, status } = useSession();
  const [resError, setResError] = useState<string | null>(null);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupFormData>({
    mode: "onBlur",
    resolver: zodResolver(validationRegistSchema),
  });

  if (session) redirect("/");

  // 登録処理
  const handleRegist = async (data: SignupFormData) => {
    const result = await sendOtp(data);
    if (result.success) {
      setName(data.name);
      setEmail(data.email); // emailを状態に保存
      setPassword(data.password); // passwordを状態に保存
      setOpenOtpModal(true); // OTPモーダルを開く
    } else {
      setResError(result.error);
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(45deg, #c0d7d2, #444f7c)",
        minHeight: "95vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          borderRadius: 0,
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
          <Typography
            component="h1"
            variant="h5"
            sx={{ position: "relative", top: "-20px", fontFamily: "Monospace" }}
          >
            アカウント登録
          </Typography>
          <form onSubmit={handleSubmit(handleRegist)} noValidate>
            {/* エラーメッセージ表示 */}
            {resError && (
              <Alert severity="error" sx={{ mt: 2, width: "90%" }}>
                {Object.values(resError)
                  .flat()
                  .map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
              </Alert>
            )}

            {/* 名前フィールド */}
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="名前"
              autoComplete="name"
              autoFocus
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message as React.ReactNode}
            />

            {/* メールアドレスフィールド */}
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="メールアドレス"
              autoComplete="email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message as React.ReactNode}
            />

            {/* パスワードフィールド */}
            <TextField
              margin="normal"
              fullWidth
              label="パスワード"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message as React.ReactNode}
            />

            {/* パスワード確認フィールド */}
            <TextField
              margin="normal"
              fullWidth
              label="再確認パスワード"
              type="password"
              id="passwordConfirm"
              autoComplete="new-password"
              {...register("passwordConfirm")}
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm?.message as React.ReactNode}
            />

            {/* 登録ボタン */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  position: "relative",
                  width: "15vw",
                  height: "6vh", // ボタンの高さを調整
                  borderRadius: 5,
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#444f7c",
                  "&:hover": {
                    backgroundColor: "#383f6a", // ホバー時の背景色
                  },
                }}
              >
                <div
                  className="button-content"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/icon/entry.png"
                    alt="icon"
                    style={{ width: "24px", height: "24px" }}
                  />
                  <span>登録</span>
                </div>
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
      {/* OTP入力モーダルを表示（propsでnameとemailとpasswordを渡す） */}
      {openOtpModal && (
        <OtpModal
          name={name}
          email={email}
          password={password}
          open={openOtpModal}
          onClose={() => setOpenOtpModal(false)}
        />
      )}
      {/* ログインリンク */}
      <Link href="/signin" passHref>
        <Typography
          variant="h5"
          color="#fff"
          position="relative"
          top="40px"
          fontFamily="monospace"
          sx={{
            zIndex: 1,
            padding: "0 10px",
            position: "relative",
            "&::before": {
              background: "linear-gradient(45deg, #8e44ad, #3498db)",
              content: '""',
              display: "block",
              width: "100%",
              height: "100%",
              position: "absolute",
              left: 0,
              bottom: 0,
              margin: "auto",
              transform: "scale(0, 1)",
              transformOrigin: "right top",
              transition: "transform .3s",
              zIndex: -1,
            },
            "&:hover": {
              color: "#fff",
              "&::before": {
                transformOrigin: "left top",
                transform: "scale(1, 1)",
              },
            },
          }}
        >
          ログインはこちら
        </Typography>
      </Link>
    </Box>
  );
};

export default SignupPage;
