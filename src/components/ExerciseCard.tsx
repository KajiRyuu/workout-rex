import React from 'react';
import { Check, AlertCircle, Info, Timer, Repeat } from 'lucide-react';
import type { Exercise } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, isCompleted, onToggle }) => {
  const isMedicalPrecaution = !!exercise.precaution;

  return (
    <div 
      onClick={() => onToggle(exercise.id)}
      className={`
        relative overflow-hidden rounded-3xl border-2 border-b-4 transition-all duration-200 cursor-pointer select-none group active:border-b-2 active:translate-y-[2px]
        ${isCompleted 
          ? 'bg-green-100 border-green-300 opacity-90' 
          : 'bg-white border-slate-200 hover:border-sky-300'
        }
      `}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Checkbox Area */}
          <div className={`
            flex-shrink-0 mt-1 w-8 h-8 rounded-xl border-2 border-b-4 flex items-center justify-center transition-colors z-20
            ${isCompleted ? 'bg-green-500 border-green-600' : 'bg-white border-slate-300 group-hover:border-sky-400'}
          `}>
            {isCompleted && <Check size={20} className="text-white" strokeWidth={4} />}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className={`font-bold text-lg leading-tight ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                {exercise.name}
              </h3>
              <span className={`text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-lg border-b-2
                ${exercise.type === 'strength' ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 
                  exercise.type === 'cardio' ? 'bg-orange-100 text-orange-600 border-orange-200' :
                  'bg-slate-100 text-slate-500 border-slate-200'}
              `}>
                {exercise.type}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-sm font-semibold text-slate-500">
              {exercise.sets && (
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  <Repeat size={14} className="text-sky-500" />
                  <span>{exercise.sets} Sets</span>
                </div>
              )}
              {exercise.reps && (
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  <span className="text-sky-600">{exercise.reps}</span>
                </div>
              )}
              {exercise.duration && (
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  <Timer size={14} className="text-orange-500" />
                  <span>{exercise.duration}</span>
                </div>
              )}
            </div>

            {!isCompleted && (
              <div className="mt-4 space-y-3 animate-fadeIn">
                {exercise.instruction && (
                  <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl">
                    {exercise.instruction}
                  </p>
                )}
                
                {exercise.formCue && (
                  <div className="flex items-start gap-2 text-sm text-sky-700 bg-sky-100 p-3 rounded-xl border-l-4 border-sky-400">
                    <Info size={18} className="mt-0.5 flex-shrink-0" />
                    <span className="italic font-bold">"{exercise.formCue}"</span>
                  </div>
                )}

                {isMedicalPrecaution && (
                  <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 p-3 rounded-xl border-l-4 border-amber-400">
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{exercise.precaution}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};