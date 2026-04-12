'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './donations.css';

interface Donation {
  orderId: string;
  amount: number;
  donorName: string;
  message: string;
  status: 'Paid' | 'Failed' | 'Pending';
  createdAt: string;
}

const PAGE_SIZE = 10;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_LABEL: Record<string, string> = {
  Paid: '已付款',
  Failed: '失敗',
  Pending: '處理中',
};

export default function DonationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [items, setItems]       = useState<Donation[]>([]);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

  /* ── 未登入導回首頁 ── */
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/');
  }, [status, router]);

  /* ── 拉資料 ── */
  useEffect(() => {
    if (status !== 'authenticated') return;

    const token = (session as any).token as string | undefined;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    setLoading(true);
    setError(false);

    fetch(`${apiUrl}/api/ecpay/my-donations?page=${page}&pageSize=${PAGE_SIZE}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json();
      })
      .then((data: Donation[]) => {
        setItems(data);
        setHasMore(data.length === PAGE_SIZE);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [page, session, status]);

  /* ── 粒子特效 ── */
  useEffect(() => {
    const canvas = document.getElementById('particleCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 28 }, () => ({
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

  if (status === 'loading' || status === 'unauthenticated') return null;

  return (
    <>
      <canvas id="particleCanvas" />

      <div className="donations-page">
        <div className="donations-header">
          <div className="donations-seal">✦</div>
          <h1 className="donations-title">贊助紀錄</h1>
        </div>

        <div className="donations-container">
          {loading && (
            <p className="donations-empty">載入中…</p>
          )}

          {error && (
            <p className="donations-empty">無法載入資料，請稍後再試。</p>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="donations-empty">尚無贊助紀錄</p>
          )}

          {!loading && !error && items.map(item => (
            <div className="donation-item" key={item.orderId}>
              <div className="donation-info">
                <span className="donation-date">{formatDate(item.createdAt)}</span>
                {item.message && (
                  <span className="donation-message">「{item.message}」</span>
                )}
                <span className={`donation-status ${item.status.toLowerCase()}`}>
                  {STATUS_LABEL[item.status] ?? item.status}
                </span>
              </div>
              <div className="donation-amount">
                NT$ {item.amount.toLocaleString()}
              </div>
            </div>
          ))}

          {!loading && !error && items.length > 0 && (
            <>
              <div className="donations-divider" />
              <div className="donations-pagination">
                <button
                  className="page-btn"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                >
                  上一頁
                </button>
                <span className="page-info">第 {page} 頁</span>
                <button
                  className="page-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMore}
                >
                  下一頁
                </button>
              </div>
            </>
          )}

          <div style={{ textAlign: 'center' }}>
            <a href="/" className="donations-back">回到魔法書房</a>
          </div>
        </div>
      </div>
    </>
  );
}
