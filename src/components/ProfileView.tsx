import React, { useState, useRef } from 'react';
import type { WeeklySchedule, RoutineType, NotificationState, Achievement } from '../types';
import { Bell, BellOff, Calendar, Camera, User, Trophy, Lock, X, Edit2, Trash2 } from 'lucide-react';

interface ProfileViewProps {
  userName: string;
  userPhoto?: string;
  achievements: { data: Achievement; unlocked: boolean }[];
  schedule: WeeklySchedule;
  notifications: NotificationState;
  onUpdateName: (name: string) => void;
  onUpdatePhoto: (dataUrl: string) => void;
  onDeletePhoto: () => void;
  onUpdateSchedule: (day: number, routine: RoutineType) => void;
  onToggleNotifications: () => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  userName,
  userPhoto,
  achievements,
  schedule, 
  notifications, 
  onUpdateName,
  onUpdatePhoto,
  onDeletePhoto,
  onUpdateSchedule, 
  onToggleNotifications 
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      // Basic compression/resize logic
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 400; // Profile pics can be smaller
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
              if (width > MAX_SIZE) {
                  height *= MAX_SIZE / width;
                  width = MAX_SIZE;
              }
          } else {
              if (height > MAX_SIZE) {
                  width *= MAX_SIZE / height;
                  height = MAX_SIZE;
              }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          onUpdatePhoto(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
  };

  const handleNameSubmit = () => {
      onUpdateName(tempName);
      setIsEditingName(false);
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 pb-24">
      
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-b-4 border-slate-200 flex flex-col items-center">
        <div 
            className="relative w-32 h-32 mb-4 group cursor-pointer"
        >
            <div 
                className="w-full h-full rounded-full overflow-hidden border-4 border-sky-100 bg-slate-50 shadow-inner"
                onClick={() => fileInputRef.current?.click()}
            >
                {userPhoto ? (
                    <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User size={64} />
                    </div>
                )}
            </div>
            
            {/* Upload Button */}
            <div 
                className="absolute bottom-0 right-0 bg-sky-500 text-white p-2 rounded-full border-2 border-white shadow-sm group-hover:bg-sky-600 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
                <Camera size={16} />
            </div>

            {/* Delete Button (Only if photo exists) */}
            {userPhoto && (
                <div 
                    className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full border-2 border-white shadow-sm hover:bg-red-600 transition-colors z-20"
                    onClick={(e) => { e.stopPropagation(); onDeletePhoto(); }}
                >
                    <Trash2 size={16} />
                </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*" 
                className="hidden" 
            />
        </div>

        {isEditingName ? (
            <div className="flex items-center gap-2">
                <input 
                    autoFocus
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={handleNameSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                    className="text-2xl font-black text-center bg-slate-50 border-b-2 border-sky-500 focus:outline-none text-slate-800 w-full max-w-[200px]"
                    placeholder="Your Name"
                />
            </div>
        ) : (
            <div 
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-2 cursor-pointer group hover:bg-slate-50 px-4 py-1 rounded-xl transition-colors"
            >
                <h1 className="text-2xl font-black text-slate-800">{userName || "Rex's Buddy"}</h1>
                <Edit2 size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        )}
        <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-1">Level {Math.floor(unlockedCount / 2) + 1} Rookie</p>
      </div>

      {/* Achievements Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-b-4 border-slate-200">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-xl border border-yellow-200">
                    <Trophy size={24} className="text-yellow-600 fill-yellow-500" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800">Hall of Fame</h2>
                    <p className="text-sm font-bold text-slate-400">Unlock them all!</p>
                </div>
            </div>
            <div className="text-right">
                <span className="text-2xl font-black text-slate-800">{unlockedCount}</span>
                <span className="text-sm font-bold text-slate-400">/{achievements.length}</span>
            </div>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {achievements.map(({ data, unlocked }) => (
                <button 
                    key={data.id} 
                    onClick={() => setSelectedAchievement(data)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 text-center border-2 border-b-4 transition-all active:border-b-2 active:translate-y-0.5 ${
                        unlocked 
                        ? 'bg-yellow-50 border-yellow-300' 
                        : 'bg-slate-100 border-slate-200 opacity-60'
                    }`}
                >
                    <span className={`text-2xl mb-1 ${!unlocked && 'grayscale'}`}>{unlocked ? data.icon : <Lock size={20} className="text-slate-300" />}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-b-4 border-slate-200">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black text-slate-800">Notifications</h2>
            <div className={`p-2 rounded-xl ${notifications.enabled ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                {notifications.enabled ? <Bell size={24} /> : <BellOff size={24} />}
            </div>
        </div>
        <p className="text-slate-500 font-medium mb-6 text-sm">
            Get reminders at 08:00, 15:00, and 22:00 to keep your streak alive.
        </p>
        
        <button
            onClick={onToggleNotifications}
            className={`w-full py-4 rounded-2xl font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                notifications.enabled 
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                : 'bg-sky-500 text-white border-sky-700 hover:bg-sky-600'
            }`}
        >
            {notifications.enabled ? 'Disable Notifications' : 'Enable Reminders'}
        </button>
      </div>

      {/* Schedule Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-b-4 border-slate-200">
        <div className="flex items-center gap-3 mb-6">
            <Calendar size={24} className="text-sky-500" />
            <h2 className="text-xl font-black text-slate-800">Weekly Schedule</h2>
        </div>

        <div className="space-y-3">
            {DAYS.map((dayName, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700 w-24">{dayName}</span>
                    <div className="flex gap-1">
                        {(['A', 'B', 'Rest'] as RoutineType[]).map((type) => (
                             <button
                                key={type}
                                onClick={() => onUpdateSchedule(index, type)}
                                className={`px-3 py-2 rounded-xl text-xs font-black border-b-2 active:border-b-0 active:translate-y-0.5 transition-all ${
                                    schedule[index] === type
                                    ? type === 'Rest' 
                                        ? 'bg-teal-100 text-teal-700 border-teal-300'
                                        : 'bg-sky-100 text-sky-700 border-sky-300'
                                    : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
                                }`}
                             >
                                 {type === 'Rest' ? 'Rest' : `Workout ${type}`}
                             </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>

       {/* Achievement Detail Modal */}
      {selectedAchievement && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSelectedAchievement(null)}
          >
             <div 
                className="bg-white rounded-3xl p-6 w-full max-w-sm border-b-8 border-slate-200 relative overflow-hidden text-center"
                onClick={(e) => e.stopPropagation()}
             >
                 {/* Close Button */}
                <button 
                  onClick={() => setSelectedAchievement(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={24} strokeWidth={3} />
                </button>

                 <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-4 border-4 ${
                     achievements.find(a => a.data.id === selectedAchievement.id)?.unlocked 
                     ? 'bg-yellow-100 border-yellow-300' 
                     : 'bg-slate-100 border-slate-200 grayscale'
                 }`}>
                     {achievements.find(a => a.data.id === selectedAchievement.id)?.unlocked ? selectedAchievement.icon : <Lock size={32} className="text-slate-300"/>}
                 </div>
                 
                 <h3 className="text-2xl font-black text-slate-800 mb-2">{selectedAchievement.title}</h3>
                 <p className="text-slate-500 font-medium mb-6">{selectedAchievement.description}</p>
                 
                 <div className={`px-4 py-2 rounded-xl font-bold inline-block ${
                     achievements.find(a => a.data.id === selectedAchievement.id)?.unlocked 
                     ? 'bg-green-100 text-green-700' 
                     : 'bg-slate-100 text-slate-400'
                 }`}>
                     {achievements.find(a => a.data.id === selectedAchievement.id)?.unlocked ? 'UNLOCKED' : 'LOCKED'}
                 </div>
             </div>
          </div>
      )}
      
      <div className="text-center text-slate-400 text-xs font-medium px-4">
        <p>Tip: Stick to the schedule! Notifications will be based on these settings.</p>
      </div>
    </div>
  );
};