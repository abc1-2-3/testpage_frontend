import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCheckMacValue } from '@/lib/ecpay';

const ok = () => new Response('1|OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
const fail = (msg: string) => new Response(`0|${msg}`, { status: 200, headers: { 'Content-Type': 'text/plain' } });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data: Record<string, string> = {};
  for (const [k, v] of formData.entries()) data[k] = v.toString();

  const receivedMac = data['CheckMacValue'];
  if (!receivedMac) return fail('Missing CheckMacValue');

  const hashKey = process.env.ECPAY_HASH_KEY!;
  const hashIV = process.env.ECPAY_HASH_IV!;
  const generatedMac = generateCheckMacValue(data, hashKey, hashIV);

  if (receivedMac.toUpperCase() !== generatedMac.toUpperCase()) return fail('CheckMacValue Error');

  const merchantTradeNo = data['MerchantTradeNo'] ?? '';
  const rtnCode = data['RtnCode'] ?? '';
  const tradeAmtStr = data['TradeAmt'] ?? '0';
  const customField1 = data['CustomField1'] ?? '';

  const donation = await prisma.donation.findUnique({ where: { orderId: merchantTradeNo } });
  if (!donation) return fail('Order Not Found');

  // 冪等：已處理過直接回 OK
  if (donation.status === 'Paid') return ok();

  // 金額防篡改
  const tradeAmt = parseInt(tradeAmtStr, 10);
  if (!isNaN(tradeAmt) && tradeAmt !== donation.amount) return fail('Amount Mismatch');

  const resolvedUserId = donation.userId ?? (customField1 || null);
  const newStatus = rtnCode === '1' ? 'Paid' : 'Failed';

  await prisma.donation.update({
    where: { orderId: merchantTradeNo },
    data: { status: newStatus, userId: resolvedUserId },
  });

  return ok();
}
