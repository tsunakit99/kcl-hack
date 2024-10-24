// app/api/lectures/names/route.ts

import prisma from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';

  if (query.length < 1) {
      return new NextResponse(JSON.stringify({ names: [] }));
  }

  const lectures = await prisma.lecture.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    select: { name: true },
    distinct: ['name'],
    take: 10,
  });

  const names = lectures.map((lecture) => lecture.name);

    return new NextResponse(JSON.stringify({ names }));
}
