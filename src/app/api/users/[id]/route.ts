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
            introduction: true,
            image: true,
        },
    });

    if (!user) {
        return new NextResponse(JSON.stringify({ message: 'ユーザが見つかりません' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(user), {status: 200});
}

export async function PUT(req: NextRequest, {params}: {params: {id: string}}) {
    const { id } = params;
    const { name, introduction, departmentId, image } = await req.json();
    const currentUserId = await getCurrentUserId();

    if (id !== currentUserId) {
        return new NextResponse(JSON.stringify({ message: '更新権限がありません' }), { status: 403 });
    }

    if (await prisma.user.findFirst({
        where: {
            name,
            id: {
                not: id, // 自分のIDを除外
            },
        }
    })) {
         return new NextResponse(JSON.stringify({ error: "この名前は既に使用されています" }), { status: 400 });
    }

    try {
        const updateUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                departmentId,
                introduction,
                image,
             },
        });
        return new NextResponse(JSON.stringify(updateUser), {status: 200});
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'ユーザの更新に失敗しました' }), { status: 500 });
    }
};