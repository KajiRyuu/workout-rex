import React from 'react';
import { Droplet, Plus, Minus } from 'lucide-react';

interface WaterTrackerProps {
  currentMl: number;
  goalMl: number;
  onAdd: (amount: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ currentMl, goalMl, onAdd }) => {
  const percentage = Math.min(100, Math.round((currentMl / goalMl) * 100));
  
  return (
    <div className="bg-white p-5 rounded-3xl border-2 border-b-4 border-slate-200 overflow-hidden relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-sky-100 p-3 rounded-2xl border border-sky-200">
            <Droplet size={24} className="text-sky-500 fill-sky-500" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-lg">Hydration</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Goal: {goalMl}ml</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-sky-500">{currentMl}</span>
          <span className="text-sm font-bold text-slate-400"> ml</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-5 border border-slate-200">
        <div 
          className="h-full bg-sky-400 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-between">
        <button 
          onClick={() => onAdd(-250)}
          disabled={currentMl <= 0}
          className="p-3 rounded-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-30 border-2 border-transparent hover:border-slate-200"
          title="Remove 250ml"
        >
           <Minus size={20} strokeWidth={3} />
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onAdd(250)}
            className="flex items-center gap-1 bg-sky-100 hover:bg-sky-200 text-sky-700 border-b-4 border-sky-300 active:border-b-0 active:translate-y-1 px-4 py-3 rounded-2xl text-xs font-black transition-all"
          >
            <Plus size={16} strokeWidth={4} /> 250ml
          </button>
          <button 
            onClick={() => onAdd(500)}
            className="flex items-center gap-1 bg-sky-500 hover:bg-sky-600 text-white border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 px-4 py-3 rounded-2xl text-xs font-black transition-all"
          >
            <Plus size={16} strokeWidth={4} /> 500ml
          </button>
        </div>
      </div>
    </div>
  );
};