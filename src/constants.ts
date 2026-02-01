import type { Exercise, WorkoutRoutine, Achievement, WeeklySchedule, StoreItem } from './types';

export const INSPIRATIONAL_QUOTES = [
  "Ruff day? Shake it off and lift!",
  "Who's a good lifter? You are!",
  "Dig deep for that bone... I mean, rep!",
  "Don't stop when you're tired, stop when you're done!",
  "Your only competition is the dog in the mirror.",
  "Unleash the beast!",
  "Every walk counts, every rep counts.",
  "Stay pawsitive and keep grinding.",
  "Sweat is just fat crying.",
  "Let's crush this like a new chew toy!",
];

export const MOTIVATIONAL_PHRASES = [
  "Top Dog! 🐶",
  "Pawsome work! 🐾",
  "Tail-wagging good! 🐕",
  "Beast Mode! 🦁",
  "Crushing it! 🔥",
  "Wow! Such strength! 🐕",
  "Keep it up! 🚀",
  "Barking mad gains! 💪",
];

export const DAILY_WATER_GOAL = 3000; // ml

export const INITIAL_WEIGHT = 100; // kg

export const DEFAULT_SCHEDULE: WeeklySchedule = {
  0: 'Rest', // Sunday
  1: 'A',    // Monday
  2: 'Rest', // Tuesday
  3: 'B',    // Wednesday
  4: 'Rest', // Thursday
  5: 'A',    // Friday
  6: 'Rest'  // Saturday
};

export const REX_MARKET: StoreItem[] = [
  // Food (Consumables - logic handled in component to not store in inventory usually, or simple treat mechanic)
  { id: 'treat', name: 'Tasty Treat', type: 'food', cost: 5, icon: '🥩', description: 'Give Rex a delicious snack!' },
  
  // Accessories
  { id: 'blue_bandana', name: 'Blue Bandana', type: 'neck', cost: 15, icon: '🧣', description: 'A stylish blue scarf.' },
  { id: 'gold_chain', name: 'Gold Chain', type: 'neck', cost: 50, icon: '⛓️', description: 'For the top dog.' },
  { id: 'shades', name: 'Cool Shades', type: 'glasses', cost: 40, icon: '😎', description: 'The future is bright.' },
  { id: 'nerd_glasses', name: 'Smart Specs', type: 'glasses', cost: 25, icon: '🤓', description: 'Calculated gains.' },
  { id: 'party_hat', name: 'Party Hat', type: 'hat', cost: 30, icon: '🎉', description: 'Celebration time!' },
  { id: 'crown', name: 'King Crown', type: 'hat', cost: 100, icon: '👑', description: 'Bow to the King.' },
  { id: 'tennis_ball', name: 'Tennis Ball', type: 'toy', cost: 20, icon: '🎾', description: 'Rex\'s favorite.' },
  { id: 'kettlebell', name: 'Kettlebell', type: 'toy', cost: 60, icon: '🏋️', description: 'Heavy lifting toy.' },
];

