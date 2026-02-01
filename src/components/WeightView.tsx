import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { WeightEntry } from '../types';
import { INITIAL_WEIGHT } from '../constants';
import { Plus, AlertTriangle, Edit2, Ruler } from 'lucide-react';

interface WeightViewProps {
  history: WeightEntry[];
  onAddEntry: (weight: number) => void;
  needsUpdate: boolean;
  height: number;
  onUpdateHeight: (cm: number) => void;
}

export const WeightView: React.FC<WeightViewProps> = ({ 
  history, 
  onAddEntry, 
  needsUpdate, 
  height, 
  onUpdateHeight 
}) => {
  const [newWeight, setNewWeight] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [tempHeight, setTempHeight] = useState(height.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(newWeight);
    
    if (isNaN(weight) || weight < 40 || weight > 300) {
      setError('Please enter a valid weight.');
      return;
    }

    onAddEntry(weight);
    setNewWeight('');
    setError('');
  };

  const handleHeightSubmit = () => {
      const h = parseFloat(tempHeight);
      if(!isNaN(h) && h > 50 && h < 300) {
          onUpdateHeight(h);
          setIsEditingHeight(false);
      }
  }

  const chartData = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const currentWeight = history.length > 0 ? history[history.length - 1].weight : INITIAL_WEIGHT;
  const totalLoss = INITIAL_WEIGHT - currentWeight;
  const heightInMeters = height / 100;
  const bmi = currentWeight / (heightInMeters * heightInMeters);
  
  let bmiColor = 'text-slate-900';
  let bmiLabel = 'Normal';
  if (bmi < 18.5) { bmiLabel = 'Underweight'; bmiColor = 'text-sky-600'; }
  else if (bmi < 25) { bmiLabel = 'Healthy'; bmiColor = 'text-green-600'; }
  else if (bmi < 30) { bmiLabel = 'Overweight'; bmiColor = 'text-orange-600'; }
  else { bmiLabel = 'Obese'; bmiColor = 'text-red-600'; }

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-b-4 border-slate-200">
        <h2 className="text-xl font-black text-slate-800 mb-6">Body Stats</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Current Weight */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wide mb-1">Current</p>
                <p className="text-3xl font-black text-slate-900">{currentWeight} <span className="text-sm font-bold text-slate-400">kg</span></p>
            </div>

            {/* BMI */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wide mb-1">BMI</p>
                <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-black ${bmiColor}`}>{bmi.toFixed(1)}</p>
                </div>
                <p className={`text-xs font-bold ${bmiColor}`}>{bmiLabel}</p>
            </div>

             {/* Height (Editable) */}
             <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 relative group">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    Height <Ruler size={12} strokeWidth={3} />
                </p>
                
                {isEditingHeight ? (
                    <div className="flex items-center gap-2">
                        <input 
                            autoFocus
                            type="number" 
                            value={tempHeight}
                            onChange={(e) => setTempHeight(e.target.value)}
                            onBlur={handleHeightSubmit}
                            onKeyDown={(e) => e.key === 'Enter' && handleHeightSubmit()}
                            className="w-16 p-1 text-xl font-bold border rounded bg-white"
                        />
                        <span className="text-sm font-bold text-slate-500">cm</span>
                    </div>
                ) : (
                    <div 
                        onClick={() => setIsEditingHeight(true)}
                        className="cursor-pointer hover:bg-slate-100 rounded transition-colors -ml-1 pl-1"
                    >
                        <p className="text-3xl font-black text-slate-900 flex items-center gap-2">
                            {height} <span className="text-sm font-bold text-slate-400">cm</span>
                            <Edit2 size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                    </div>
                )}
            </div>

            {/* Total Loss */}
            <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-100">
                <p className="text-xs font-black text-sky-400 uppercase tracking-wide mb-1">Lost</p>
                <p className="text-3xl font-black text-sky-500">
                    {totalLoss > 0 ? '-' : '+'}{Math.abs(totalLoss).toFixed(1)} <span className="text-sm font-bold text-sky-400">kg</span>
                </p>
            </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="5 5" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date: string) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                stroke="#94a3b8"
                fontSize={12}
                fontWeight={600}
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                stroke="#94a3b8" 
                fontSize={12}
                fontWeight={600}
                tickFormatter={(val: number) => `${val}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
              <ReferenceLine y={INITIAL_WEIGHT} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Start', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#0ea5e9" 
                strokeWidth={4} 
                dot={{ fill: '#0ea5e9', strokeWidth: 4, r: 6, stroke: '#fff' }} 
                activeDot={{ r: 8, strokeWidth: 0 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-b-4 border-slate-200">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-800">Log Weigh-in</h2>
            {needsUpdate && (
                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-xl text-xs font-bold border border-orange-100">
                    <AlertTriangle size={14} />
                    <span>Update needed</span>
                </div>
            )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-4 items-start">
          <div className="flex-1">
            <input
              type="number"
              step="0.1"
              placeholder="100.0"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 text-xl font-bold text-slate-800 placeholder-slate-300 transition-all"
            />
            {error && <p className="text-red-500 text-sm mt-2 ml-1 font-bold">{error}</p>}
          </div>
          <button 
            type="submit"
            className="bg-sky-500 hover:bg-sky-600 text-white p-4 rounded-2xl flex items-center justify-center transition-all border-b-4 border-sky-700 active:border-b-0 active:translate-y-1"
          >
            <Plus size={28} strokeWidth={4} />
          </button>
        </form>
        <p className="text-sm font-medium text-slate-400 mt-4">
            Tip: Weigh yourself in the morning before eating/drinking for consistency.
        </p>
      </div>
    </div>
  );
};