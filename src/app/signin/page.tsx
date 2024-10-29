"use client";

import { validationLoginSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AuthLayout from "../components/AuthLayout";
import LeftLineText from "../components/LeftLineText";
import LoadingIndicator from "../components/LoadingIndicator";
import { SigninFormData } from "../types";
import { logIn } from "./actions";

const SigninPage = () => {
  const { data: session } = useSession();
  const [resError, setResError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    mode: "onBlur",
    resolver: zodResolver(validationLoginSchema),
  });

  if (session) redirect("/");

  const handleLogin = async (data: SigninFormData) => {
    setIsLoading(true);
    const result = await logIn(data);
    if (result.success) {
      setIsLoading(false);
      signIn("credentials", { email: data.email, password: data.password });
    } else {
      setIsLoading(false);
      setResError(result.error);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(45deg, #c0d7d2, #444f7c)",
      }}
    >
      <AuthLayout
        title=""
        children1={
          <>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                position: "relative",
                top: "-20px",
                fontFamily: "Monospace",
              }}
            >
              ログイン
            </Typography>
            <form onSubmit={handleSubmit(handleLogin)} noValidate>
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
                autoComplete="current-password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message as React.ReactNode}
              />

              {/* ログインボタン */}
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
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
                        src="/icon/door.png"
                        alt="icon"
                        width={24}
                        height={24}
                      />
                      <span>ログイン</span>
                    </div>
                  )}
                </Button>
              </Box>
            </form>
            {/* <Divider sx={{ width: "100%", my: 2 }} />
             GitHubログインボタン 
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHubIcon style={{ color: "#000" }} />}
              onClick={() => {
                signIn("github");
              }}
              sx={{
                textTransform: "none",
                color: "#444f7c",
                borderColor: "#444f7c",
                "&:hover": {
                  color: "#fff",
                },
              }}
            >
              Githubでログイン
            </Button>{" "}  */}
          </>
        }
        children2={
          <Link href="/signup" passHref>
            <LeftLineText title="新規登録はこちら" />
          </Link>
        }
      />
    </div>

    //                 {/* <button onClick={() => {
    //                     signIn("google");
    //                 }}>Googleでログイン</button> */}
  );
};

export default SigninPage;