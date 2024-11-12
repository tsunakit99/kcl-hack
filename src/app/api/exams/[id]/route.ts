import { getCurrentUserId } from '@/app/lib/auth';
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    return new NextResponse(JSON.stringify({ message: '認証が必要です' }), { status: 401 });
  }

  try {
    const exam = await prisma.exam.findUnique({
      where: { id },
    });

    if (!exam) {
       return new NextResponse(JSON.stringify({ message: '試験が見つかりませんでした。' }), { status: 404 });
    }

     if (exam.uploaderId !== currentUserId) {
      return new NextResponse(JSON.stringify({ message: '削除権限がありません。' }), { status: 403 });
     }
    
    const { error: storageError } = await supabaseServer.storage
      .from('uploads')
      .remove([exam.fileUrl]);

    if (storageError) {
      console.error('ファイルの削除に失敗しました:', storageError);
      return new NextResponse(JSON.stringify({ message: 'ファイルの削除に失敗しました。' }), { status: 500 });
    }

     await prisma.exam.delete({
      where: { id },
     });
    
    return new NextResponse(JSON.stringify({ message: '過去問が削除されました。' }), { status: 200 });
  } catch (error: unknown) {
     console.error('試験の削除に失敗しました：', error);
    return new NextResponse(JSON.stringify({ message: '試験の削除に失敗しました。' }), { status: 500 });
  }
};
