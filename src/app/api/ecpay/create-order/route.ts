import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  generateCheckMacValue,
  generateMerchantTradeNo,
  buildAutoSubmitForm,
  getEcpayActionUrl,
} from '@/lib/ecpay';

function getBaseUrl(req: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  const host = req.headers.get('host') ?? 'localhost:3000';
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: '無效的請求' }, { status: 400 });

  const { amount, donorName, message } = body as {
    amount: number;
    donorName: string;
    message?: string;
  };

  if (!amount || amount < 10 || amount > 100000)
    return NextResponse.json({ error: '金額需介於 10 ~ 100,000 元' }, { status: 400 });

  if (!donorName?.trim())
    return NextResponse.json({ error: '贊助者名稱不可為空' }, { status: 400 });

  const session = await auth();
  const userId = session?.userId ?? null;

  const orderId = generateMerchantTradeNo();
  await prisma.donation.create({
    data: {
      orderId,
      amount,
      donorName: donorName.trim(),
      message: message?.trim() ?? null,
      status: 'Pending',
      userId,
    },
  });

  const baseUrl = getBaseUrl(req);
  const merchantId = process.env.ECPAY_MERCHANT_ID!;
  const hashKey = process.env.ECPAY_HASH_KEY!;
  const hashIV = process.env.ECPAY_HASH_IV!;

  const params: Record<string, string> = {
    MerchantID: merchantId,
    MerchantTradeNo: orderId,
    MerchantTradeDate: formatEcpayDate(new Date()),
    PaymentType: 'aio',
    TotalAmount: String(amount),
    TradeDesc: 'Magic Library Donation',
    ItemName: `${donorName.trim()} Magic Donation`,
    ReturnURL: `${baseUrl}/api/ecpay/notify`,
    OrderResultURL: `${baseUrl}/api/ecpay/result`,
    ClientBackURL: `${baseUrl}/order-result`,
    ChoosePayment: 'Credit',
    EncryptType: '1',
    CustomField1: userId ?? '',
  };

  params.CheckMacValue = generateCheckMacValue(params, hashKey, hashIV);

  const html = buildAutoSubmitForm(getEcpayActionUrl(), params);
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function formatEcpayDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
