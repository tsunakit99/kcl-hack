"use client";

import { validationRegistSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Container, Divider, TextField, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Error {
    email: [];
    password: [];
    passwordConfirm: [];
}

const SignupPage = () => {
    const { data: session, status } = useSession();
    const [resError, setResError] = useState<Error>();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        resolver: zodResolver(validationRegistSchema),
    });

    if (session) redirect("/");

    // 登録処理
    const handleRegist = async (data: any) => {
        const email = data.email;
        const password = data.password;
        const res = await fetch("/api/signUp", {
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
            setResError(resError.errors);
        }
    };

    return (
       <Container maxWidth="xs">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 8,
                }}
            >
                <Typography component="h1" variant="h5">
                    アカウント登録
                </Typography>
                <form onSubmit={handleSubmit(handleRegist)} noValidate>
                    {/* エラーメッセージ表示 */}
                    {resError && (
                        <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                            {Object.values(resError).flat().map((error, index) => (
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        登録
                    </Button>
                </form>

                <Divider sx={{ width: "100%", my: 2 }} />

                {/* ログインリンク */}
                <Box sx={{ mt: 2 }}>
                    <Link href="/signin" passHref>
                        <Typography variant="body2" color="primary">
                            ログインはこちら
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </Container>
    );

};

export default SignupPage;