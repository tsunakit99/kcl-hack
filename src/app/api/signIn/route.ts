import prisma from "@/app/lib/prisma";
import { validationLoginSchema } from "@/validationSchema";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  
  const validationResult = await validationLoginSchema.safeParseAsync(data);

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    return new NextResponse(JSON.stringify({ errors }), { status: 400 });
  }

  const { email, password } = validationResult.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) throw new Error("メールアドレスが間違っています");
    if (user?.password) {
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        throw new Error("パスワードが間違っています");
      }
    }
  } catch (error) {
  if (error instanceof Error) { // error が Error 型か確認
    return new NextResponse(
      JSON.stringify({ errors: [error.message] }), 
      { status: 400 }
    );
  } else {
    return new NextResponse(
      JSON.stringify({ errors: "不明なエラーが発生しました" }), 
      { status: 500 }
    );
  }
}
  return new NextResponse(JSON.stringify({ message: "Success" }), {status: 200});
};
