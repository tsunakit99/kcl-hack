import { getCurrentUserId } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { supabaseServer } from "@/app/lib/supabaseServerClient";
import { validationEditSchema } from '@/validationSchema';
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      departmentId: true,
      introduction: true,
      image: true,
      department: { 
        select: {
          name: true,
        },
      },
    },
  });

  if (!user) {
    return new NextResponse(JSON.stringify({ message: 'ユーザが見つかりません' }), { status: 404 });
  }

  // 画像の公開URLを取得
  let imageUrl: string | null = null;
  if (user.image) {
    const { data } = await supabaseServer.storage
      .from('usericons')
      .getPublicUrl(user.image);
    
    if (!data) {
      console.log('画像のURL取得に失敗しました');
    } else {
      imageUrl = data.publicUrl;
    }
  }

  const responseData = {
    id: user.id,
    name: user.name,
    email: user.email,
    departmentId: user.departmentId,
    introduction: user.introduction,
    department: user.department,
    imageUrl, // 画像の公開 URL を追加
  };

  return new NextResponse(JSON.stringify(responseData), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const currentUserId = await getCurrentUserId();

  if (id !== currentUserId) {
    return new NextResponse(JSON.stringify({ message: '更新権限がありません' }), { status: 403 });
  }

  try {
    const formData = await req.formData();

    // フォームデータを取得
    const name = formData.get('name')?.toString();
    const departmentId = formData.get('departmentId')?.toString();
    const introduction = formData.get('introduction')?.toString();
    const image = formData.get('image') as File | null;

    // バリデーション
    const validationResult = await validationEditSchema.safeParseAsync({
      name,
      departmentId,
      introduction,
      image,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      console.log(errors);
      return new NextResponse(JSON.stringify({ message: '入力値が不正です', errors }), { status: 400 });
    }

    const { name: validName, departmentId: validDepartmentId, introduction: validIntroduction, image: validImage } = validationResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return new NextResponse(JSON.stringify({ message: 'ユーザが存在しません' }), { status: 400 });
    }

    // 名前の重複チェック
    const nameConflictUser = await prisma.user.findFirst({
      where: {
        name: validName,
        id: {
          not: id,
        },
      },
    });

    if (nameConflictUser) {
      return new NextResponse(JSON.stringify({ message: 'この名前は既に使用されています' }), { status: 400 });
    }

    // ファイルのバリデーションと保存
    let imageUrl = existingUser.image;
    if (validImage) {
      const fileExtension = path.extname(validImage.name || '').toLowerCase();
      const allowedExtensions = ['.jpg', '.jpeg'];

      if (!allowedExtensions.includes(fileExtension)) {
        return new NextResponse(JSON.stringify({ message: 'JPEG画像ファイルをアップロードしてください。' }), { status: 400 });
      }

      // 古い画像を削除
      if (existingUser.image) {
        const oldImagePath = existingUser.image; // e.g., 'profiles/userId/oldFileName.jpg'
        try {
          const { error: deleteError } = await supabaseServer.storage
            .from('usericons')
            .remove([oldImagePath]);

          if (deleteError) {
            console.error('古い画像の削除に失敗しました：', deleteError);
          }
        } catch (err) {
          console.error('古い画像の削除中にエラーが発生しました：', err);
        }
      }

      // 新しいファイルを保存
      const fileName = uuidv4() + fileExtension;
      const filePath = `profiles/${id}/${fileName}`; // ユーザーIDでフォルダ分け

      imageUrl = await uploadFileToSupabase(validImage, filePath);
    }

    // ユーザー情報の更新
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: validName,
        departmentId: validDepartmentId,
        introduction: validIntroduction,
        image: imageUrl || undefined,
      },
    });

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error(error);
    let errorMessage = 'ユーザの更新に失敗しました';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new NextResponse(JSON.stringify({ message: errorMessage }), { status: 500 });
  }
}

// Supabase Storageにファイルを保存する関数
async function uploadFileToSupabase(file: File, path: string): Promise<string> {
  const { data, error } = await supabaseServer.storage
    .from('usericons') // バケット名
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true, // 上書きする場合はtrue
    });

  if (error) {
    console.error('ファイルのアップロードに失敗しました：', error);
    throw new Error('ファイルのアップロードに失敗しました');
  }

  // data.path がアップロードされたファイルのパス
  return data.path;
}
