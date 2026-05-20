import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));

  const donations = await prisma.donation.findMany({
    where: { status: 'Paid' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { donorName: true, amount: true, message: true, createdAt: true },
  });

  return NextResponse.json(donations);
}
