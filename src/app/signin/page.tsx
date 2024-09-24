"use client";

import { validationLoginSchema } from "@/validationSchema";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Container, Divider, TextField, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";


interface ResError {
    errors: string;
}

const SigninPage = () => {
    const { data: session, status } = useSession();
    const [resError, setResError] = useState<ResError | undefined>();
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        
    } = useForm({
        mode: "onBlur",
        resolver: zodResolver(validationLoginSchema),
    });

    // セッション判定
    if (session) redirect("/");

    const handleLogin = async (data: any) => {
        const email = data.email;
        const password = data.password;
        const res = await fetch("/api/signIn", {
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json",
            },
            method: "POST",
        });

        if (res.ok) {
            signIn("credentials", { email: email, password: password });
        } else {
            const resError = await res.json();
            setResError(resError);
        }
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(45deg, #8e44ad, #3498db)',  // グラデーションの背景
                height: '100vh',  // 高さを画面全体に設定
                display: 'flex',  // Flexbox を使用
                flexDirection: 'column',
                justifyContent: 'center',  // 水平方向の中央揃え
                alignItems: 'center',  // 垂直方向の中央揃え
            }}
        >
            <Typography variant="h1" color="white" sx={{
                position: 'relative',
                top: "-50px",
                fontFamily: "Monospace"
            }}>
                ようこそ！
            </Typography>
            <Container maxWidth="xs"
                sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    padding: "16px",
                    backgroundColor: "white",
                }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 8
                    }}
                >
                    <Typography component="h1" variant="h4"
                        sx={{ position: 'relative', top: '-20px', fontFamily: 'Monospace' }}>
                        ログイン
                    </Typography>
                    <form onSubmit={handleSubmit(handleLogin)} noValidate>
                        {/* エラーメッセージ表示 */}
                        {resError && (
                            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                                <p>{resError.errors}</p>
                            </Alert>
                        )}

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
                            autoComplete="current-password"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message as React.ReactNode}
                        />

                        {/* ログインボタン */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            ログイン
                        </Button>
                    </form>

                    <Divider sx={{ width: '100%', my: 2 }} />

                    {/* GitHubログインボタン */}
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                            signIn("github");
                        }}
                        sx={{
                            textTransform: "none",

                        }}
                    >
                        <FontAwesomeIcon icon={faGithub} size="2x" style={{ marginRight: "8px", color: "#000" }} />
                        Githubでログイン
                    </Button>

                    {/* サインアップリンク */}
                    <Box sx={{ mt: 2 }}>
                        <Link href="/signup" passHref>
                            <Typography variant="body2" color="primary">
                                新規登録はこちら
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
        //                 {/* <button onClick={() => {
        //                     signIn("google");
        //                 }}>Googleでログイン</button> */}

    );
};

export default SigninPage;