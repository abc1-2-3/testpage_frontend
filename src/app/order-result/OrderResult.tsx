'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import './order-result.css';

interface OrderStatus {
  status: 'Paid' | 'Failed' | 'Pending';
  amount?: number;
  donorName?: string;
  message?: string;
}

export default function OrderResult() {
  const params = useSearchParams();
  const merchantTradeNo = params.get('MerchantTradeNo') ?? params.get('merchantTradeNo') ?? '';

  const [data, setData]       = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  /* ── 輪詢後端訂單狀態 ── */
  useEffect(() => {
    if (!merchantTradeNo) {
      setLoading(false);
      setError(true);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    let attempts = 0;
    const MAX = 10;
    let timerId: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(`${apiUrl}/api/Ecpay/status/${merchantTradeNo}`);
        if (!res.ok) throw new Error('fetch failed');
        const json: OrderStatus = await res.json();
        if (json.status === 'Pending' && attempts < MAX) {
          attempts++;
          timerId = setTimeout(poll, 2000);
        } else {
          setData(json);
          setLoading(false);
        }
      } catch {
        setError(true);
        setLoading(false);
      }
    }

    poll();
    return () => clearTimeout(timerId);
  }, [merchantTradeNo]);

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

  /* ── 畫面 ── */
  const success = data?.status === 'Paid';

  const cardClass = loading || error
    ? 'result-card'
    : `result-card ${success ? 'success' : 'failure'}`;

  return (
    <>
      <canvas id="particleCanvas" />

      <div className="result-page">
        <div className={cardClass}>

          <div className="result-seal">
            {loading ? '…' : error ? '?' : success ? '✦' : '✕'}
          </div>

          <h1 className="result-title">
            {loading
              ? '確認付款中…'
              : error
                ? '找不到交易資訊'
                : success
                  ? '付款成功'
                  : '付款未完成'}
          </h1>

          {!loading && !error && data?.amount && (
            <div className="result-amount">
              NT$ {data.amount.toLocaleString()}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="result-divider" />
              <dl className="result-details">
                {merchantTradeNo && (
                  <div className="result-row">
                    <dt className="result-label">訂單編號</dt>
                    <dd className="result-value">{merchantTradeNo}</dd>
                  </div>
                )}
                {data?.donorName && (
                  <div className="result-row">
                    <dt className="result-label">贊助者</dt>
                    <dd className="result-value">{data.donorName}</dd>
                  </div>
                )}
                {data?.message && (
                  <div className="result-row">
                    <dt className="result-label">留言</dt>
                    <dd className="result-value">{data.message}</dd>
                  </div>
                )}
              </dl>
            </>
          )}

          <a href="/" className="result-btn">回到首頁</a>
        </div>
      </div>
    </>
  );
}
