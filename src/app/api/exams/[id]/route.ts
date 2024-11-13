import { getCurrentUserId } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { supabaseServer } from '@/app/lib/supabaseServerClient';
import { UpdateExamData } from '@/app/types';
import { validationUploadExamSchema } from "@/validationSchema";
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
        uploader: true,
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const examId = params.id;
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
        return new NextResponse(JSON.stringify({ message: '認証が必要です' }), { status: 401 });
    }

    try {
        // 既存の過去問データを取得
        const existingExam = await prisma.exam.findUnique({
            where: {
                id: examId,
            },
        });

        if (!existingExam) {
            return new NextResponse(JSON.stringify({ message: '指定された過去問が存在しません' }), { status: 404 });
        }

        if (existingExam.uploaderId !== currentUserId) {
            return new NextResponse(JSON.stringify({ message: '更新する権限がありません' }), { status: 403 });
        }

        const formData = await req.formData();

        // フォームデータを取得
        const lectureName = formData.get('lectureName')?.toString();
        const departmentId = formData.get('departmentId')?.toString();
        const tagId = formData.get('tagId')?.toString();
        const year = Number(formData.get('year'));
        const professor = formData.get('professor')?.toString() || undefined;
        const file = formData.get('file') as File | null;

        // バリデーション
        const validationResult = await validationUploadExamSchema.safeParseAsync({
            lectureName,
            departmentId,
            tagId,
            year,
            professor,
            file,
        });

        if (!validationResult.success) {
            const errors = validationResult.error.flatten().fieldErrors;
            console.log(errors);
            return new NextResponse(JSON.stringify({ message: '入力値が不正です', errors }), { status: 400 });
        }

        const {
            lectureName: validLectureName,
            departmentId: validDepartmentId,
            tagId: validTagId,
            year: validYear,
            professor: validProfessor,
            file: validFile,
        } = validationResult.data;

        // lectureを取得
        const lecture = await prisma.lecture.findUnique({
            where: { name: validLectureName },
        });

        if (!lecture) {
            return new NextResponse(JSON.stringify({ message: '入力された講義名は存在しません' }), { status: 400 });
        }

        // 更新データの準備
        const updateData: UpdateExamData = {
            lectureId: lecture.id,
            departmentId: validDepartmentId,
            tagId: validTagId,
            year: validYear,
            professor: validProfessor,
        };

        if (validFile) {
            // 元のファイルを削除
            await deleteFileFromSupabase(existingExam.fileUrl);

            // ファイルアップロード
            const uploadedFilePath = await uploadFileToSupabase(validFile, existingExam.fileUrl);

            updateData.fileUrl = uploadedFilePath;
            updateData.originalFileName = validFile.name;
        }

        // 過去問データの更新
        const updatedExam = await prisma.exam.update({
            where: {
                id: examId,
            },
            data: updateData,
        });

        return new NextResponse(JSON.stringify(updatedExam), { status: 200 });
    } catch (error: unknown) {
        console.error(error);
        let errorMessage = 'サーバーエラーが発生しました。';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return new NextResponse(JSON.stringify({ message: errorMessage }), { status: 500 });
    }
}

// Supabase Storageにファイルを保存する関数
async function uploadFileToSupabase(file: File, path: string): Promise<string> {
    const { data, error } = await supabaseServer.storage
        .from('uploads') // バケット名
        .upload(path, file, {
            cacheControl: '3600',
            upsert: true, // 上書きする
        });

    if (error) {
        console.error('ファイルのアップロードに失敗しました：', error);
        throw new Error('ファイルのアップロードに失敗しました');
    }

    // data.path がアップロードされたファイルのパス
    return data.path;
}

// Supabase Storageからファイルを削除する関数
async function deleteFileFromSupabase(path: string): Promise<void> {
    const { error } = await supabaseServer.storage
        .from('uploads') // バケット名
        .remove([path]);

    if (error) {
        console.error('ファイルの削除に失敗しました：', error);
        throw new Error('ファイルの削除に失敗しました');
    }
};