export const ACHIEVEMENTS: Achievement[] = [
  // --- Consistency (1-10) ---
  { id: 'start', title: 'Puppy Steps', description: 'Complete your first workout.', icon: '🏁', condition: (s) => s.moodHistory.length >= 1 },
  { id: 'w5', title: 'High Five', description: 'Complete 5 workouts.', icon: '🖐️', condition: (s) => s.moodHistory.length >= 5 },
  { id: 'w10', title: 'Double Digits', description: 'Complete 10 workouts.', icon: '🔟', condition: (s) => s.moodHistory.length >= 10 },
  { id: 'w20', title: 'Habit Former', description: 'Complete 20 workouts.', icon: '📅', condition: (s) => s.moodHistory.length >= 20 },
  { id: 'w30', title: 'Monthly Warrior', description: 'Complete 30 workouts.', icon: '⚔️', condition: (s) => s.moodHistory.length >= 30 },
  { id: 'w50', title: 'Golden Dog', description: 'Complete 50 workouts.', icon: '🏆', condition: (s) => s.moodHistory.length >= 50 },
  { id: 'w75', title: 'Diamond Dog', description: 'Complete 75 workouts.', icon: '💎', condition: (s) => s.moodHistory.length >= 75 },
  { id: 'w100', title: 'Centurion', description: 'Complete 100 workouts.', icon: '💯', condition: (s) => s.moodHistory.length >= 100 },
  { id: 'level_5', title: 'Level 5', description: 'Reach Level 5.', icon: '⭐', condition: (s) => s.moodHistory.length >= 25 },
  { id: 'level_10', title: 'Level 10', description: 'Reach Level 10.', icon: '👑', condition: (s) => s.moodHistory.length >= 50 },

  // --- Routines (11-15) ---
  { id: 'routine_a', title: 'A-Game', description: 'Finish Routine A.', icon: '🅰️', condition: (s) => s.moodHistory.length > 0 && s.currentRoutine === 'B' }, // Rough proxy: if current is B, likely finished A recently
  { id: 'routine_b', title: 'Plan B', description: 'Finish Routine B.', icon: '🅱️', condition: (s) => s.moodHistory.length > 0 && s.currentRoutine === 'A' },
  { id: 'flexible', title: 'Flexible', description: 'Do a workout on the weekend.', icon: '🧘', condition: (s) => s.moodHistory.some(m => { const d = new Date(m.date).getDay(); return d === 0 || d === 6; }) },
  { id: 'early_bird', title: 'Early Bird', description: 'Log a workout before 10 AM.', icon: '🌅', condition: (s) => s.moodHistory.some(() => false) }, // Note: Historical time tracking not in current MoodEntry, placeholder for future
  { id: 'night_owl', title: 'Night Owl', description: 'Log a workout after 8 PM.', icon: '🦉', condition: (s) => s.moodHistory.some(() => false) }, // Placeholder

  // --- Weight Loss (16-25) ---
  { id: 'loss_1', title: 'Drop It!', description: 'Lose your first 1kg.', icon: '🔻', condition: (s) => (INITIAL_WEIGHT - (s.weightHistory[s.weightHistory.length-1]?.weight || INITIAL_WEIGHT)) >= 1 },
  { id: 'loss_2', title: '2kg Down', description: 'Lose 2kg total.', icon: '📉', condition: (s) => (INITIAL_WEIGHT - (s.weightHistory[s.weightHistory.length-1]?.weight || INITIAL_WEIGHT)) >= 2 },
  { id: 'loss_5', title: 'Bag of Rice', description: 'Lose 5kg total.', icon: '🍚', condition: (s) => (INITIAL_WEIGHT - (s.weightHistory[s.weightHistory.length-1]?.weight || INITIAL_WEIGHT)) >= 5 },
  { id: 'loss_7', title: 'Feeling Light', description: 'Lose 7.5kg total.', icon: '🎈', condition: (s) => (INITIAL_WEIGHT - (s.weightHistory[s.weightHistory.length-1]?.weight || INITIAL_WEIGHT)) >= 7.5 },
  { id: 'loss_10', title: 'Transformation', description: 'Lose 10kg total.', icon: '✨', condition: (s) => (INITIAL_WEIGHT - (s.weightHistory[s.weightHistory.length-1]?.weight || INITIAL_WEIGHT)) >= 10 },
  { id: 'loss_15', title: 'Heavy Lifter', description: 'Lose 15kg total.', icon: '🎒', condition: (s) => (INITIAL_WEIGHT - (s.weightHistory[s.weightHistory.length-1]?.weight || INITIAL_WEIGHT)) >= 15 },
  { id: 'loss_20', title: 'New You', description: 'Lose 20kg total.', icon: '🌟', condition: (s) => (INITIAL_WEIGHT - (s.weightHistory[s.weightHistory.length-1]?.weight || INITIAL_WEIGHT)) >= 20 },
  { id: 'sub_100', title: 'Double Digits Club', description: 'Reach below 100kg.', icon: '🎯', condition: (s) => (s.weightHistory[s.weightHistory.length-1]?.weight || 101) < 100 },
  { id: 'sub_95', title: 'Cruising', description: 'Reach below 95kg.', icon: '🛳️', condition: (s) => (s.weightHistory[s.weightHistory.length-1]?.weight || 101) < 95 },
  { id: 'sub_90', title: 'Nineties Kid', description: 'Reach below 90kg.', icon: '📼', condition: (s) => (s.weightHistory[s.weightHistory.length-1]?.weight || 101) < 90 },

  // --- Journaling (26-35) ---
  { id: 'photo_1', title: 'Selfie', description: 'Take 1 progress photo.', icon: '📸', condition: (s) => s.photoJournal.length >= 1 },
  { id: 'photo_3', title: 'Pose', description: 'Take 3 progress photos.', icon: '🤳', condition: (s) => s.photoJournal.length >= 3 },
  { id: 'photo_5', title: 'Model', description: 'Take 5 progress photos.', icon: '🖼️', condition: (s) => s.photoJournal.length >= 5 },
  { id: 'photo_10', title: 'Timeline', description: 'Take 10 progress photos.', icon: '🎞️', condition: (s) => s.photoJournal.length >= 10 },
  { id: 'mood_great', title: 'Feeling Good', description: 'Log an "Amazing" workout.', icon: '🤩', condition: (s) => s.moodHistory.some(m => m.mood === 'amazing') },
  { id: 'mood_hard', title: 'Tough Cookie', description: 'Push through a "Hard" workout.', icon: '🍪', condition: (s) => s.moodHistory.some(m => m.mood === 'hard') },
  { id: 'mood_streak', title: 'On Fire', description: 'Log 3 "Amazing" workouts.', icon: '🔥', condition: (s) => s.moodHistory.filter(m => m.mood === 'amazing').length >= 3 },
  { id: 'tracker', title: 'Data Nerd', description: 'Log weight 5 times.', icon: '📊', condition: (s) => s.weightHistory.length >= 5 },
  { id: 'tracker_10', title: 'Scientist', description: 'Log weight 10 times.', icon: '🔬', condition: (s) => s.weightHistory.length >= 10 },
  { id: 'consistent_log', title: 'Journalist', description: 'Have 5 journal entries.', icon: '📓', condition: (s) => s.photoJournal.length >= 5 },

  // --- Hydration (36-40) ---
  { id: 'water_1', title: 'Thirsty', description: 'Drink 1L of water in a session.', icon: '💧', condition: (s) => (s.progress.waterIntakeMl || 0) >= 1000 },
  { id: 'water_2', title: 'Hydrated', description: 'Hit daily goal (3L).', icon: '🌊', condition: (s) => (s.progress.waterIntakeMl || 0) >= DAILY_WATER_GOAL },
  { id: 'water_3', title: 'Aquaman', description: 'Hit daily goal 5 times.', icon: '🔱', condition: () => false }, // Placeholder for persistent water history
  { id: 'water_add', title: 'Glug Glug', description: 'Add water 10 times.', icon: '🚰', condition: () => false }, // Placeholder
  { id: 'no_soda', title: 'Pure Life', description: 'Track water only (implied).', icon: '🥛', condition: (s) => (s.progress.waterIntakeMl || 0) > 0 },

  // --- Miscellaneous / Fun (41-50) ---
  { id: 'rich', title: 'Big Spender', description: 'Have 100 Bones in wallet.', icon: '🦴', condition: (s) => s.wallet >= 100 },
  { id: 'fashion', title: 'Fashionista', description: 'Own 3 items.', icon: '🧣', condition: (s) => s.inventory.length >= 3 },
  { id: 'halfway', title: 'Halfway There', description: 'Complete 50% of a routine.', icon: '🌗', condition: (s) => s.progress.completedExerciseIds.length >= 4 },
  { id: 'finisher', title: 'Finisher', description: 'Complete 100% of a routine.', icon: '🏁', condition: (s) => s.progress.completedExerciseIds.length >= 8 },
  { id: 'weekend_warrior', title: 'Weekend Warrior', description: 'Workout on a Saturday.', icon: '🎉', condition: (s) => s.moodHistory.some(m => new Date(m.date).getDay() === 6) },
  { id: 'monday_motivation', title: 'Monday Motivation', description: 'Never miss a Monday.', icon: '📅', condition: (s) => s.moodHistory.some(m => new Date(m.date).getDay() === 1) },
  { id: 'hump_day', title: 'Hump Day', description: 'Workout on a Wednesday.', icon: '🐫', condition: (s) => s.moodHistory.some(m => new Date(m.date).getDay() === 3) },
  { id: 'stretchy', title: 'Rubber Dog', description: 'Do all warmups.', icon: '🧘‍♂️', condition: (s) => s.progress.completedExerciseIds.filter(id => id.startsWith('wu')).length >= 5 },
  { id: 'cool_cat', title: 'Cool Dog', description: 'Do all cooldowns.', icon: '🧊', condition: (s) => s.progress.completedExerciseIds.filter(id => id.startsWith('cd')).length >= 4 },
  { id: 'strong', title: 'Hercules', description: 'Do all strength exercises.', icon: '🏋️', condition: (s) => s.progress.completedExerciseIds.filter(id => !id.startsWith('cd') && !id.startsWith('wu')).length >= 4 },
];

