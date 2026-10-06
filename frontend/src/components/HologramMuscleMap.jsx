import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Activity,
  Layers,
  Zap,
  Target,
  Maximize2,
  RotateCcw,
  Eye,
} from 'lucide-react';

const WEEKLY_SPLITS = [
  {
    day: 'Monday',
    tag: 'Day 1',
    title: 'Chest & Arms (Push)',
    focus: 'Upper Body Power',
    targetMuscles: ['chest', 'front_shoulders', 'triceps'],
    simpleDesc: 'Pushes your chest, front shoulders, and the back of your arms to build upper body strength.',
    exercises: [
      { name: 'Push-ups or Dumbbell Bench Press', simpleTip: 'Builds your chest and arms' },
      { name: 'Overhead Shoulder Press', simpleTip: 'Makes your shoulders strong and steady' },
      { name: 'Tricep Chair Dips', simpleTip: 'Firms up the back of your arms' },
    ],
  },
  {
    day: 'Tuesday',
    tag: 'Day 2',
    title: 'Back & Biceps (Pull)',
    focus: 'Better Posture & Pull Power',
    targetMuscles: ['traps', 'lats', 'biceps', 'rear_shoulders'],
    simpleDesc: 'Strengthens your upper and middle back for tall posture, and builds arm pulling power.',
    exercises: [
      { name: 'Dumbbell Rows (or Towel Door Rows)', simpleTip: 'Squeezes shoulder blades together' },
      { name: 'Bicep Arm Curls', simpleTip: 'Strengthens front arm muscles' },
      { name: 'Resistance Band Pull-Aparts', simpleTip: 'Opens up tight shoulders from sitting' },
    ],
  },
  {
    day: 'Wednesday',
    tag: 'Day 3',
    title: 'Legs & Core',
    focus: 'Leg Power & Core Stability',
    targetMuscles: ['quads', 'glutes', 'hamstrings', 'calves', 'abs'],
    simpleDesc: 'Works your body’s largest engines: your thighs, hips, and stomach to supercharge calorie burn.',
    exercises: [
      { name: 'Goblet Squats or Chair Squats', simpleTip: 'Builds strong thighs and hips' },
      { name: 'Glute Bridges on the Floor', simpleTip: 'Wakes up your hips with zero knee strain' },
      { name: 'Plank Holds or Dead Bugs', simpleTip: 'Tightens your stomach with safe back support' },
    ],
  },
  {
    day: 'Thursday',
    tag: 'Day 4',
    title: 'Active Recovery & Walk',
    focus: 'Recharge & Heal',
    targetMuscles: ['abs'],
    simpleDesc: 'An easy, restorative day so muscles heal faster. A light 20-min walk, fresh air, and gentle stretches.',
    exercises: [
      { name: '20-Minute Brisk Walk', simpleTip: 'Promotes blood flow and reduces stiffness' },
      { name: 'Gentle Hip & Back Stretches', simpleTip: 'Loosens up tight joints' },
      { name: 'Drink 2.5L Water Goal', simpleTip: 'Flushes out post-workout soreness' },
    ],
  },
  {
    day: 'Friday',
    tag: 'Day 5',
    title: 'Shoulders & Arms',
    focus: 'Arm & Shoulder Definition',
    targetMuscles: ['front_shoulders', 'rear_shoulders', 'biceps', 'triceps', 'forearms'],
    simpleDesc: 'Shapes your shoulders and arms, making lifting and carrying groceries feel super easy.',
    exercises: [
      { name: 'Side Shoulder Raises', simpleTip: 'Shapes and rounds your shoulders' },
      { name: 'Hammer Curls', simpleTip: 'Builds forearm grip and bicep thickness' },
      { name: 'Overhead Tricep Extensions', simpleTip: 'Strengthens arm extension' },
    ],
  },
  {
    day: 'Saturday',
    tag: 'Day 6',
    title: 'Full Body Sweats',
    focus: 'Heart Health & Stamina',
    targetMuscles: ['chest', 'lats', 'quads', 'abs', 'calves'],
    simpleDesc: 'Combines whole-body moves with a brisk heart pace to break a healthy sweat and feel accomplished.',
    exercises: [
      { name: 'Step-Ups & Light Squat Jumps', simpleTip: 'Cardio boost for legs' },
      { name: 'Mountain Climbers on Floor', simpleTip: 'Engages stomach and heart rate' },
      { name: 'Deep Breathing Cool Down', simpleTip: 'Slows down heart rate smoothly' },
    ],
  },
  {
    day: 'Sunday',
    tag: 'Day 7',
    title: 'Rest & Reset',
    focus: 'Complete Rest',
    targetMuscles: [],
    simpleDesc: 'Zero workouts! Sleep in, eat good meals, and recharge fully for the new week.',
    exercises: [
      { name: '8 Hours of Quality Sleep', simpleTip: 'Where your body does 90% of its repair' },
      { name: 'Wholesome Nutritious Meal', simpleTip: 'Refuels your energy reserves' },
    ],
  },
];

