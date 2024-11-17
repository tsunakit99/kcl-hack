import { getCurrentUserId } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { supabaseServer } from '@/app/lib/supabaseServerClient';
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

        // 各examに対して署名付きURLを取得し、fileUrlを更新
  const examsWithSignedUrl = await Promise.all(
    exams.map(async (exam) => {
      let signedFileUrl: string | null = null;
      if (exam.fileUrl) {
        const { data, error } = await supabaseServer.storage
          .from('uploads')
          .createSignedUrl(exam.fileUrl, 60 * 60); // 有効期限を1時間に設定

        if (error) {
          console.error('署名付きURLの取得に失敗しました:', error);
        } else {
          signedFileUrl = data.signedUrl;
        }
      }

      return {
        ...exam,
        fileUrl: signedFileUrl,
      };
    })
  );

  return new NextResponse(JSON.stringify(examsWithSignedUrl), { status: 200 });
  } catch (error) {
    console.error('検索エラー:', error);
    return new NextResponse(JSON.stringify({ error: '検索に失敗しました' }), { status: 500 });
  }
};
