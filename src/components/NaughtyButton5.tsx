'use client';
import React, { useEffect, useRef, useState } from 'react';

interface NaughtyButtonProps {
  label: string;
  shouldRunAway?: boolean;
  disabled?: boolean;
  fakeDisabled?: boolean;
  onClick?: () => void;
  rubbing?: React.ReactNode;
}

export default function NaughtyButton({
  label,
  shouldRunAway = false,
  disabled = false,
  fakeDisabled = false,
  onClick,
  rubbing,
}: NaughtyButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const observerRef = useRef<IntersectionObserver | null>(null);

  // 當滑鼠靠近，移動按鈕
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!shouldRunAway || !btnRef.current || !fakeDisabled) return;

    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

    // 單位向量
    const unitX = dx / distance;
    const unitY = dy / distance;

    const magnitude = 100; // 跑的距離（可調整）

    const nextX = pos.x + unitX * magnitude;
    const nextY = pos.y + unitY * magnitude;

    setPos({ x: nextX, y: nextY });
  };
   // 監測按鈕是否還在畫面內
   useEffect(() => {
    if (!btnRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setPos({ x: 0, y: 0 }); // 回原點
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(btnRef.current);
    observerRef.current = observer;

    return () => observer.disconnect();
    }, []);
  
    return (
      <div
      className="relative w-[10rem] h-[3rem] flex items-center justify-center"
      onMouseMove={handleMouseMove}
      //ref={wrapperRef} // 為了 IntersectionObserver 用
    >
      <button
        ref={btnRef}
        onClick={onClick}
        disabled={disabled}
        className={`absolute px-4 py-2 font-bold rounded transition-transform duration-300 ${
          disabled ? 'bg-gray-300 text-gray-500' : 'bg-pink-500 text-white'
        }`}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
        }}
      >
        {label}
      </button>
  
      {/* 請完成表單提示 */}
      {shouldRunAway && fakeDisabled && (
        <div >
          {rubbing}
        </div>
      )}
    </div>
    
    );
  }
