import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    if (query.length < 1) {
        return new NextResponse(JSON.stringify({ title: [] }));
    }

    const exams = await prisma.exam.findMany({
        where: {
            title: {
                contains: query,
            },
        },
        select: { title: true },
        distinct: ['title'],
        take: 10,
    });

    const titles = exams.map((exam) => exam.title);

    return new NextResponse(JSON.stringify({ titles }));
}