import React from 'react';
import type { Mood } from '../types';

interface DailyCheckInProps {
  onSave: (mood: Mood) => void;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onSave }) => {
  const moods: { value: Mood; label: string; emoji: string; color: string; border: string }[] = [
    { value: 'amazing', label: 'Amazing', emoji: '🤩', color: 'bg-emerald-100 hover:bg-emerald-200', border: 'border-emerald-300' },
    { value: 'good', label: 'Good', emoji: '🙂', color: 'bg-sky-100 hover:bg-sky-200', border: 'border-sky-300' },
    { value: 'okay', label: 'Okay', emoji: '😐', color: 'bg-slate-100 hover:bg-slate-200', border: 'border-slate-300' },
    { value: 'hard', label: 'Hard', emoji: '😓', color: 'bg-orange-100 hover:bg-orange-200', border: 'border-orange-300' },
    { value: 'pain', label: 'Pain', emoji: '🤕', color: 'bg-red-100 hover:bg-red-200', border: 'border-red-300' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-b-4 border-slate-200 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-xl font-black text-slate-800 mb-1">Workout Complete! 🎉</h3>
        <p className="text-slate-500 font-bold">How did the session feel today?</p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {moods.map((m) => (
          <button
            key={m.value}
            onClick={() => onSave(m.value)}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 border-b-4 transition-all transform active:scale-95 active:border-b-2 ${m.color} ${m.border}`}
          >
            <span className="text-3xl mb-1 filter drop-shadow-sm">{m.emoji}</span>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};