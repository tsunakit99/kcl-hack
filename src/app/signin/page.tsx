"use client";

import { validationLoginSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const SigninPage = () => {
    const { data: session, status } = useSession();
    const [resError, setResError] = useState<Error>();
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        
    } = useForm({
        mode: "onChange",
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
            setResError(resError.errors);
        }
    };

    return (
        <>
            <div>
                <div>
                    <p>ログイン画面</p>
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div>{resError as React.ReactNode}</div>
                        <label htmlFor="email">
                            <p>メールアドレス</p>
                            <input type="text" id="email" {...register("email")} />
                            <div>{errors.email?.message as React.ReactNode}</div>
                        </label>
                        <label htmlFor="password">
                            <p>パスワード</p>
                            <input type="password" id="password" {...register("password")} />
                            <div>{errors.password?.message as React.ReactNode}</div>
                        </label>
                        <button type="submit">ログイン</button>
                    </form>
                    <hr />
                    <div>
                        <button onClick={() => {
                            signIn("github");
                        }}>Githubでログイン</button>
                        {/* <button onClick={() => {
                            signIn("google");
                        }}>Googleでログイン</button> */}
                        <Link href="/signup">
                            新規登録はこちら</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SigninPage;