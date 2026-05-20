import crypto from 'crypto';

export function generateCheckMacValue(
  params: Record<string, string>,
  hashKey: string,
  hashIV: string,
): string {
  const sorted = Object.entries(params)
    .filter(([k]) => k !== 'CheckMacValue')
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)) // matches StringComparer.Ordinal
    .map(([k, v]) => `${k}=${v}`)
    .join('&');

  const raw = `HashKey=${hashKey}&${sorted}&HashIV=${hashIV}`;
  const encoded = encodeForEcpay(raw).toLowerCase();
  return crypto.createHash('sha256').update(encoded, 'utf8').digest('hex').toUpperCase();
}

// ECPay URL encode rules: keep unreserved chars, space→+, others→%XX (uppercase)
function encodeForEcpay(input: string): string {
  let result = '';
  for (const char of input) {
    if (/[A-Za-z0-9\-_.!*()~]/.test(char)) {
      result += char;
    } else if (char === ' ') {
      result += '+';
    } else {
      const bytes = Buffer.from(char, 'utf8');
      for (const byte of bytes) {
        result += `%${byte.toString(16).toUpperCase()}`;
      }
    }
  }
  return result;
}

export function generateMerchantTradeNo(): string {
  const now = new Date();
  const pad = (n: number, l = 2) => n.toString().padStart(l, '0');
  const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `DON${ts}${rand}`; // 20 chars, matches .NET format
}

export function buildAutoSubmitForm(actionUrl: string, params: Record<string, string>): string {
  const escHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const inputs = Object.entries(params)
    .map(([k, v]) => `    <input type="hidden" name="${escHtml(k)}" value="${escHtml(v)}" />`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8" />
  <title>前往付款中...</title>
  <style>
    body { font-family: "Noto Serif TC", serif; display: flex; flex-direction: column;
           align-items: center; justify-content: center; min-height: 100vh; margin: 0;
           background: #1a1228; color: #e8d5b7; }
    .rune { font-size: 48px; animation: spin 3s linear infinite; }
    p { font-size: 18px; margin-top: 16px; opacity: 0.8; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="rune">✦</div>
  <p>正在施展魔法，導向綠界付款頁面...</p>
  <form id="ecpay" action="${escHtml(actionUrl)}" method="post">
${inputs}
  </form>
  <script>setTimeout(function () { document.getElementById("ecpay").submit(); }, 500);</script>
</body>
</html>`;
}

export function getEcpayActionUrl(): string {
  return process.env.ECPAY_ENV === 'production'
    ? 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'
    : 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
}
