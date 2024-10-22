import { getCurrentUserId } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { uploaderId: string } }) {
    const { uploaderId } = params;
    console.log('getUserByIdルートからのparams確認')
    console.log(params);
    console.log('getUserByIdルートからのuploaderId確認')
    console.log(uploaderId);
    const exams = await prisma.exam.findMany({
        where: { uploaderId },
        select: {
            lecture: {
                select: { name: true },
            },
            department: {
                select: { name: true },
            },
            professor: true,
            year: true,
        },
    });

    console.log('getUserByIdルートからのexamsの確認');
    console.log(exams);

    const formattedExams = exams.map(exam => ({
        lectureName: exam.lecture.name, // lectureのnameを抽出
        departmentName: exam.department.name, // departmentのnameを抽出
        professor: exam.professor, // professorそのまま
        year: exam.year,
    }));
    console.log('formattedExamsの確認');
    console.log(formattedExams);

    if (!formattedExams) {
        return new NextResponse(JSON.stringify({ message: 'まだ何も投稿していません' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(formattedExams), {status: 200});
}