// import { getCurrentUserId } from "@/app/lib/auth";
// import prisma from "@/app/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest, { params }: { params: { uploaderId: string } }) {
//     const { uploaderId } = params;
//     console.log('getUserByIdルートからのparams確認')
//     console.log(params);

//     const exams = await prisma.exam.findMany({
//         where: { uploaderId },
//         select: {
//             lecture: true,
//             department: true,
//             professor: true,
//             year: true,
//         },
//     });

//     console.log('getUserByIdルートからのexamsの確認');
//     console.log(exams);

//     if (exams.length === 0) {
//         return new NextResponse(JSON.stringify({ message: 'まだ何も投稿していません' }), { status: 404 });
//     }

//     return new NextResponse(JSON.stringify(exams), {status: 200});
// }