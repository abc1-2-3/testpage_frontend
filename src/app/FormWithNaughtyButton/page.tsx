'use client';
import React, { useState } from 'react';
import NaughtyButton4 from '@/components/NaughtyButton4';
import NaughtyButton5 from '@/components/NaughtyButton5';

export default function FormWithNaughtyButton() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isEmpty = form.username.trim() === '' || form.password.trim() === '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (isEmpty) return;
    setIsSubmitted(true);
  };

  const reset = () => {
    setIsSubmitted(false);
    setForm({ username: '', password: '' });
  };

  return (
    <div className="relative w-full flex justify-center border border-gray-300 p-6">
      <div className="max-w-sm w-full flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-medium">帳號 *</span>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-medium">密碼 *</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
          />
        </label>

        <div className="relative w-full h-[200px] flex justify-center items-center">
          <NaughtyButton5
            label="送出表單"
            disabled={false}
            shouldRunAway={isEmpty}
            onClick={handleSubmit}
            rubbing={
              <div className="px-3 py-2 text-[#ff7530] border border-dashed border-[#ff7530]  text-sm">
                請完成表單
              </div>
            }
            fakeDisabled={isEmpty}
          />
          
        </div>
      </div>

      {isSubmitted && (
        <div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 rounded-xl bg-slate-600 bg-opacity-90 text-white transition-opacity duration-400 cursor-pointer"
          onClick={reset}
        >
          <span className="text-xl tracking-wide">表單已送出！(*´∀`)~♥</span>
          <span className="text-xs">點一下再來一次</span>
        </div>
      )}
    </div>
  );
}