export const HologramMuscleMap = () => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [viewAngle, setViewAngle] = useState('both'); // 'both' | 'front' | 'back'
  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  const currentSplit = WEEKLY_SPLITS[selectedDayIdx];
  const activeMuscles = currentSplit.targetMuscles;

  const isMuscleActive = (muscleKey) => {
    return activeMuscles.includes(muscleKey) || hoveredMuscle === muscleKey;
  };

  return (
    <div className="w-full cyber-card rounded-2xl p-4 sm:p-6 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-cyber-border mb-6 gap-2">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-neon-cyan border border-cyan-500/30">
            REALISTIC ANATOMICAL WIREFRAME HOLOGRAM
          </span>
          <h2 className="font-cyber text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500 dark:text-neon-green" />
            3D Muscle Split Hologram
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Glowing holographic view of your muscle groups trained each day of the week.
          </p>
        </div>

        {/* Perspective Controls */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-cyber-dark p-1 rounded-xl border border-slate-200 dark:border-cyber-border text-xs font-mono self-start sm:self-auto">
          <button
            onClick={() => setViewAngle('both')}
            className={`px-3 py-1 rounded-lg transition ${
              viewAngle === 'both'
                ? 'bg-cyan-500/20 text-cyan-600 dark:text-neon-cyan font-bold border border-cyan-500/40'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Dual View (Front & Back)
          </button>
          <button
            onClick={() => setViewAngle('front')}
            className={`px-3 py-1 rounded-lg transition ${
              viewAngle === 'front'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-neon-green font-bold border border-emerald-500/40'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Front Focus
          </button>
          <button
            onClick={() => setViewAngle('back')}
            className={`px-3 py-1 rounded-lg transition ${
              viewAngle === 'back'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-neon-green font-bold border border-emerald-500/40'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Back Focus
          </button>
        </div>
      </div>

      {/* Weekly Split Days Ribbon */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {WEEKLY_SPLITS.map((item, idx) => {
          const isSelected = selectedDayIdx === idx;
          return (
            <button
              key={item.day}
              onClick={() => setSelectedDayIdx(idx)}
              className={`px-3.5 py-2.5 rounded-xl text-left border shrink-0 transition-all ${
                isSelected
                  ? 'bg-emerald-500/15 dark:bg-neon-green/15 border-emerald-500 dark:border-neon-green text-slate-900 dark:text-white shadow-sm dark:shadow-neon-green'
                  : 'bg-white dark:bg-cyber-dark/60 border-slate-200 dark:border-cyber-border text-slate-500 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono text-emerald-600 dark:text-neon-cyan font-bold">
                {item.day.toUpperCase()}
              </div>
              <div className="font-cyber text-xs font-bold whitespace-nowrap mt-0.5">
                {item.title.split('(')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Holographic Visualizer Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Hologram Stage (Col 7) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#04060b] border border-cyan-500/30 p-4 sm:p-6 relative overflow-hidden shadow-2xl flex flex-col items-center">
          {/* Cyberpunk Holographic Ambient Background Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Holographic Laser Scanline */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-pulse-fast pointer-events-none shadow-[0_0_12px_#00e5ff]" />

          {/* Corner Cyber HUD Brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

          {/* Status HUD Header */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-2 px-2 z-10">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              NEURAL HOLOGRAPHIC SCANNER // 60 FPS
            </span>
            <span className="text-emerald-400 font-bold">
              TARGET LOCK: {activeMuscles.length > 0 ? activeMuscles.join(', ').toUpperCase() : 'REST DAY'}
            </span>
          </div>

          {/* Authentic Hologram Image Container with Interactive SVG Muscle Hotzones */}
          <div className="relative w-full max-w-lg aspect-[297/222] my-2 flex items-center justify-center select-none overflow-hidden rounded-xl border border-cyan-500/20">
            {/* The Reference Hologram Image (Exact Anatomy) */}
            <img
              src="/hologram-reference.png"
              alt="Realistic Hologram Muscle Anatomy"
              className={`w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-500 ${
                viewAngle === 'front' ? 'scale-150 translate-x-[22%]' : viewAngle === 'back' ? 'scale-150 -translate-x-[22%]' : 'scale-100'
              }`}
            />

            {/* Interactive Holographic SVG Overlays (Exact Normalized Coordinates corresponding to reference figures) */}
            <svg
              viewBox="0 0 297 222"
              className={`absolute inset-0 w-full h-full pointer-events-auto transition-all duration-500 ${
                viewAngle === 'front' ? 'scale-150 translate-x-[22%]' : viewAngle === 'back' ? 'scale-150 -translate-x-[22%]' : 'scale-100'
              }`}
            >
              {/* FRONT FIGURE HOTZONES (Left figure centered around X: 84) */}
              {/* Chest / Pectorals */}
              <ellipse
                cx="84"
                cy="62"
                rx="16"
                ry="9"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('chest') ? 'rgba(0, 229, 255, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('chest') ? '#00e5ff' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('chest')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Front Shoulders (Deltoids) */}
              <circle
                cx="66"
                cy="56"
                r="7"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('front_shoulders') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('front_shoulders') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('front_shoulders')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />
              <circle
                cx="102"
                cy="56"
                r="7"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('front_shoulders') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('front_shoulders') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('front_shoulders')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Biceps (Front Arms) */}
              <ellipse
                cx="58"
                cy="74"
                rx="5"
                ry="10"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('biceps') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('biceps') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('biceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />
              <ellipse
                cx="110"
                cy="74"
                rx="5"
                ry="10"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('biceps') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('biceps') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('biceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Forearms */}
              <ellipse
                cx="54"
                cy="98"
                rx="4"
                ry="12"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('forearms') ? 'rgba(0, 229, 255, 0.5)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('forearms') ? '#00e5ff' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('forearms')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />
              <ellipse
                cx="114"
                cy="98"
                rx="4"
                ry="12"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('forearms') ? 'rgba(0, 229, 255, 0.5)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('forearms') ? '#00e5ff' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('forearms')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Abs & Core (6-pack) */}
              <rect
                x="76"
                y="74"
                width="16"
                height="28"
                rx="4"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('abs') ? 'rgba(252, 238, 10, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('abs') ? '#fcee0a' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('abs')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Front Quads (Thighs) */}
              <ellipse
                cx="74"
                cy="135"
                rx="9"
                ry="22"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('quads') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('quads') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('quads')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />
              <ellipse
                cx="94"
                cy="135"
                rx="9"
                ry="22"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('quads') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('quads') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('quads')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Calves (Front Shin / Calves) */}
              <ellipse
                cx="74"
                cy="180"
                rx="6"
                ry="16"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('calves') ? 'rgba(0, 229, 255, 0.5)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('calves') ? '#00e5ff' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />
              <ellipse
                cx="94"
                cy="180"
                rx="6"
                ry="16"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('calves') ? 'rgba(0, 229, 255, 0.5)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('calves') ? '#00e5ff' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* BACK FIGURE HOTZONES (Right figure centered around X: 224) */}
              {/* Upper Back / Traps */}
              <polygon
                points="224,42 208,60 224,78 240,60"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('traps') ? 'rgba(0, 229, 255, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('traps') ? '#00e5ff' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('traps')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Lats (V-Taper Upper & Middle Back) */}
              <polygon
                points="208,62 202,88 224,102 246,88 240,62 224,78"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('lats') ? 'rgba(0, 229, 255, 0.6)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('lats') ? '#00e5ff' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('lats')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Rear Deltoids (Rear Shoulders) */}
              <circle
                cx="205"
                cy="56"
                r="7"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('rear_shoulders') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('rear_shoulders') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('rear_shoulders')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />
              <circle
                cx="243"
                cy="56"
                r="7"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('rear_shoulders') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('rear_shoulders') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('rear_shoulders')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Triceps (Back Arms) */}
              <ellipse
                cx="198"
                cy="74"
                rx="5"
                ry="10"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('triceps') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('triceps') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('triceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />
              <ellipse
                cx="250"
                cy="74"
                rx="5"
                ry="10"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('triceps') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('triceps') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('triceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Glutes (Back Hips) */}
              <ellipse
                cx="214"
                cy="116"
                rx="10"
                ry="12"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('glutes') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('glutes') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('glutes')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />
              <ellipse
                cx="234"
                cy="116"
                rx="10"
                ry="12"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('glutes') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('glutes') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('glutes')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Hamstrings (Back Thighs) */}
              <ellipse
                cx="214"
                cy="144"
                rx="8"
                ry="18"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('hamstrings') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('hamstrings') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('hamstrings')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />
              <ellipse
                cx="234"
                cy="144"
                rx="8"
                ry="18"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('hamstrings') ? 'rgba(0, 255, 157, 0.55)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('hamstrings') ? '#00ff9d' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('hamstrings')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />

              {/* Calves (Back Lower Legs / Gastrocnemius) */}
              <ellipse
                cx="214"
                cy="180"
                rx="6"
                ry="16"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('calves') ? 'rgba(0, 229, 255, 0.5)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('calves') ? '#00e5ff' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />
              <ellipse
                cx="234"
                cy="180"
                rx="6"
                ry="16"
                className="cursor-pointer transition-all duration-300"
                fill={isMuscleActive('calves') ? 'rgba(0, 229, 255, 0.5)' : 'rgba(0,0,0,0.01)'}
                stroke={isMuscleActive('calves') ? '#00e5ff' : 'transparent'}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
              />
            </svg>
          </div>

          {/* Subtitle label */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 px-2">
            <span>LEFT: ANTERIOR (FRONT)</span>
            <span>RIGHT: POSTERIOR (BACK)</span>
          </div>
        </div>

        {/* Breakdown & Simple Exercise Guide (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-cyber-dark/80 border border-slate-200 dark:border-cyber-border shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-neon-green">
                {currentSplit.tag} // {currentSplit.day.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {currentSplit.focus}
              </span>
            </div>

            <h3 className="font-cyber text-xl font-bold text-slate-900 dark:text-white mb-2">
              {currentSplit.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {currentSplit.simpleDesc}
            </p>

            {/* Glowing Targeted Muscles */}
            <div className="mb-4">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block mb-1.5">
                GLOWING ON HOLOGRAM TODAY:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeMuscles.length > 0 ? (
                  activeMuscles.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-1 rounded-lg text-xs font-cyber font-bold uppercase bg-emerald-500/10 dark:bg-neon-green/15 text-emerald-700 dark:text-neon-green border border-emerald-500/30"
                    >
                      ✓ {m.replace('_', ' ')}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-mono text-slate-400 italic">
                    Rest Day: All muscle fibers repairing and recharging
                  </span>
                )}
              </div>
            </div>

            {/* Recommended Easy Moves */}
            <div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block mb-2">
                TOP MOVEMENTS FOR THESE MUSCLES:
              </span>
              <div className="space-y-2">
                {currentSplit.exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white dark:bg-cyber-black/70 border border-slate-200 dark:border-cyber-border flex items-start space-x-2.5 text-xs shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-neon-green shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-medium">
                        {ex.name}
                      </strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {ex.simpleTip}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
