import prisma from '@/app/lib/prisma';
import { validationUploadExamSchema } from '@/validationSchema';
import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    console.error('試験の取得に失敗しました：', error);
    return new NextResponse(JSON.stringify({ message: '試験の取得に失敗しました。' }), { status: 500 });
  }
}

export async function PUT( req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log("更新対象のID:", id);

  if (!id) {
      return new NextResponse(JSON.stringify({ message: '試験が見つかりません' }), { status: 401 });
  }

  try {
    const formData = await req.formData();
    // フォームデータを取得
    const lectureName = formData.get('lectureName')?.toString();
    const departmentId = formData.get('departmentId')?.toString();
    const year = parseInt(formData.get('year')?.toString() || '');
    const professor = formData.get('professor')?.toString();
    const file = formData.get('file');

    if (!file) {
        return new NextResponse(JSON.stringify({ message: 'ファイルが正しくアップロードされていません。' }), { status: 400 });
    }

    // バリデーション
    const validationResult = await validationUploadExamSchema.safeParseAsync({
      lectureName,
      departmentId,
      year,
      professor,
      file
    });

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      console.log(errors);
      return new NextResponse(JSON.stringify({ message: '入力値が不正です', errors }), { status: 400 });
    }

    const { lectureName: validLectureName, departmentId: validDepartmentId, year: validYear, professor: validProfessor, file: validFile } = validationResult.data;

    const exam = await prisma.exam.findUnique({
      where: { id }
    });

    if (!exam) {
      return new NextResponse(JSON.stringify({ message: '試験が見つかりません' }), { status: 404 });
    }

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

    // 過去問情報の更新
    const editExam = await prisma.exam.update({
      where: { id },
      data: {
        lectureId: lecture.id,
        departmentId: validDepartmentId,
        year: validYear,
        professor: validProfessor,
        fileUrl, // 新しいファイルURL
      },
    });

    return new NextResponse(JSON.stringify(editExam), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ message: '過去問の更新に失敗しました' }), { status: 500 });
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

  return `/uploads/${fileName}`;
}
