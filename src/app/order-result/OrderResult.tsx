'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import './order-result.css';

function formatPaymentType(type: string | null): string {
  if (!type) return '—';
  if (type.startsWith('Credit'))  return '信用卡';
  if (type.startsWith('WebATM'))  return 'WebATM';
  if (type.startsWith('ATM'))     return 'ATM 轉帳';
  if (type.startsWith('CVS'))     return '超商繳費';
  if (type.startsWith('BARCODE')) return '條碼繳費';
  if (type.startsWith('TWQR'))    return 'TWQR 行動支付';
  if (type.startsWith('ApplePay')) return 'Apple Pay';
  return type;
}

export default function OrderResult() {
  const params = useSearchParams();

  const success         = params.get('success') === 'true';
  const rtnMsg          = params.get('rtnMsg') ?? '';
  const merchantTradeNo = params.get('merchantTradeNo') ?? '';
  const tradeNo         = params.get('tradeNo') ?? '';
  const tradeAmt        = params.get('tradeAmt') ?? '';
  const paymentDate     = params.get('paymentDate') ?? '';
  const paymentType     = params.get('paymentType') ?? '';

  // 有帶交易參數才算有資料
  const hasData = !!merchantTradeNo;

  /* ── 粒子特效 ── */
  useEffect(() => {
    const canvas = document.getElementById('particleCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 32;
    const particles = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     Math.random() * 2.2 + 0.7,
      vx:    (Math.random() - 0.5) * 0.18,
      vy:    -(Math.random() * 0.22 + 0.06),
      alpha: Math.random() * 0.65 + 0.30,
      pulse: Math.random() * Math.PI * 2,
      hue:   Math.random() * 40 + 22,
    }));

    let animId: number;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.pulse += 0.018;
        p.x += p.vx + Math.sin(p.pulse * 0.7) * 0.12;
        p.y += p.vy;
        if (p.y < -4)              p.y = canvas.height + 4;
        if (p.x < -4)              p.x = canvas.width  + 4;
        if (p.x > canvas.width +4) p.x = -4;

        const twinkle = 0.5 + 0.5 * Math.sin(p.pulse);
        const a = p.alpha * twinkle;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0,   `hsla(${p.hue}, 90%, 88%, ${a})`);
        g.addColorStop(0.4, `hsla(${p.hue}, 80%, 72%, ${a * 0.55})`);
        g.addColorStop(1,   `hsla(${p.hue}, 70%, 55%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const cardClass = hasData
    ? `result-card ${success ? 'success' : 'failure'}`
    : 'result-card';

  const rows: { label: string; value: string }[] = [];
  if (merchantTradeNo) rows.push({ label: '訂單編號', value: merchantTradeNo });
  if (tradeNo)         rows.push({ label: '交易編號', value: tradeNo });
  if (paymentType)     rows.push({ label: '付款方式', value: formatPaymentType(paymentType) });
  if (paymentDate)     rows.push({ label: '付款時間', value: paymentDate });

  return (
    <>
      <canvas id="particleCanvas" />

      <div className="result-page">
        <div className={cardClass}>

          {/* 封印符文 */}
          <div className="result-seal">
            {hasData && !success ? '✕' : '✦'}
          </div>

          {/* 標題 */}
          <h1 className="result-title">
            {!hasData
              ? '找不到交易資訊'
              : success
                ? '付款成功'
                : '付款未完成'}
          </h1>

          {/* 金額 */}
          {hasData && tradeAmt && (
            <div className="result-amount">
              NT$ {parseInt(tradeAmt, 10).toLocaleString()}
            </div>
          )}

          {/* 綠界回傳訊息 */}
          {hasData && rtnMsg && (
            <div className="result-msg">{rtnMsg}</div>
          )}

          {/* 分隔線 + 明細 */}
          {hasData && rows.length > 0 && (
            <>
              <div className="result-divider" />
              <dl className="result-details">
                {rows.map(r => (
                  <div className="result-row" key={r.label}>
                    <dt className="result-label">{r.label}</dt>
                    <dd className="result-value">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          {/* 按鈕 */}
          <a href="/" className="result-btn">回到首頁</a>
        </div>
      </div>
    </>
  );
}
