import { getCurrentUserId } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { supabaseServer } from "@/app/lib/supabaseServerClient";
import { NextResponse } from "next/server";

export async function GET() {

  const currentUserId = await getCurrentUserId();
   if (!currentUserId) {
     return new NextResponse(JSON.stringify({ message: '認証が必要です' }), { status: 401 });
   }
  
    const exams = await prisma.exam.findMany({
        include: {
            lecture: true,
            department: true,
            tag: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 10,
    });

    if (!exams) {
        return new NextResponse(JSON.stringify({ error: '過去問取得に失敗しました' }), { status: 400 });
    }

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
}