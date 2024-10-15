import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    if (query.length < 1) {
        return new NextResponse(JSON.stringify({ title: [] }));
    }

    const exams = await prisma.exams.findMany({
        where: {
            title: {
                contains: query,
            },
        },
        select: { title: true },
        distinct: ['title'],
        take: 10,
    });

    const titles = exams.map((exams) => exams.title);

    return new NextResponse(JSON.stringify({ titles }));
}

export async function POST(req: NextRequest) {
    try {
        const { title, departmentId, professor, year, fileUrl } = await req.json();

        // データの検証（必要に応じて）
        if (!title || !departmentId || !year) {
            return new NextResponse(JSON.stringify({ error: "必須フィールドが不足しています。" }), { status: 400 });
        }

        // データベースに挿入
        const exams = await prisma.exams.create({
            data: {
                title,
                departmentId,
                professor,
                year,
                fileUrl,
            },
        });

        return new NextResponse(JSON.stringify({ success: true, exams }), { status: 201 });
    } catch (error) {
        console.error("Error inserting exam:", error);
        return new NextResponse(JSON.stringify({ success: false, error: "データベースへの挿入中にエラーが発生しました。" }), { status: 500 });
    }
}