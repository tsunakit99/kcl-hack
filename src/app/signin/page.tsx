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
        <>
            <AuthLayout title="ようこそ！"
                children1={<><Typography component="h1" variant="h4" sx={{ position: 'relative', top: '-20px', fontFamily: 'Monospace' }}>
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