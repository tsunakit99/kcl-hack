"use client";

import { validationRegistSchema } from "@/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
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
        <>
            <div>
                <div>
                    <p>アカウント登録</p>
                    <form onSubmit={handleSubmit(handleRegist)}>
                        <label htmlFor="email">
                            <p>メールアドレス</p>
                            <input type="text" id="email" {...register("email")} />
                            <div>{errors.email?.message as React.ReactNode}
                                {resError?.email?.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        </label>
                        <label htmlFor="password">
                            <p>パスワード</p>
                            <input type="password" id="password" {...register("password")} />
                            <div>{errors.password?.message as React.ReactNode}
                                {resError?.password?.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        </label>
                        <label htmlFor="passwordConfirm">
                            <p>再確認パスワード</p>
                            <input type="password" id="passwordConfirm" {...register("passwordConfirm")} />
                            <div>{errors.passwordConfirm?.message as React.ReactNode}
                                {resError?.passwordConfirm?.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        </label>
                        <button type="submit">登録</button>
                    </form>
                    <Link href="/signin">ログインはこちら
                    </Link>
                </div>
            </div>
        </>
    );

};

export default SignupPage;