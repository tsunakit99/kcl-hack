import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { email, otp, password } = await req.json();

    // OTPの検証
    const storedOtp = await prisma.otp.findUnique({ where: { email } });
    
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expires_at < new Date()) {
        return new NextResponse(JSON.stringify({ error: "無効なOTPか、期限切れです" }), { status: 400 });
    }

    // OTPが正しいのでユーザーを作成
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
        },
    });

    // OTPをDBから削除
    await prisma.otp.delete({ where: { email } });

    return new NextResponse(JSON.stringify({ message: "ユーザー登録が完了しました" }), { status: 201 });
}
