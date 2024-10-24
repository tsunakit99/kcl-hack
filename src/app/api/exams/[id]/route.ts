import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        lecture: true,
        department: true,
      },
    });

    if (!exam) {
      return new NextResponse(JSON.stringify({ message: '試験が見つかりませんでした。' }), { status: 404 });
    }

    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    console.error('試験の取得に失敗しました：', error);
    return new NextResponse(JSON.stringify({ message: '試験の取得に失敗しました。' }), { status: 500 });
  }
}
