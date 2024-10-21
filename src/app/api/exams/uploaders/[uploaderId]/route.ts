import { getCurrentUserId } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { validationEditSchema } from '@/validationSchema';
import { promises as fs } from 'fs';
import f from 'fs/promises';
import { NextRequest, NextResponse } from "next/server";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest, { params_exam }: { params_exam: { uploaderId: string } }) {
    const { uploaderId } = params_exam;

    const exams = await prisma.exam.findMany({
        where: { uploaderId },
        select: {
            lecture: true,
            department: true,
            professor: true,
        },
    });

    console.log('examsの確認');
    console.log(exams);

    if (!exams) {
        return new NextResponse(JSON.stringify({ message: 'まだ何も投稿していません' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(exams), {status: 200});
}