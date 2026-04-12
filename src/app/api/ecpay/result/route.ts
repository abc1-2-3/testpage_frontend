import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const merchantTradeNo = body.get('MerchantTradeNo') as string ?? '';

  const url = new URL('/order-result', req.nextUrl.origin);
  if (merchantTradeNo) {
    url.searchParams.set('MerchantTradeNo', merchantTradeNo);
  }

  return NextResponse.redirect(url, 303);
}