// Common Warmup for both routines
const commonWarmup: Exercise[] = [
  {
    id: 'wu-1',
    name: 'Elliptical or Stationary Bike',
    type: 'warmup',
    duration: '5 Mins',
    instruction: 'Low impact, moderate pace. Avoid treadmill running.',
  },
  {
    id: 'wu-2',
    name: 'Leg Swings',
    type: 'warmup',
    reps: '10 each side',
    instruction: 'Forward/backward and side-to-side. Hold onto wall for balance.',
  },
  {
    id: 'wu-3',
    name: 'Arm Circles',
    type: 'warmup',
    reps: '10 reps',
    instruction: 'Large circles forward and backward.',
  },
  {
    id: 'wu-4',
    name: 'Ankle Rocks',
    type: 'warmup',
    reps: '10 reps',
    instruction: 'Split stance, rock knee forward over toe and back.',
    precaution: 'Crucial for your foot history.',
  },
  {
    id: 'wu-5',
    name: 'Thoracic Rotations',
    type: 'warmup',
    reps: '10 reps',
    instruction: 'Feet wide, arms out, twist torso left and right.',
  },
];

// Common Cardio Phase
const commonCardio: Exercise[] = [
  {
    id: 'cardio-1',
    name: 'Incline Walking OR Cycling',
    type: 'cardio',
    duration: '20 Mins',
    instruction: 'Incline: 5-10%, Speed: 3.5-4.5 km/h. Cycling: Moderate resistance (Zone 2).',
    precaution: 'Low impact to protect foot. Do not run.',
  },
];

