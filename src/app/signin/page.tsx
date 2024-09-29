"use client";

import { validationLoginSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import GitHubIcon from '@mui/icons-material/GitHub';
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
                minHeight: '100vh',  // 高さを画面全体に設定
                display: 'flex',  // Flexbox を使用
                flexDirection: 'column',
                justifyContent: 'center',  // 水平方向の中央揃え
                alignItems: 'center',  // 垂直方向の中央揃え
                 padding: '50px', // コンテンツが狭い画面でも収まるようにパディングを設定
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
                ようこそ！
            </Typography>
            <Container maxWidth="xs"
                sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
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
                    <Typography component="h1" variant="h4" sx={{ position: 'relative', top: '-20px', fontFamily: 'Monospace' }}>
                        ログイン
                    </Typography>
                    <form onSubmit={handleSubmit(handleLogin)} noValidate>
                        {/* エラーメッセージ表示 */}
                        {resError && (
                            <Alert severity="error" sx={{ mt: 2, width: "90%" }}>
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
                        startIcon={<GitHubIcon style={{ color: "#000" }}/>}
                        onClick={() => {
                            signIn("github");
                        }}
                        sx={{
                            textTransform: "none",

                        }}
                    >
                        Githubでログイン
                    </Button>
                </Box>
            </Container>
            {/* サインアップリンク */}
            <Link href="/signup" passHref>
                <Typography
                    variant="h5"
                    color="#fff"
                    position="relative"
                    top="40px"
                    fontFamily="monospace"
                    sx={{
                        zIndex: 1,
                        padding: '0 10px',
                        position: 'relative',
                        '&::before': {
                            background: 'linear-gradient(45deg, #8e44ad, #3498db)',
                            content: '""',
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            margin: 'auto',
                            transform: 'scale(0, 1)',
                            transformOrigin: 'right top',
                            transition: 'transform .3s',
                            zIndex: -1,
                        },
                        '&:hover': {
                            color: '#fff',
                            '&::before': {
                                transformOrigin: 'left top',
                                transform: 'scale(1, 1)',
                            },
                        },
                    }}
                >
                    新規登録はこちら
                </Typography>

            </Link>
                    
        </Box>
        //                 {/* <button onClick={() => {
        //                     signIn("google");
        //                 }}>Googleでログイン</button> */}

    );
};

export default SigninPage;