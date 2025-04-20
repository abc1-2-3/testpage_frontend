'use client';
import React, { useRef } from 'react';

type NaughtyButtonProps = {
  label: string;
  disabled?: boolean;
  shouldRunAway?: boolean;
  onClick?: () => void;
  rubbing?: React.ReactNode;
  fakeDisabled?: boolean;
};

const NaughtyButton: React.FC<NaughtyButtonProps> = ({
  label,
  disabled = false,
  fakeDisabled = false,
  shouldRunAway = false,
  onClick,
  rubbing,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveButton = () => {
    const button = btnRef.current;
    const container = containerRef.current;
    if (!button || !container) return;

    const btnWidth = button.offsetWidth;
    const btnHeight = button.offsetHeight;

    const maxX = container.clientWidth - btnWidth;
    const maxY = container.clientHeight - btnHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    button.style.transform = `translate(${randomX}px, ${randomY}px)`;
  };

  const handleMouseEnter = () => {
    if (shouldRunAway && !disabled) {
      moveButton();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-[10rem] h-[3rem] flex items-center justify-center" 
      //style={{ border: '1px dashed #ccc', borderRadius: '0.5rem' }}
    >
      <button
        ref={btnRef}
        onMouseEnter={handleMouseEnter}
        onClick={onClick}
        disabled={disabled}
        className={`absolute px-4 py-2 font-bold rounded transition-all duration-300
          ${disabled || fakeDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white'}
        `}>
        {label}
      </button>

      {shouldRunAway && !disabled && rubbing && (
        <div >{rubbing}</div>
      )}
    </div>
  );
};

export default NaughtyButton;
