"use client";

import { validationLoginSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import GitHubIcon from '@mui/icons-material/GitHub';
import { Alert, Button, Divider, TextField, Typography } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AuthLayout from "../components/AuthLayout";
import LeftLineText from "../components/LeftLineText";
import { SigninFormData } from "../types";
import { logIn } from "./actions";




const SigninPage = () => {
    const { data: session, status } = useSession();
    const [resError, setResError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        
    } = useForm<SigninFormData>({
        mode: "onBlur",
        resolver: zodResolver(validationLoginSchema),
    });

    if (session) redirect("/");

    const handleLogin = async (data: SigninFormData) => {
        const result = await logIn(data);
        if (result.success) {
            signIn("credentials", { email: data.email, password: data.password });
        } else {
            setResError(result.error);
        }
    };

    return (
        <>
            <AuthLayout title="ようこそ！"
                children1={<><Typography component="h1" variant="h4" sx={{ position: 'relative', top: '-20px', fontFamily: 'Monospace' }}>
                    ログイン
                </Typography>
                    <form onSubmit={handleSubmit(handleLogin)} noValidate>
                        {/* エラーメッセージ表示 */}
                        {resError && (
                            <Alert severity="error" sx={{ mt: 2, width: "90%" }}>
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
                        startIcon={<GitHubIcon style={{ color: "#000" }} />}
                        onClick={() => {
                            signIn("github");
                        }}
                        sx={{
                            textTransform: "none",

                        }}
                    >
                        Githubでログイン
                    </Button> </>}
                children2={<Link href="/signup" passHref>
                    <LeftLineText title="新規登録はこちら" />
                </Link>}
            />
        </>
            
        //                 {/* <button onClick={() => {
        //                     signIn("google");
        //                 }}>Googleでログイン</button> */}

    );
};

export default SigninPage;