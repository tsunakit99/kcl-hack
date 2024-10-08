import prisma from "@/app/lib/prisma";
import { validationRegistSchema } from "@/validationSchema";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// OTP生成関数
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// メール送信関数
async function sendOTPEmail(email:string, otp:string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOption = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'ワンタイムパスワード',
        text: `あなたのワンタイムパスワードは、${otp}です`,
    };

    await transporter.sendMail(mailOption);
}


export async function POST(req: NextRequest) {
    const data = await req.json();
    const { email, name } = data;

    // メールアドレスおよび名前の重複確認とバリデーションを同時に行う
    const [userByEmail, userByName, validationResult] = await Promise.all([
        prisma.user.findFirst({ where: { email } }),    // email 重複確認
        prisma.user.findFirst({ where: { name } }),     // name 重複確認
        validationRegistSchema.safeParseAsync(data)     // バリデーション
    ]);

    // バリデーションエラー処理
    let errors = validationResult.success ? {} : validationResult.error.flatten().fieldErrors;

    // 名前の重複エラー
    if (userByName) {
        errors.name = [...(errors.name || []), "この名前は既に使用されています"];
    }

    // メールアドレスの重複エラー
    if (userByEmail) {
        errors.email = [...(errors.email || []), "このメールアドレスは既に使用されています"];
    }
    
    if (Object.keys(errors).length > 0) {
         console.log("バリテーションエラー:", errors); 
        return new NextResponse(JSON.stringify({ errors }), { status: 400 });
    }

    // OTP生成
    const otp = generateOTP();

    // OTPをユーザにメールで送信
    await sendOTPEmail(email, otp);

    if (await prisma.otp.findFirst({ where: { email } })) {
        await prisma.otp.update({
            where: { email },
            data: {
                email,
                otp,
                expires_at: new Date(Date.now() + 10 * 60 * 1000),
            }
        });
    } else {
        // OTPをDBに一時的に保存
        await prisma.otp.create({
            data: {
                email,
                otp,
                expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10分後にOTP無効
            },
        });
    }

    return new NextResponse(JSON.stringify({ message: "メールにワンタイムパスワードを送信しました" }), { status: 200 });
    
}