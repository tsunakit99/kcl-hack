import { getCurrentUserId } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { supabaseServer } from "@/app/lib/supabaseServerClient";
import { validationUploadExamSchema } from "@/validationSchema";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
        return new NextResponse(JSON.stringify({ message: '認証が必要です' }), { status: 401 });
    }

    try {
        const formData = await req.formData();

        // フォームデータを取得
        const lectureName = formData.get('lectureName')?.toString();
        const departmentId = formData.get('departmentId')?.toString();
        const tagId = formData.get('tagId')?.toString();
        const year = Number(formData.get('year'));
        const professor = formData.get('professor')?.toString() || undefined;
        const file = formData.get('file') as File | null;

        if (!file) {
            return new NextResponse(JSON.stringify({ message: 'ファイルが正しくアップロードされていません。' }), { status: 400 });
        }

        // 元のファイル名を取得
        const originalFileName = file.name;

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

        const { lectureName: validLectureName, departmentId: validDepartmentId, tagId: validTagId, year: validYear, professor: validProfessor, file: validFile } = validationResult.data;

        // ファイルのバリデーション
        if (!validFile) {
            return new NextResponse(JSON.stringify({ message: 'PDFファイルをアップロードしてください。' }), { status: 400 });
        }

        // 一意のファイル名を生成
        const fileName = uuidv4() + '.pdf';

        // ファイル保存パスをuploaderIdごとに設定
        const filePath = `exams/${currentUserId}/${fileName}`; // 各ユーザーのフォルダ内に保存

        // Supabaseにファイルをアップロード
        const uploadedFilePath = await uploadFileToSupabase(validFile, filePath);

        const lecture = await prisma.lecture.findUnique({
            where: { name: validLectureName },
        });

        if (!lecture) {
            return new NextResponse(JSON.stringify({ message: '入力された講義名は存在しません' }), { status: 400 });
        }

        // データベースに過去問データを保存
        const exam = await prisma.exam.create({
            data: {
                lectureId: lecture.id,
                departmentId: validDepartmentId,
                tagId: validTagId,
                year: validYear,
                professor: validProfessor,
                fileUrl: uploadedFilePath,
                originalFileName, // 元のファイル名を保存
                uploaderId: currentUserId,
            },
        });
      
        return new NextResponse(JSON.stringify(exam), { status: 200 });
    } catch (error: unknown) {
        console.error(error);
        let errorMessage = 'サーバーエラーが発生しました。';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return new NextResponse(JSON.stringify({ message: errorMessage }), { status: 500 });
    };
}

// Supabase Storageにファイルを保存する関数
async function uploadFileToSupabase(file: File, path: string): Promise<string> {
    const { data, error } = await supabaseServer.storage
        .from('uploads') // バケット名
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('ファイルのアップロードに失敗しました：', error);
        throw new Error('ファイルのアップロードに失敗しました');
    }

    // data.path がアップロードされたファイルのパス
    return data.path;
}
