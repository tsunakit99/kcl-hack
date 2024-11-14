import { getCurrentUserId } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const currentUserId = await getCurrentUserId();
        if (!currentUserId) {
            return new NextResponse(JSON.stringify({ message: '認証が必要です' }), { status: 401 });
        }
        
        const { lectureName, departmentId, tagId, year, professor } = await req.json();  

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
                ...(tagId && { tagId }),
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
                tag: true,
            },
        });

    return NextResponse.json(exams);
  } catch (error) {
    console.error('検索エラー:', error);
    return new NextResponse(JSON.stringify({ error: '検索に失敗しました' }), { status: 500 });
  }
};
