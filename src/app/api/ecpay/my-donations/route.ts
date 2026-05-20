import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') ?? '10', 10)));

  const donations = await prisma.donation.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return NextResponse.json(
    donations.map(d => ({
      orderId: d.orderId,
      amount: d.amount,
      donorName: d.donorName,
      message: d.message,
      status: d.status,
      createdAt: d.createdAt,
    })),
  );
}
