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
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import LoadingIndicator from "../components/LoadingIndicator";
import { SignupFormData } from "../types";
import OtpModal from "./_components/OtpModal";
import { sendOtp } from "./actions";

const SignupPage = () => {
  const { data: session } = useSession();
  const [resError, setResError] = useState<string | null>(null);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    mode: "onBlur",
    resolver: zodResolver(validationRegistSchema),
  });

  if (session) redirect("/");

  // 登録処理
  const handleRegist = async (data: SignupFormData) => {
    setIsLoading(true);
    const result = await sendOtp(data);
    if (result.success) {
      setName(data.name);
      setEmail(data.email); // emailを状態に保存
      setPassword(data.password); // 
      setIsLoading(false);
      setOpenOtpModal(true); // OTPモーダルを開く
    } else {
      setIsLoading(false);
      setResError(result.error);
    };
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(45deg, #c0d7d2, #444f7c)",
      }}
    >
      <Box
        sx={{
          minHeight: "80vh",
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
              mt: 4,
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{
                position: "relative",
                top: "-10px",
                fontFamily: "Monospace",
              }}
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
                    mt: 2,
                    mb: 0,
                    backgroundColor: "#444f7c",
                    "&:hover": {
                      backgroundColor: "#383f6a", // ホバー時の背景色
                    },
                  }}
                >
                  {isLoading ? (
                    <LoadingIndicator />
                  ) : (
                    <div
                      className="button-content"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        src="/icon/entry.png"
                        alt="icon"
                        width={24}
                        height={24}
                      />
                      <span>登録</span>
                    </div>
                  )}
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
            top="20px"
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
    </div>
  );
};

export default SignupPage;