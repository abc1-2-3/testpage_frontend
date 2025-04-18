'use client';

import { useEffect, useRef, useState } from 'react';

interface NaughtyButtonProps {
  label?: string;
  disabled?: boolean;
  shouldRunAway?: boolean;
}

export default function NaughtyButton({
  label = '調皮的按鈕',
  disabled = false,
  shouldRunAway = false,
}: NaughtyButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 200, left: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!shouldRunAway || disabled || !buttonRef.current) return;

      const btn = buttonRef.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const distance = Math.hypot(
        mouseX - (btn.left + btn.width / 2),
        mouseY - (btn.top + btn.height / 2)
      );

      // 如果滑鼠靠近，就移動到隨機新位置（但不要超出畫面）
      if (distance < 80) {
        const maxTop = window.innerHeight - btn.height;
        const maxLeft = window.innerWidth - btn.width;
        const newTop = Math.random() * maxTop;
        const newLeft = Math.random() * maxLeft;
        setPosition({ top: newTop, left: newLeft });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldRunAway, disabled]);

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        transition: 'top 0.3s ease, left 0.3s ease',
      }}
      className="bg-pink-400 text-white font-bold py-2 px-4 text-sm rounded-md"
    >
      {label}
    </button>
  );
}
