import { getCurrentUserId } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    if (!user) {
        return new NextResponse(JSON.stringify({ mesaage: 'ユーザが見つかりません' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(user));
}

export async function PUT(req: NextRequest, {params}: {params: {id: string}}) {
    const { id } = params;
    const currentUserId = await getCurrentUserId();

    if (id !== currentUserId) {
        return new NextResponse(JSON.stringify({ message: '更新権限がありません' }), { status: 403 });
    }

    const { name } = await req.json;

    try {
        const updateUser = await prisma.user.update({
            where: { id },
            data: { name },
        });
        return new NextResponse(JSON.stringify(updateUser));
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'ユーザの更新に失敗しました' }), { status: 500 });
    }
}