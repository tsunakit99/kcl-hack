import { getCurrentUserId } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { supabaseServer } from '@/app/lib/supabaseServerClient';
import { commentSchema } from '@/validationSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const examId = params.id;
    const comments = await prisma.comment.findMany({
      where: { examId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 各ユーザーの画像URLを取得
    const commentsWithImageUrl = await Promise.all(
      comments.map(async (comment) => {
        let imageUrl = '/icon/default-profile.png';
        if (comment.user.image) {
          const { data } = await supabaseServer.storage
            .from('usericons')
            .getPublicUrl(comment.user.image);

          if (data) {
            imageUrl = data.publicUrl;
          }
        }

        return {
          ...comment,
          user: {
            ...comment.user,
            imageUrl,
          },
        };
      })
    );

    return NextResponse.json(commentsWithImageUrl);
  } catch (error) {
    console.error('コメント取得エラー:', error);
    return NextResponse.json({ error: 'コメントの取得に失敗しました' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const examId = params.id;
    const body = await req.json();
    const { content } = commentSchema.parse(body);

    const newComment = await prisma.comment.create({
      data: {
        content,
        examId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // ユーザーの画像URLを取得
    let imageUrl = '/icon/default-profile.png';
    if (newComment.user.image) {
      const { data } = await supabaseServer.storage
        .from('usericons')
        .getPublicUrl(newComment.user.image);

      if (data) {
        imageUrl = data.publicUrl;
      }
    }

    // `user` オブジェクトに `imageUrl` を追加
    const commentWithImageUrl = {
      ...newComment,
      user: {
        ...newComment.user,
        imageUrl,
      },
    };

    return NextResponse.json(commentWithImageUrl);
  } catch (error) {
    console.error('コメント投稿エラー:', error);
    return NextResponse.json({ error: 'コメントの投稿に失敗しました' }, { status: 500 });
  }
}

export async function DELETE( req: NextRequest ) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json({ error: 'コメントIDが必要です' }, { status: 400 });
    }

    // コメントの所有者を確認
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== userId) {
      return NextResponse.json({ error: 'コメントを削除する権限がありません' }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: 'コメントを削除しました' });
  } catch (error) {
    console.error('コメント削除エラー:', error);
    return NextResponse.json({ error: 'コメントの削除に失敗しました' }, { status: 500 });
  }
};
