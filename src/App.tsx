import { useState, useEffect, useMemo } from 'react';
import { Activity, BarChart2, Sparkles, Book, Flame, Settings, Moon, RotateCw } from 'lucide-react';
import { WORKOUT_A, WORKOUT_B, INITIAL_WEIGHT, INSPIRATIONAL_QUOTES, MOTIVATIONAL_PHRASES, DAILY_WATER_GOAL, ACHIEVEMENTS, DEFAULT_SCHEDULE, REX_MARKET } from './constants';
import { ExerciseCard } from './components/ExerciseCard';
import { WeightView } from './components/WeightView';
import { WaterTracker } from './components/WaterTracker';
import { PhotoJournalView } from './components/PhotoJournalView';
import { DailyCheckIn } from './components/DailyCheckIn';
import { Mascot } from './components/Mascot';
import { ProfileView } from './components/ProfileView';
import { RestTimer } from './components/RestTimer';
import { Confetti } from './components/Confetti';
import type { AppState, Mood, RoutineType, StoreItem } from './types';

// Default State Definition
const DEFAULT_STATE: AppState = {
  weightHistory: [{ date: new Date().toISOString().split('T')[0], weight: INITIAL_WEIGHT }],
  photoJournal: [],
  moodHistory: [],
  currentRoutine: 'A',
  schedule: DEFAULT_SCHEDULE,
  notifications: {
      enabled: false,
      morningSentDate: '',
      afternoonSentDate: '',
      eveningSentDate: ''
  },
  progress: {
    date: new Date().toISOString().split('T')[0],
    routineId: 'A',
    completedExerciseIds: [],
    waterIntakeMl: 0
  },
  height: 173,
  userName: "",
  userPhoto: "",
  wallet: 0,
  inventory: [],
  equippedItems: []
};

// Initial state creator with Robust Error Handling
const getInitialState = (): AppState => {
  try {
    const saved = localStorage.getItem('footsafe_tracker_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Deep merge with default state to ensure all fields exist
      const mergedState: AppState = {
        ...DEFAULT_STATE,
        ...parsed,
        notifications: { ...DEFAULT_STATE.notifications, ...(parsed.notifications || {}) },
        progress: { ...DEFAULT_STATE.progress, ...(parsed.progress || {}) },
        schedule: { ...DEFAULT_STATE.schedule, ...(parsed.schedule || {}) }
      };

      // Specific Migrations/Fixes
      if (!mergedState.height) mergedState.height = 173;
      if (typeof mergedState.progress.waterIntakeMl === 'undefined') mergedState.progress.waterIntakeMl = 0;
      if (!Array.isArray(mergedState.photoJournal)) mergedState.photoJournal = [];
      if (!Array.isArray(mergedState.moodHistory)) mergedState.moodHistory = [];
      if (typeof mergedState.wallet === 'undefined') mergedState.wallet = 0;
      if (!Array.isArray(mergedState.inventory)) mergedState.inventory = [];
      if (!Array.isArray(mergedState.equippedItems)) mergedState.equippedItems = [];

      return mergedState;
    }
  } catch (e) {
    console.error("Failed to load state, resetting to default:", e);
  }
  return DEFAULT_STATE;
};

