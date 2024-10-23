import { z } from "zod";

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
    departmentId: z
        .string()
        .min(1, "学科を選択してください"),
    introduction: z
        .string()
        .max(500, "紹介文は500文字以下です"),
    image: z.custom<File | null>((value) => {
    if (value === null || value === undefined) {
      // 画像は任意なので、nullまたはundefinedを許可
      return true;
    }
    // ファイルタイプがimage/jpegであることを確認
    if (value.type !== 'image/jpeg') {
      return false;
    }
    return true;
  }, {
    message: 'JPEG画像ファイルを選択してください。',
  }),
});

export const validationUploadExamSchema = z.object({
    lectureName: z.string().min(1, '講義名は必須です'),
    departmentId: z.string().min(1, '学科を選択してください'),
    year: z
        .number({ invalid_type_error: '年度は数値で入力してください' })
        .int('年度は整数で入力してください')
        .min(1900, '年度が不正です')
        .max(new Date().getFullYear(), '年度が不正です'),
    professor: z.string().optional(),
    file: z.custom<File[] | null>((file) => {
        // ファイルが null または空かどうかをチェック
        if (!file || file.length === 0) {
            return false;
        }
        return true;
    }, {
        message: 'ファイルは必須です'
    })
});