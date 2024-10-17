import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const exams = await prisma.exam.findMany({
        include: {
            lecture: true,
            department: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (!exams) {
        return new NextResponse(JSON.stringify({ error: '過去問取得に失敗しました' }), { status: 400 });
    }

    return new NextResponse(JSON.stringify(exams), {status:200});
}