export default function App() {
  const [state, setState] = useState<AppState>(getInitialState);
  const [activeTab, setActiveTab] = useState<'workout' | 'weight' | 'journal' | 'profile'>('workout');
  const [quote, setQuote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setQuote(INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('footsafe_tracker_v1', JSON.stringify(state));
    } catch (e) {
      console.error("Storage failed", e);
      setToastMessage("Storage full! Try deleting some photos.");
    }
  }, [state]);

  // Routine & Date Management
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date().getDay(); // 0-6
    const scheduledRoutine = state.schedule[dayOfWeek] || 'Rest';

    // If it's a new day, OR if the routineId doesn't match the schedule (user changed schedule)
    // we update the progress routineId.
    
    if (state.progress.date !== today) {
        // New Day
        setState(prev => ({
            ...prev,
            currentRoutine: scheduledRoutine,
            progress: {
                date: today,
                routineId: scheduledRoutine,
                completedExerciseIds: [],
                waterIntakeMl: 0,
                restDayActivity: false
            }
        }));
    } else if (state.progress.routineId !== scheduledRoutine) {
        // Same day, schedule changed
        setState(prev => ({
            ...prev,
            currentRoutine: scheduledRoutine,
            progress: {
                ...prev.progress,
                routineId: scheduledRoutine,
                // We reset exercises because IDs won't match between A and B
                completedExerciseIds: [] 
            }
        }));
    }
  }, [state.progress.date, state.schedule, state.progress.routineId]);

  // Notification Logic
  useEffect(() => {
      if (!state.notifications.enabled) return;

      const checkNotifications = () => {
          const now = new Date();
          const hour = now.getHours(); // 0-23
          const todayStr = now.toISOString().split('T')[0];
          const dayOfWeek = now.getDay();
          const scheduledRoutine = state.schedule[dayOfWeek];
          const isWorkoutDay = scheduledRoutine !== 'Rest';
          const isCompleted = state.moodHistory.some(m => m.date === todayStr); // Rough check if check-in done

          // Permission check (just in case)
          if (Notification.permission !== "granted") return;

          // 1. Morning Reminder (08:00 - 09:00)
          // "Today is workout day"
          if (isWorkoutDay && hour >= 8 && hour < 9 && state.notifications.morningSentDate !== todayStr) {
              new Notification("Rex: Time to Rise!", {
                  body: `Today is ${scheduledRoutine === 'A' ? 'Workout A' : 'Workout B'} day. Let's get after it! 🐶`,
                  icon: '/icon.png' // Browser might use default if not found
              });
              setState(prev => ({ ...prev, notifications: { ...prev.notifications, morningSentDate: todayStr } }));
          }

          // 2. Afternoon Reminder (15:00 - 16:00)
          // If not completed
          if (isWorkoutDay && !isCompleted && hour >= 15 && hour < 16 && state.notifications.afternoonSentDate !== todayStr) {
             new Notification("Rex: Don't Forget!", {
                  body: "I'm waiting! You haven't worked out yet. There's still time to crush it! 💪",
              });
              setState(prev => ({ ...prev, notifications: { ...prev.notifications, afternoonSentDate: todayStr } }));
          }

          // 3. Evening (22:00 - 23:00)
          if (hour >= 22 && hour < 23 && state.notifications.eveningSentDate !== todayStr) {
              if (isCompleted) {
                  new Notification("Rex: Great Job!", {
                      body: "You crushed today's workout! Rest up for tomorrow. 🌙",
                  });
              } else if (isWorkoutDay) {
                  new Notification("Rex: Rest Up", {
                      body: "You missed today's workout, but that's okay. Tomorrow is a new day! 💤",
                  });
              }
              setState(prev => ({ ...prev, notifications: { ...prev.notifications, eveningSentDate: todayStr } }));
          }
      };

      const interval = setInterval(checkNotifications, 60000); // Check every minute
      checkNotifications(); // Check immediately on load

      return () => clearInterval(interval);
  }, [state.notifications, state.schedule, state.moodHistory]);

  const toggleNotifications = async () => {
      if (!state.notifications.enabled) {
          // Request permission
          if (!("Notification" in window)) {
              alert("This browser does not support desktop notifications");
              return;
          }
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
              setState(prev => ({ ...prev, notifications: { ...prev.notifications, enabled: true } }));
              new Notification("Workout with Rex", { body: "Notifications enabled! I'll keep you updated. 🐶" });
          } else {
              alert("Permission denied. You need to allow notifications in browser settings.");
          }
      } else {
          setState(prev => ({ ...prev, notifications: { ...prev.notifications, enabled: false } }));
      }
  };

  const updateSchedule = (dayIndex: number, routine: RoutineType) => {
      setState(prev => ({
          ...prev,
          schedule: {
              ...prev.schedule,
              [dayIndex]: routine
          }
      }));
  };

  const cycleRoutine = () => {
      const current = state.currentRoutine;
      let next: RoutineType = 'A';
      if (current === 'A') next = 'B';
      else if (current === 'B') next = 'Rest';
      else next = 'A'; // from Rest to A

      // Update state including schedule for TODAY
      const dayOfWeek = new Date().getDay();
      setState(prev => ({
          ...prev,
          currentRoutine: next,
          schedule: {
              ...prev.schedule,
              [dayOfWeek]: next
          },
          progress: {
              ...prev.progress,
              routineId: next,
              completedExerciseIds: [], // Reset progress on switch to be safe
              restDayActivity: false
          }
      }));
      setToastMessage(`Switched to ${next === 'Rest' ? 'Rest Day' : 'Workout ' + next}`);
      setTimeout(() => setToastMessage(null), 2000);
  };

  const updateUserName = (name: string) => {
      setState(prev => ({ ...prev, userName: name }));
  };

  const updateUserPhoto = (dataUrl: string) => {
      setState(prev => ({ ...prev, userPhoto: dataUrl }));
  };
  
  const deleteUserPhoto = () => {
      setState(prev => ({ ...prev, userPhoto: "" }));
  };

  const currentRoutineData = state.currentRoutine === 'A' ? WORKOUT_A : (state.currentRoutine === 'B' ? WORKOUT_B : null);

  const progressPercentage = useMemo(() => {
    if (state.currentRoutine === 'Rest') {
        return state.progress.restDayActivity ? 100 : 0;
    }
    if (!currentRoutineData || currentRoutineData.exercises.length === 0) return 0;
    return Math.round((state.progress.completedExerciseIds.length / currentRoutineData.exercises.length) * 100);
  }, [state.progress.completedExerciseIds, currentRoutineData, state.currentRoutine, state.progress.restDayActivity]);

  // Trigger confetti when 100% is reached
  useEffect(() => {
      if (progressPercentage === 100 && state.currentRoutine !== 'Rest') {
          // Check if we already celebrated today? No, let them celebrate every time they load if it's done.
          // Better: only trigger if not already showing.
          setShowConfetti(true);
          const t = setTimeout(() => setShowConfetti(false), 5000);
          return () => clearTimeout(t);
      }
  }, [progressPercentage, state.currentRoutine]);

  const todayDate = new Date().toISOString().split('T')[0];
  const todaysMood = state.moodHistory.find(m => m.date === todayDate)?.mood;

  // Gamification & Stats
  const totalWorkouts = state.moodHistory.length;
  const currentLevel = Math.floor(totalWorkouts / 5) + 1;
  const workoutsForNextLevel = 5;
  const currentLevelProgress = (totalWorkouts % 5) / workoutsForNextLevel * 100;
  
  const currentStreak = useMemo(() => {
    if (state.moodHistory.length === 0) return 0;
    const weeks = new Set<string>();
    state.moodHistory.forEach(entry => {
        const d = new Date(entry.date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff)).toISOString().split('T')[0];
        weeks.add(monday);
    });
    const sortedWeeks = Array.from(weeks).sort();
    if (sortedWeeks.length === 0) return 0;
    const now = new Date();
    const currentDay = now.getDay();
    const currentDiff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const currentMonday = new Date(now.setDate(currentDiff)).toISOString().split('T')[0];
    const lastMonday = sortedWeeks[sortedWeeks.length - 1];
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    if (new Date(currentMonday).getTime() - new Date(lastMonday).getTime() > oneWeekMs) return 0;
    let streak = 1;
    for (let i = sortedWeeks.length - 1; i > 0; i--) {
        const curr = new Date(sortedWeeks[i]).getTime();
        const prev = new Date(sortedWeeks[i-1]).getTime();
        const diffDays = (curr - prev) / (1000 * 3600 * 24);
        if (diffDays >= 6 && diffDays <= 8) streak++;
        else break;
    }
    return streak;
  }, [state.moodHistory]);

  const achievementStatus = useMemo(() => {
      return ACHIEVEMENTS.map(ach => ({
          data: ach,
          unlocked: ach.condition(state)
      }));
  }, [state]);

  const showMotivation = () => {
      const phrase = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
      setToastMessage(phrase);
      setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleExercise = (id: string) => {
    setState(prev => {
      const isCompleted = prev.progress.completedExerciseIds.includes(id);
      
      let walletBonus = 0;
      if (!isCompleted) {
          showMotivation();
          walletBonus = 1; // +1 Bone per exercise
      } else {
          // If unchecking, do we remove bone? 
          // To prevent abuse (check/uncheck), maybe we track earned bones separately?
          // For simplicity, we just add. If they cheat, they cheat. It's a personal app.
          // Or we can subtract. Let's subtract to be consistent.
          walletBonus = -1;
      }

      const newCompleted = isCompleted
        ? prev.progress.completedExerciseIds.filter(eId => eId !== id)
        : [...prev.progress.completedExerciseIds, id];
        
      return {
        ...prev,
        wallet: Math.max(0, prev.wallet + walletBonus),
        progress: { ...prev.progress, completedExerciseIds: newCompleted }
      };
    });
  };

  const toggleRestDayActivity = () => {
      setState(prev => ({
          ...prev,
          progress: {
              ...prev.progress,
              restDayActivity: !prev.progress.restDayActivity
          }
      }));
      if (!state.progress.restDayActivity) showMotivation();
  };

  const updateWaterIntake = (amount: number) => {
    setState(prev => {
        const newAmount = Math.max(0, (prev.progress.waterIntakeMl || 0) + amount);
        return { ...prev, progress: { ...prev.progress, waterIntakeMl: newAmount } };
    });
  };

  const addWeightEntry = (weight: number) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      const historyFiltered = prev.weightHistory.filter(h => h.date !== today);
      return { ...prev, weightHistory: [...historyFiltered, { date: today, weight }] };
    });
  };

  const updateHeight = (cm: number) => {
    setState(prev => ({ ...prev, height: cm }));
  };

  const addPhotoEntry = (dataUrl: string) => {
    const newEntry = { id: Date.now().toString(), date: new Date().toISOString(), dataUrl };
    setState(prev => ({ ...prev, photoJournal: [newEntry, ...(prev.photoJournal || [])] }));
    setToastMessage("Photo saved! 📸");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const deletePhotoEntry = (id: string) => {
    setState(prev => ({ ...prev, photoJournal: prev.photoJournal.filter(p => p.id !== id) }));
  };

  const saveMood = (mood: Mood) => {
    const today = new Date().toISOString().split('T')[0];
    // Bonus for finishing workout first time today
    const isFirstTime = !state.moodHistory.some(m => m.date === today);
    const bonus = isFirstTime ? 10 : 0;

    setState(prev => {
        const historyFiltered = prev.moodHistory.filter(m => m.date !== today);
        return { 
            ...prev, 
            wallet: prev.wallet + bonus,
            moodHistory: [...historyFiltered, { date: today, mood }] 
        };
    });
    setToastMessage(isFirstTime ? "Workout Complete! +10 🦴" : "Updated Check-in! 🌟");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const deleteMoodEntry = (date: string) => {
    setState(prev => ({ ...prev, moodHistory: prev.moodHistory.filter(m => m.date !== date) }));
    setToastMessage("Check-in removed.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // STORE HANDLERS
  const buyItem = (item: StoreItem) => {
      if (state.wallet < item.cost) {
          setToastMessage("Not enough bones!");
          setTimeout(() => setToastMessage(null), 2000);
          return;
      }

      setState(prev => {
          let newInventory = prev.inventory;
          // Food is consumable, not added to inventory
          if (item.type !== 'food' && !prev.inventory.includes(item.id)) {
              newInventory = [...prev.inventory, item.id];
          }

          return {
              ...prev,
              wallet: prev.wallet - item.cost,
              inventory: newInventory
          };
      });

      if (item.type === 'food') {
         setToastMessage(`Yum! ${item.name}`);
      } else {
         setToastMessage(`Purchased ${item.name}!`);
      }
      setTimeout(() => setToastMessage(null), 2000);
  };

  const equipItem = (item: StoreItem) => {
      setState(prev => {
          let newEquipped = [...prev.equippedItems];
          
          if (newEquipped.includes(item.id)) {
              // Unequip
              newEquipped = newEquipped.filter(id => id !== item.id);
          } else {
             // Equip logic: unique per type.
             // We need to remove any currently equipped item that has the same type as the new item.
             
             // 1. Identify IDs of items that share the type with `item`.
             // We can use REX_MARKET to find all items of this type.
             const conflictingItemIds = REX_MARKET
                .filter(marketItem => marketItem.type === item.type)
                .map(marketItem => marketItem.id);

             // 2. Filter out conflicting IDs from `newEquipped`
             newEquipped = newEquipped.filter(equippedId => !conflictingItemIds.includes(equippedId));
             
             // 3. Add the new item
             newEquipped.push(item.id);
          }

          return { ...prev, equippedItems: newEquipped };
      });
  };


  const daysSinceLastWeighIn = useMemo(() => {
    if (state.weightHistory.length === 0) return 100;
    const sorted = [...state.weightHistory].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastDate = new Date(sorted[0].date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  }, [state.weightHistory]);

  const needsWeighIn = daysSinceLastWeighIn >= 7;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans relative selection:bg-green-200">
      
      {showConfetti && <Confetti />}

      {/* Toast Notification */}
      {toastMessage && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce w-full max-w-xs px-4 text-center">
              <div className="bg-sky-500 text-white border-b-4 border-sky-700 px-6 py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2 font-bold text-lg">
                  <Sparkles size={20} className="text-yellow-300 flex-shrink-0" />
                  <span className="truncate">{toastMessage}</span>
              </div>
          </div>
      )}

      {/* Gamified Header */}
      <header className="bg-white border-b-4 border-slate-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            
            {/* Left: Streak & XP */}
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 bg-orange-100 border-2 border-orange-200 text-orange-600 px-2 py-1 rounded-xl">
                   <Flame size={18} className="fill-orange-500 text-orange-600" />
                   <span className="font-extrabold">{currentStreak}</span>
               </div>
               
               <div className="flex items-center gap-1.5 bg-yellow-100 border-2 border-yellow-200 text-yellow-700 px-2 py-1 rounded-xl">
                   <span className="font-extrabold text-sm">Lvl {currentLevel}</span>
                   <div className="w-12 h-2 bg-yellow-200 rounded-full overflow-hidden border border-yellow-300">
                      <div className="h-full bg-yellow-500" style={{ width: `${currentLevelProgress}%` }}></div>
                   </div>
               </div>
            </div>

            {/* Right: Tab Navigation */}
            <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('workout')}
                  className={`p-2 rounded-2xl border-2 border-b-4 transition-all active:border-b-2 active:translate-y-[2px] ${activeTab === 'workout' ? 'bg-sky-400 border-sky-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                >
                    <Activity size={24} strokeWidth={3} />
                </button>
                <button 
                  onClick={() => setActiveTab('weight')}
                  className={`relative p-2 rounded-2xl border-2 border-b-4 transition-all active:border-b-2 active:translate-y-[2px] ${activeTab === 'weight' ? 'bg-sky-400 border-sky-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                >
                    <BarChart2 size={24} strokeWidth={3} />
                    {needsWeighIn && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                </button>
                <button 
                  onClick={() => setActiveTab('journal')}
                  className={`p-2 rounded-2xl border-2 border-b-4 transition-all active:border-b-2 active:translate-y-[2px] ${activeTab === 'journal' ? 'bg-sky-400 border-sky-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                >
                    <Book size={24} strokeWidth={3} />
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`p-2 rounded-2xl border-2 border-b-4 transition-all active:border-b-2 active:translate-y-[2px] ${activeTab === 'profile' ? 'bg-sky-400 border-sky-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                >
                    {state.userPhoto ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white">
                            <img src={state.userPhoto} alt="Me" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <Settings size={24} strokeWidth={3} />
                    )}
                </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4">
        
        {activeTab === 'workout' && (
            <div className="space-y-6 pb-20">
                
                {/* REST DAY VIEW */}
                {state.currentRoutine === 'Rest' ? (
                    <div className="space-y-6 animate-fadeIn">
                        <Mascot 
                            quote="Rest days are when the muscles grow! Enjoy your recovery."
                            wallet={state.wallet}
                            inventory={state.inventory}
                            equippedItems={state.equippedItems}
                            onBuy={buyItem}
                            onEquip={equipItem}
                        />
                        
                        <div className="bg-teal-50 border-2 border-b-4 border-teal-200 rounded-3xl p-6 text-center">
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center border border-teal-200">
                                    <Moon size={32} className="text-teal-600" />
                                </div>
                                <button 
                                    onClick={cycleRoutine}
                                    className="text-xs font-bold text-teal-600 bg-white border border-teal-200 hover:bg-teal-100 px-3 py-2 rounded-xl transition-all flex items-center gap-1"
                                >
                                    Change <RotateCw size={12} />
                                </button>
                            </div>
                            
                            <h2 className="text-2xl font-black text-teal-800 mb-2">Active Recovery</h2>
                            <p className="text-teal-600 font-medium mb-6">
                                Today is scheduled for rest. Light walking or stretching is recommended, but take it easy!
                            </p>
                            
                            <button 
                                onClick={toggleRestDayActivity}
                                className={`w-full py-4 rounded-2xl font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                                    state.progress.restDayActivity
                                    ? 'bg-teal-500 text-white border-teal-700'
                                    : 'bg-white text-teal-600 border-teal-200 hover:bg-teal-100'
                                }`}
                            >
                                {state.progress.restDayActivity ? 'Activity Logged! ✅' : 'I went for a walk / Stretched'}
                            </button>
                        </div>

                         {/* Water Tracker still visible on Rest Day */}
                        <WaterTracker 
                            currentMl={state.progress.waterIntakeMl || 0}
                            goalMl={DAILY_WATER_GOAL}
                            onAdd={updateWaterIntake}
                        />
                    </div>
                ) : (
                    /* WORKOUT DAY VIEW */
                    <>
                        <Mascot 
                            quote={quote}
                            wallet={state.wallet}
                            inventory={state.inventory}
                            equippedItems={state.equippedItems}
                            onBuy={buyItem}
                            onEquip={equipItem}
                        />

                        {/* Progress Bar Large */}
                        <div className="bg-white p-4 rounded-3xl border-2 border-b-4 border-slate-200">
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="font-extrabold text-slate-400 tracking-wider text-xs uppercase">Daily Progress</span>
                                <span className="font-black text-green-500 text-xl">{progressPercentage}%</span>
                            </div>
                            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <div 
                                    className="h-full bg-green-500 transition-all duration-700 ease-out"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Routine Header */}
                        <div className="flex items-center justify-between bg-sky-100 p-5 rounded-3xl border-2 border-b-4 border-sky-200">
                            <div>
                                <p className="text-xs text-sky-600 uppercase tracking-wider font-extrabold">Today's Mission</p>
                                <h2 className="text-xl font-black text-sky-900">{currentRoutineData?.name}</h2>
                            </div>
                            <button 
                                onClick={cycleRoutine}
                                className="text-xs font-bold text-white bg-sky-500 border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 px-4 py-2 rounded-xl transition-all flex items-center gap-1"
                            >
                                Change <RotateCw size={12} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Water Tracker */}
                        <WaterTracker 
                            currentMl={state.progress.waterIntakeMl || 0}
                            goalMl={DAILY_WATER_GOAL}
                            onAdd={updateWaterIntake}
                        />

                        {/* Workout List */}
                        <div className="space-y-4">
                            {currentRoutineData?.exercises.map((exercise) => (
                                <ExerciseCard 
                                    key={exercise.id}
                                    exercise={exercise}
                                    isCompleted={state.progress.completedExerciseIds.includes(exercise.id)}
                                    onToggle={toggleExercise}
                                />
                            ))}
                        </div>

                        {/* Check In / Completion Message */}
                        {progressPercentage === 100 && (
                            <>
                                {!todaysMood ? (
                                    <DailyCheckIn onSave={saveMood} />
                                ) : (
                                    <div className="bg-green-100 border-2 border-b-4 border-green-200 text-green-800 p-6 rounded-3xl text-center">
                                        <h3 className="text-2xl font-black mb-2">Mission Complete! 🐶</h3>
                                        <p className="font-medium">You felt: <strong>{todaysMood.charAt(0).toUpperCase() + todaysMood.slice(1)}</strong></p>
                                    </div>
                                )}
                            </>
                        )}
                        
                        {/* Global Rest Timer */}
                        <RestTimer />
                    </>
                )}
            </div>
        )}
        
        {activeTab === 'weight' && (
            <WeightView 
                history={state.weightHistory} 
                onAddEntry={addWeightEntry}
                needsUpdate={needsWeighIn}
                height={state.height || 173}
                onUpdateHeight={updateHeight}
            />
        )}

        {activeTab === 'journal' && (
          <PhotoJournalView 
            entries={state.photoJournal || []} 
            moodHistory={state.moodHistory || []}
            onAddPhoto={addPhotoEntry}
            onDeletePhoto={deletePhotoEntry}
            onDeleteMood={deleteMoodEntry}
          />
        )}

        {activeTab === 'profile' && (
            <ProfileView 
                userName={state.userName || ""}
                userPhoto={state.userPhoto}
                achievements={achievementStatus}
                schedule={state.schedule}
                notifications={state.notifications}
                onUpdateName={updateUserName}
                onUpdatePhoto={updateUserPhoto}
                onDeletePhoto={deleteUserPhoto}
                onUpdateSchedule={updateSchedule}
                onToggleNotifications={toggleNotifications}
            />
        )}
      </main>
    </div>
  );
}