// Common Cooldown Phase
const commonCooldown: Exercise[] = [
  {
    id: 'cd-1',
    name: 'Hamstring Stretch',
    type: 'cooldown',
    duration: '30s hold',
    instruction: 'Heel on low bench, lean forward gently.',
  },
  {
    id: 'cd-2',
    name: 'Quad Stretch',
    type: 'cooldown',
    duration: '30s hold',
    instruction: 'Hold wall, grab ankle, pull heel to glute.',
  },
  {
    id: 'cd-3',
    name: 'Chest Opener',
    type: 'cooldown',
    duration: '30s hold',
    instruction: 'Arm against wall, rotate body away.',
  },
  {
    id: 'cd-4',
    name: 'Calf Stretch',
    type: 'cooldown',
    duration: '30s hold',
    instruction: 'Push against wall, one leg back, heel down.',
    precaution: 'Vital for ankle health.',
  },
];

export const WORKOUT_A: WorkoutRoutine = {
  id: 'A',
  name: 'Workout A',
  exercises: [
    ...commonWarmup,
    {
      id: 'a-1',
      name: 'Goblet Squat',
      type: 'strength',
      sets: '3',
      reps: '10-12',
      instruction: 'Hold dumbbell at chest. Sit back like in a chair. Drive up through heels.',
      formCue: 'Elbows inside knees at the bottom.',
      precaution: 'If foot hurts, switch to Leg Press.',
    },
    {
      id: 'a-2',
      name: 'Dumbbell Bench Press',
      type: 'strength',
      sets: '3',
      reps: '10-12',
      instruction: 'Press dumbbells over chest, elbows at 45-degree angle.',
      formCue: 'Keep elbows tucked slightly like an arrow, not a T.',
    },
    {
      id: 'a-3',
      name: 'Lat Pulldown',
      type: 'strength',
      sets: '3',
      reps: '10-12',
      instruction: 'Grip wider than shoulders. Pull bar to upper chest.',
      formCue: 'Drive elbows into back pockets.',
      precaution: 'Do not swing body.',
    },
    {
      id: 'a-4',
      name: 'Plank',
      type: 'strength',
      sets: '3',
      duration: '30-45s',
      instruction: 'Forearms on ground, body in straight line.',
      formCue: 'Squeeze glutes, belly button to spine.',
    },
    ...commonCardio,
    ...commonCooldown,
  ],
};

export const WORKOUT_B: WorkoutRoutine = {
  id: 'B',
  name: 'Workout B',
  exercises: [
    ...commonWarmup,
    {
      id: 'b-1',
      name: 'Dumbbell Romanian Deadlift',
      type: 'strength',
      sets: '3',
      reps: '10-12',
      instruction: 'Slight knee bend, hinge at hips, keep back flat.',
      formCue: 'Shave your legs with the dumbbells.',
      precaution: 'Do not round back. Reduce ROM if foot hurts.',
    },
    {
      id: 'b-2',
      name: 'Seated Cable Row',
      type: 'strength',
      sets: '3',
      reps: '10-12',
      instruction: 'Pull handle to stomach, squeeze shoulder blades.',
      formCue: 'Chest out, shoulders down.',
    },
    {
      id: 'b-3',
      name: 'Standing Overhead Press',
      type: 'strength',
      sets: '3',
      reps: '10-12',
      instruction: 'Press dumbbells from shoulder height straight up.',
      formCue: 'Biceps by ears at the top.',
      precaution: 'Squeeze abs to protect lower back.',
    },
    {
      id: 'b-4',
      name: 'Face Pulls',
      type: 'strength',
      sets: '3',
      reps: '15',
      instruction: 'Pull rope to forehead, pulling hands apart.',
      formCue: 'Thumbs backward.',
    },
    ...commonCardio,
    ...commonCooldown,
  ],
};