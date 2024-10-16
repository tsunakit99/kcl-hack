import { getCurrentUserId } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { validationUploadExamSchema } from "@/validationSchema";
import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from "next/server";
import path from "path";
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
        const year = Number(formData.get('year'));
        const professor = formData.get('professor')?.toString() || undefined;
        const file = formData.get('file'); // 単一のファイルを取得

        console.log(file); // ファイルが何か確認するためのログ出力

        if (!file) {
            return new NextResponse(JSON.stringify({ message: 'ファイルが正しくアップロードされていません。' }), { status: 400 });
        }

        // バリデーション
        const validationResult = await validationUploadExamSchema.safeParseAsync({
            lectureName,
            departmentId,
            year,
            professor,
            file,
        });

        if (!validationResult.success) {
            const errors = validationResult.error.flatten().fieldErrors;
            console.log(errors);
            return new NextResponse(JSON.stringify({ message: '入力値が不正です', errors }), { status: 400 });
        }

        const { lectureName: validLectureName, departmentId: validDepartmentId, year: validYear, professor: validProfessor, file: validFile } = validationResult.data;

        // ファイルのバリデーション
        if (validFile?.length === 0 ) {
            return new NextResponse(JSON.stringify({ message: 'PDFファイルをアップロードしてください。' }), { status: 400 });
        }

        // ファイル保存処理
        const fileUrl = await saveFileToLocal(validFile);

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
                year: validYear,
                professor: validProfessor,
                fileUrl,
                uploaderId: currentUserId,
            },
        });

        return new NextResponse(JSON.stringify(exam), { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: 'サーバーエラーが発生しました。' }), { status: 500 });
    }
}

// ローカルファイルに保存する関数
async function saveFileToLocal(file: any): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = uuidv4() + path.extname(file.name || '');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    return `/uploads/${fileName}`;
}
