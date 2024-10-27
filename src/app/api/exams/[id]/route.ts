import prisma from '@/app/lib/prisma';
import { supabaseServer } from '@/app/lib/supabaseServerClient';
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
    
    // ファイルの署名付きURLを取得
    let fileUrl: string | null = null;
    if (exam.fileUrl) {
      const { data, error } = await supabaseServer.storage
        .from('uploads')
        .createSignedUrl(exam.fileUrl, 60 * 60); // 1時間有効

      if (error) {
        console.error('署名付きURLの取得に失敗しました:', error);
      } else {
        fileUrl = data.signedUrl;
      }
    }

    const responseData = {
    ...exam,
    fileUrl, // 画像の公開 URL を追加
  };

    return new NextResponse(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error('試験の取得に失敗しました：', error);
    return new NextResponse(JSON.stringify({ message: '試験の取得に失敗しました。' }), { status: 500 });
  }
}
