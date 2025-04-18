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
  const btnRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ top: 200, left: 200 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleMouseMove = (e: MouseEvent) => {
    if (!shouldRunAway || disabled || !buttonRef.current) return;

    const btn = buttonRef.current.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const distance = Math.hypot(mouseX - (btn.left + btn.width / 2), mouseY - (btn.top + btn.height / 2));

    // 如果距離小於 80px 就逃跑
    if (distance < 80) {
      const maxTop = window.innerHeight - btn.height;
        const maxLeft = window.innerWidth - btn.width;
        const newTop = Math.random() * maxTop;
        const newLeft = Math.random() * maxLeft;
        setPosition({ top: newTop, left: newLeft });
    }
  };

  useEffect(() => {
    // const handleMouseMove = (e: MouseEvent) => {
    //   if (!shouldRunAway || disabled || !buttonRef.current) return;

    //   const btn = buttonRef.current.getBoundingClientRect();
    //   const mouseX = e.clientX;
    //   const mouseY = e.clientY;

    //   const distance = Math.hypot(
    //     mouseX - (btn.left + btn.width / 2),
    //     mouseY - (btn.top + btn.height / 2)
    //   );

    //   // 如果滑鼠靠近，就移動到隨機新位置（但不要超出畫面）
    //   if (distance < 80) {
    //     const maxTop = window.innerHeight - btn.height;
    //     const maxLeft = window.innerWidth - btn.width;
    //     const newTop = Math.random() * maxTop;
    //     const newLeft = Math.random() * maxLeft;
    //     setPosition({ top: newTop, left: newLeft });
    //   }
    // };
    // window.addEventListener('mousemove', handleMouseMove);
    // return () => window.removeEventListener('mousemove', handleMouseMove);
    const btn = btnRef.current;
    if (!btn) return;

    if (hovered && shouldRunAway && !disabled) {
      const x = Math.random() * 200 - 100;
      const y = Math.random() * 100 - 50;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    } else {
      btn.style.transform = 'translate(0, 0)';
    }
    
  }, [hovered, shouldRunAway, disabled]);
 // window.addEventListener('mousemove', handleMouseMove);

  return (
    <button
      ref={buttonRef}
      //className="transition-transform duration-300 bg-pink-400 text-white font-bold py-1 px-2 text-sm rounded-md"
      className="transition-transform duration-300 bg-pink-400 text-white font-bold py-2 px-4 text-sm rounded-md w-20"
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        transition: 'top 0.3s ease, left 0.3s ease',
      }}

      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
