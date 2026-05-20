import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const donation = await prisma.donation.findUnique({ where: { orderId } });

  if (!donation) return NextResponse.json({ error: '找不到訂單' }, { status: 404 });

  return NextResponse.json({
    orderId: donation.orderId,
    amount: donation.amount,
    donorName: donation.donorName,
    message: donation.message,
    status: donation.status,
    createdAt: donation.createdAt,
  });
}
