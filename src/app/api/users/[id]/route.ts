import { getCurrentUserId } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { validationEditSchema } from '@/validationSchema';
import { promises as fs } from 'fs';
import f from 'fs/promises';
import { NextRequest, NextResponse } from "next/server";
import path from 'path';
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
        },
    });
  
    console.log('ルートからのuserの確認');
    console.log(user);

    if (!user) {
        return new NextResponse(JSON.stringify({ message: 'ユーザが見つかりません' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(user), {status: 200});
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
    const image = formData.get('image');

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
      if (typeof validImage === 'object' && 'arrayBuffer' in validImage) {
        const fileExtension = path.extname(validImage.name || '').toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg'];

        if (!allowedExtensions.includes(fileExtension)) {
          return new NextResponse(JSON.stringify({ message: 'JPEG画像ファイルをアップロードしてください。' }), { status: 400 });
        }
          
          if (existingUser.image) {
              const oldImagePath = path.join(process.cwd(), 'public', existingUser.image);
              try {
                  await f.unlink(oldImagePath);
              } catch (err) {
                  console.error('古い画像の削除に失敗しました:', err);
              }
          }

        // ファイルを保存
        imageUrl = await saveFileToLocal(validImage);
      } else {
        return new NextResponse(JSON.stringify({ message: '画像ファイルが正しくアップロードされていません。' }), { status: 400 });
        }
      };

    // ユーザー情報の更新
    const updateUser = await prisma.user.update({
      where: { id },
      data: {
        name: validName,
        departmentId: validDepartmentId,
        introduction: validIntroduction,
        image: imageUrl || undefined,
      },
    });

    return new NextResponse(JSON.stringify(updateUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: 'ユーザの更新に失敗しました' }), { status: 500 });
    }
}

// ローカルファイルに保存する関数
async function saveFileToLocal(file: any): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileName = uuidv4() + path.extname(file.name || '');
  const uploadDir = path.join(process.cwd(), 'public', 'images');
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);

  return `/images/${fileName}`;
}