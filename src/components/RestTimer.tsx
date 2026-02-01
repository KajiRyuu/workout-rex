import React, { useState, useEffect } from 'react';
import { Timer, X } from 'lucide-react';

export const RestTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (isActive) {
        // Simple vibration pattern to alert user if supported
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsActive(true);
    setIsOpen(true);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => startTimer(60)}
        className="fixed bottom-24 right-4 bg-slate-900 text-white p-4 rounded-full shadow-xl hover:bg-slate-800 transition-all border-4 border-slate-700 active:scale-95 z-40 flex items-center justify-center"
      >
        <Timer size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:w-80 bg-slate-900 text-white p-4 rounded-3xl shadow-2xl border-4 border-slate-700 z-40 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            <Timer size={20} className="text-sky-400" />
            <span className="font-black text-slate-300 text-xs uppercase tracking-wider">Rest Timer</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl font-black font-mono tracking-tighter tabular-nums text-white">
          {formatTime(timeLeft)}
        </div>
        <div className={`h-2 bg-slate-800 rounded-full mt-2 overflow-hidden`}>
            <div 
                className="h-full bg-sky-500 transition-all duration-1000 linear"
                style={{ width: `${(timeLeft / 90) * 100}%` }} // Assuming 90s max for visual bar
            ></div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button 
            onClick={toggleTimer}
            className={`col-span-2 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                isActive 
                ? 'bg-amber-500 hover:bg-amber-600 border-amber-700' 
                : 'bg-green-500 hover:bg-green-600 border-green-700'
            }`}
        >
            {isActive ? 'Pause' : 'Start'}
        </button>
        
        <button 
            onClick={() => startTimer(60)}
            className="bg-slate-700 hover:bg-slate-600 border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 py-2 rounded-xl font-bold text-sm transition-all"
        >
            60s
        </button>
        
        <button 
            onClick={() => startTimer(90)}
            className="bg-slate-700 hover:bg-slate-600 border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 py-2 rounded-xl font-bold text-sm transition-all"
        >
            90s
        </button>
      </div>
    </div>
  );
};