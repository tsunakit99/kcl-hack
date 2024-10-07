import { z } from "zod"

export const validationRegistSchema = z.object({
    name: z
        .string()
        .min(1, "名前を入力してください")
        .max(20, "名前は20文字以下です"),
    email: z
        .string()
        .min(1,"メールアドレスを入力してください")
        .email("無効なメールアドレス形式です")
        .refine((email) => email.endsWith("@mail.kyutech.jp"), {
            message: "許可されていないドメインです。",
        }),
    password: z
        .string()
        .min(1, "パスワードを入力してください")
        .min(8, "パスワードは8文字以上です"),
    passwordConfirm: z
        .string()
        .min(1, "再確認パスワードを入力してください")
})
.superRefine(({ password, passwordConfirm }, ctx) =>  {
    if (password !== passwordConfirm) {
        ctx.addIssue({
            code: "custom",
            message: "パスワードが一致しません",
            path: ["passwordConfirm"],
        })
    }
})

export const validationLoginSchema = z.object({
    email: z
        .string()
        .min(1, "メールアドレスを入力してください"),
    password: z
        .string()
        .min(1, "パスワードを入力してください")
})

export const validationEditSchema = z.object({
    name: z
        .string()
        .min(1, "名前を入力してください")
        .max(20, "名前は20文字以下です"),
})