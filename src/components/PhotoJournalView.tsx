import React, { useRef, useState, useEffect } from 'react';
import { Camera, Trash2, Image as ImageIcon, X, AlertCircle, Calendar } from 'lucide-react';
import type { PhotoEntry, MoodEntry, Mood } from '../types';

interface PhotoJournalViewProps {
  entries: PhotoEntry[];
  moodHistory: MoodEntry[];
  onAddPhoto: (dataUrl: string) => void;
  onDeletePhoto: (id: string) => void;
  onDeleteMood: (date: string) => void;
}

const MoodIcon: React.FC<{ mood: Mood }> = ({ mood }) => {
  switch (mood) {
    case 'amazing': return <span title="Amazing">🤩</span>;
    case 'good': return <span title="Good">🙂</span>;
    case 'okay': return <span title="Okay">😐</span>;
    case 'hard': return <span title="Hard">😓</span>;
    case 'pain': return <span title="Pain">🤕</span>;
    default: return <span>❓</span>;
  }
};

export const PhotoJournalView: React.FC<PhotoJournalViewProps> = ({ 
  entries, 
  moodHistory, 
  onAddPhoto, 
  onDeletePhoto, 
  onDeleteMood 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodEntry | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset delete confirmation state when modal opens/changes
  useEffect(() => {
    setShowDeleteConfirm(false);
  }, [selectedPhoto]);

  // Helper to compress image before saving
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      const compressedDataUrl = await compressImage(file);
      onAddPhoto(compressedDataUrl);
    } catch (error) {
      console.error("Error processing image", error);
      alert("Could not process image. Please try again.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Limit width to save space
          const scaleSize = MAX_WIDTH / img.width;
          
          if (scaleSize < 1) {
              canvas.width = MAX_WIDTH;
              canvas.height = img.height * scaleSize;
          } else {
              canvas.width = img.width;
              canvas.height = img.height;
          }

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedMoods = [...moodHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 pb-24">
      
      {/* Mood History Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-b-4 border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-sky-500" />
          <h2 className="text-lg font-black text-slate-800">Recent Check-ins</h2>
        </div>
        
        {sortedMoods.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {sortedMoods.map((entry) => (
              <div 
                key={entry.date} 
                onClick={() => setSelectedMood(entry)}
                className="flex-shrink-0 flex flex-col items-center bg-slate-50 hover:bg-red-50 p-3 rounded-2xl border-2 border-b-4 border-slate-100 hover:border-red-200 min-w-[80px] cursor-pointer transition-colors group active:border-b-2 active:translate-y-0.5"
              >
                <span className="text-3xl mb-1 group-hover:scale-110 transition-transform"><MoodIcon mood={entry.mood} /></span>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {new Date(entry.date).toLocaleDateString(undefined, { day: 'numeric', month: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic font-medium">No daily check-ins yet. Complete a workout to unlock!</p>
        )}
      </div>

      {/* Photo Gallery Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-b-4 border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-800">Progress Photos</h2>
            <p className="text-sm font-bold text-slate-400">Visualize your gains</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-2xl flex items-center gap-2 border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="text-sm font-bold animate-pulse">Processing...</span>
            ) : (
              <>
                <Camera size={20} strokeWidth={3} />
                <span className="text-sm font-bold hidden sm:inline">Add Photo</span>
              </>
            )}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 mb-3">
              <ImageIcon size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold">No photos yet</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">Take a photo to start tracking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {sortedEntries.map((entry) => (
              <div 
                key={entry.id} 
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer border-2 border-slate-200 shadow-sm transition-transform hover:scale-[1.02]"
                onClick={() => setSelectedPhoto(entry)}
              >
                <img 
                  src={entry.dataUrl} 
                  alt={`Progress from ${entry.date}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                  <p className="text-white text-xs font-bold">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mood Deletion Modal */}
      {selectedMood && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedMood(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 w-full max-w-sm border-b-8 border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
             <h3 className="text-xl font-black text-slate-800 mb-2">Delete Check-in?</h3>
             <p className="text-slate-600 font-medium mb-6">
               Are you sure you want to remove the check-in for <strong>{new Date(selectedMood.date).toLocaleDateString()}</strong>?
             </p>
             <div className="flex justify-end gap-3">
               <button 
                 onClick={() => setSelectedMood(null)}
                 className="px-5 py-3 text-slate-500 hover:bg-slate-100 rounded-2xl font-bold transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={() => {
                   onDeleteMood(selectedMood.date);
                   setSelectedMood(null);
                 }}
                 className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-colors border-b-4 border-red-700 active:border-b-0 active:translate-y-1"
               >
                 Delete
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-10">
              <span className="text-white font-bold drop-shadow-md">
                {new Date(selectedPhoto.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
                className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="aspect-[3/4] sm:aspect-auto bg-slate-900 flex items-center justify-center">
                <img 
                src={selectedPhoto.dataUrl} 
                alt="Progress Detail" 
                className="max-h-[70vh] w-full object-contain"
                />
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center min-h-[72px]">
              {showDeleteConfirm ? (
                <div className="flex items-center justify-between w-full animate-fadeIn">
                   <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
                      <AlertCircle size={20} />
                      <span>Delete this photo?</span>
                   </div>
                   <div className="flex gap-2">
                     <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          onDeletePhoto(selectedPhoto.id);
                          setSelectedPhoto(null);
                        }}
                        className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors border-b-4 border-red-700 active:border-b-0 active:translate-y-1"
                      >
                        Yes, Delete
                      </button>
                   </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                  Delete Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};