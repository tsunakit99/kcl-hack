import { getCurrentUserId } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { uploaderId: string } }) {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
        return new NextResponse(JSON.stringify({ message: '認証が必要です' }), { status: 401 });
    }
    
    const { uploaderId } = params;
    const exams = await prisma.exam.findMany({
        where: { uploaderId },
        select: {
            id: true,
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

    const formattedExams = exams.map(exam => ({
        id: exam.id,
        lectureName: exam.lecture.name, // lectureのnameを抽出
        departmentName: exam.department.name, // departmentのnameを抽出
        professor: exam.professor, // professorそのまま
        year: exam.year,
    }));

    if (!formattedExams) {
        return new NextResponse(JSON.stringify({ message: 'まだ何も投稿していません' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(formattedExams), {status: 200});
}