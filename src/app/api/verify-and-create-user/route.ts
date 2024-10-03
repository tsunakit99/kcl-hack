import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name, email, otp, password } = await req.json();

    // OTPの検証
    const storedOtp = await prisma.otp.findUnique({ where: { email } });
    
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expires_at < new Date()) {
        return new NextResponse(JSON.stringify({ error: "無効なOTPか、期限切れです" }), { status: 400 });
    }

    if (await prisma.user.findFirst( { where: { name } })) {
        return new NextResponse(JSON.stringify({ error: "この名前は既に使用されています" }), { status: 400 });
    } else {
        // OTPが正しいかつ名前が一意なのでユーザーを作成
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });
    }

    // OTPをDBから削除
    await prisma.otp.delete({ where: { email } });

    return new NextResponse(JSON.stringify({ message: "ユーザー登録が完了しました" }), { status: 201 });
}
