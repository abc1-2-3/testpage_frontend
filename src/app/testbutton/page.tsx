'use client';
import NaughtyButton2 from '@/components/NaughtyButton2';
import NaughtyButton from '../../components/NaughtyButton';
import React, { useState } from 'react';
import NaughtyButton3 from '@/components/NaughtyButton3';
export default function DemoPage() {
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-6 border border-gray-300 rounded flex flex-col gap-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={disabled}
          onChange={() => setDisabled(!disabled)}
        />
        停用按鈕
      </label>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="請輸入文字"
        className="w-full px-4 py-2 border rounded"
      />
<div className="flex justify-center">
<NaughtyButton3
        label="調皮的按鈕"
        disabled={disabled}
        shouldRunAway={text.trim() === ''}
      /></div>
    </div>
    
  );
}
