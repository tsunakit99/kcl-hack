import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
      const { lectureName, departmentId, year, professor } = await req.json();  

      const exams = await prisma.exam.findMany({
          where: {
              ...(lectureName && {
                  lecture: {
                      name: {
                          contains: lectureName,
                      },
                  },
              }),
              ...(departmentId && { departmentId }),
              ...(year && { year: parseInt(year) }),
              ...(professor && {
                  professor: {
                      contains: professor,
                  },
              }),
          },
          include: {
              lecture: true,
              department: true,
          },
      });

    return NextResponse.json(exams);
  } catch (error) {
    console.error('検索エラー:', error);
    return new NextResponse(JSON.stringify({ error: '検索に失敗しました' }), { status: 500 });
  }
}
