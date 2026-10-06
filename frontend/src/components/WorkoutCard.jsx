import React, { useState, useEffect } from 'react';
import { axiosClient } from '../api/axiosClient';
import {
  Dumbbell,
  Clock,
  Flame,
  Activity,
  CheckCircle2,
  Circle,
  Sparkles,
  RefreshCw,
  ArrowRightLeft,
  X,
  Shield,
  ChevronDown,
  ChevronUp,
  Heart,
  Smile,
} from 'lucide-react';

export const WorkoutCard = ({ workoutData: initialWorkoutData, adaptationAnalysis }) => {
  const [workoutData, setWorkoutData] = useState(initialWorkoutData);
  const [completedExercises, setCompletedExercises] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState({});

  // Exercise Swap Modal / State
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swappingIdx, setSwappingIdx] = useState(null);
  const [alternativesList, setAlternativesList] = useState([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  useEffect(() => {
    setWorkoutData(initialWorkoutData);
  }, [initialWorkoutData]);

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (timerRunning && activeTimer && activeTimer.timeLeft > 0) {
      interval = setInterval(() => {
        setActiveTimer((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (activeTimer && activeTimer.timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, activeTimer]);

  const toggleComplete = (idx) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleSteps = (idx) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const startRestTimer = (idx, restSeconds) => {
    setActiveTimer({ exerciseIdx: idx, timeLeft: restSeconds });
    setTimerRunning(true);
  };

  const resetTimer = () => {
    setActiveTimer(null);
    setTimerRunning(false);
  };

  // Open swap options for an exercise
  const handleOpenSwap = async (idx, exercise) => {
    setSwappingIdx(idx);
    setSwapModalOpen(true);
    setLoadingAlternatives(true);

    try {
      const res = await axiosClient.post('/api/workout/alternatives', {
        exerciseName: exercise.name,
      });
      setAlternativesList(res.data?.alternatives || []);
    } catch (err) {
      console.error('[WorkoutCard] Failed to fetch alternatives:', err);
      // Friendly fallback alternatives
      setAlternativesList([
        {
          name: 'Gentle Bodyweight Version',
          reason: 'Lighter on joints and zero equipment required',
          tip: 'Move slowly and focus on steady breathing.',
        },
        {
          name: 'Chair-Supported Variation',
          reason: 'Provides balance and helps protect lower back',
          tip: 'Hold a sturdy chair for stability.',
        },
        {
          name: 'Wall-Assisted Movement',
          reason: 'Easy to modify effort by stepping closer or further away',
          tip: 'Keep your body tall and aligned.',
        },
      ]);
    } finally {
      setLoadingAlternatives(false);
    }
  };

  // Apply alternative selection
  const handleSelectAlternative = (alt) => {
    if (swappingIdx === null || !workoutData) return;

    const baseWorkout = workoutData.workout || workoutData;
    const updatedExercises = [...(baseWorkout.exercises || [])];
    const original = updatedExercises[swappingIdx];

    updatedExercises[swappingIdx] = {
      ...original,
      name: alt.name,
      coachTip: alt.tip || alt.reason,
      injuryModification: 'Joint-friendly swap selected by you.',
    };

    if (workoutData.workout) {
      setWorkoutData({
        ...workoutData,
        workout: {
          ...workoutData.workout,
          exercises: updatedExercises,
        },
      });
    } else {
      setWorkoutData({
        ...workoutData,
        exercises: updatedExercises,
      });
    }

    setSwapModalOpen(false);
    setSwappingIdx(null);
  };

  if (!workoutData) return null;

  const workoutObj = workoutData.workout || workoutData;
  const exercises = workoutObj.exercises || [];
  const dailyStretching = workoutData.dailyStretching || [];
  const coachInjuryNotice = workoutData.coachInjuryNotice || '';
  const splitDay = workoutData.splitDay || '';

  const totalExercises = exercises.length;
  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const progressPct = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Coach Injury & Safety Alert */}
      {coachInjuryNotice && (
        <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-yellow-500/10 border border-amber-500/30 dark:border-yellow-500/30 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-yellow-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-amber-700 dark:text-yellow-400">
              COACH SAFETY & INJURY CARE
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              {coachInjuryNotice}
            </p>
          </div>
        </div>
      )}

      {/* Simple Live Adaptation Note */}
      {adaptationAnalysis && (
        <div className="cyber-card rounded-2xl p-4 sm:p-5 border-l-4 border-l-emerald-500 dark:border-l-neon-green">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-neon-green text-xs font-mono font-bold uppercase mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>HOW TODAY'S WORKOUT WAS SHAPED FOR YOU</span>
          </div>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans mb-3">
            {adaptationAnalysis.telemetryDiagnosis}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-cyber-border/70 text-xs font-mono">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">INTENSITY</span>
              <strong className="text-cyan-600 dark:text-neon-cyan">{adaptationAnalysis.intensityAdjustment}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">HEART PACE TARGET</span>
              <strong className="text-emerald-600 dark:text-neon-green">{adaptationAnalysis.targetHeartRateZone}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">TIME TO FINISH</span>
              <strong className="text-slate-900 dark:text-white">{adaptationAnalysis.estimatedDurationMinutes} MINS</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">ESTIMATED BURN</span>
              <strong className="text-yellow-600 dark:text-yellow-400">{adaptationAnalysis.calorieBurnTarget} KCAL</strong>
            </div>
          </div>
        </div>
      )}

      {/* Main Exercises Protocol Card */}
      <div className="cyber-card rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-cyber-border mb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-neon-green border border-emerald-500/30">
                {splitDay ? `SPLIT: ${splitDay.toUpperCase()}` : 'CUSTOM WORKOUT'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-neon-cyan border border-cyan-500/30">
                DAILY PROGRAM
              </span>
            </div>
            <h2 className="font-cyber text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {workoutObj.title || `Workout Protocol: ${splitDay}`}
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">{workoutObj.description}</p>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center space-x-3 bg-slate-100 dark:bg-cyber-dark/80 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-cyber-border self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-bold block">COMPLETED</span>
              <span className="font-cyber text-sm font-bold text-emerald-700 dark:text-neon-green">
                {completedCount} OF {totalExercises} MOVES
              </span>
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-slate-400 dark:border-cyber-border flex items-center justify-center font-mono text-xs font-bold text-emerald-700 dark:text-neon-green">
              {progressPct}%
            </div>
          </div>
        </div>

        {/* Rest Timer */}
        {activeTimer && (
          <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-600 dark:text-neon-cyan" />
              <span className="text-xs font-mono text-cyan-800 dark:text-neon-cyan font-bold">
                CATCH YOUR BREATH:
              </span>
              <span className="font-cyber text-lg text-slate-900 dark:text-white font-bold">
                {activeTimer.timeLeft}s
              </span>
            </div>
            <button
              onClick={resetTimer}
              className="px-2.5 py-1 bg-white dark:bg-cyber-dark border border-cyan-500/30 rounded text-[11px] font-mono text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold"
            >
              Ready To Go
            </button>
          </div>
        )}

        {/* SECTION: DAILY STRETCHING (WARM-UP & COOL-DOWN) */}
        {dailyStretching && dailyStretching.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-cyan-500/5 dark:bg-neon-cyan/5 border border-cyan-500/20 dark:border-neon-cyan/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-cyber text-xs uppercase tracking-wider text-cyan-700 dark:text-neon-cyan flex items-center gap-1.5 font-bold">
                <Activity className="w-4 h-4" />
                DAILY STRETCHING ROUTINE (EVERY DAY)
              </h3>
              <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-medium">
                Keep joints mobile & pain-free
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dailyStretching.map((stretch, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-white dark:bg-cyber-dark/80 border border-slate-200 dark:border-cyber-border rounded-xl p-3.5 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-neon-cyan font-bold border border-cyan-500/20">
                        {stretch.phase || 'Daily Stretch'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                        {stretch.name}
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-neon-green font-bold">
                      {stretch.holdDuration || '30s hold'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    <strong className="text-slate-900 dark:text-white">Targets:</strong> {stretch.targetMuscleSimple || 'Full Body'}
                  </p>

                  {/* Form instructions */}
                  {Array.isArray(stretch.howToSteps) && stretch.howToSteps.length > 0 && (
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-[11px] space-y-1 text-slate-800 dark:text-slate-300 font-medium">
                      <p className="font-bold text-[10px] uppercase font-mono text-slate-700 dark:text-slate-400">
                        How to do it:
                      </p>
                      {stretch.howToSteps.map((stepText, stpIdx) => (
                        <p key={stpIdx} className="leading-snug">
                          • {stepText}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Injury safety tip */}
                  {stretch.injurySafetyTip && (
                    <p className="text-[10px] text-amber-700 dark:text-yellow-400 flex items-center gap-1 font-semibold">
                      <span>🛡️ Joint note:</span> {stretch.injurySafetyTip}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: TODAY'S EXERCISES */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-cyber text-xs uppercase tracking-wider text-emerald-700 dark:text-neon-green flex items-center gap-1.5 font-bold">
              <Dumbbell className="w-4 h-4" />
              TODAY'S WORKOUT EXERCISES ({totalExercises} MOVES)
            </h3>
            <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-medium">
              💡 Tap "How to do it" for form guides or "Swap Move" for alternatives
            </span>
          </div>

          <div className="space-y-3">
            {exercises.map((exercise, idx) => {
              const isCompleted = !!completedExercises[idx];
              const isStepsOpen = !!expandedSteps[idx];
              return (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-slate-100/60 dark:bg-cyber-dark/40 border-emerald-500/30 opacity-75'
                      : 'bg-white dark:bg-cyber-dark/90 border-slate-200 dark:border-cyber-border hover:border-slate-400 dark:hover:border-slate-600 shadow-sm dark:shadow-none'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Checkbox and Details */}
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleComplete(idx)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-500 dark:hover:text-neon-green transition"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-neon-green" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={`font-cyber text-sm sm:text-base font-bold ${
                              isCompleted
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {exercise.name}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold">
                            Targets: {exercise.targetMuscleSimple || exercise.targetMuscles || 'Key Muscles'}
                          </span>
                        </div>

                        {/* Sets / Reps in simple words */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs font-mono">
                          <span className="text-emerald-700 dark:text-neon-green font-bold">
                            {exercise.sets} ROUNDS (SETS)
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-900 dark:text-white font-semibold">
                            {exercise.reps}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-700 dark:text-slate-400 font-medium">
                            {exercise.restSeconds || 60}s Rest between rounds
                          </span>
                        </div>

                        {/* Coach Injury Safe Modification */}
                        {exercise.injuryModification && (
                          <div className="mt-2 p-2 rounded-lg bg-amber-500/10 dark:bg-yellow-500/10 border border-amber-500/30 dark:border-yellow-500/30 text-xs text-amber-800 dark:text-yellow-400 flex items-start gap-1.5 font-medium">
                            <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>
                              <strong>Joint Safety:</strong> {exercise.injuryModification}
                            </span>
                          </div>
                        )}

                        {/* Coach Form / Breathing Tip */}
                        {(exercise.coachTip || exercise.formTip) && (
                          <p className="text-xs text-slate-800 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800 font-medium">
                            💡 Coach Tip: {exercise.coachTip || exercise.formTip}
                          </p>
                        )}

                        {/* Step-by-Step Form Instructions Accordion */}
                        {Array.isArray(exercise.howToSteps) && exercise.howToSteps.length > 0 && (
                          <div className="mt-2.5">
                            <button
                              type="button"
                              onClick={() => toggleSteps(idx)}
                              className="text-xs font-mono text-cyan-700 dark:text-neon-cyan flex items-center gap-1 hover:underline font-bold"
                            >
                              <span>{isStepsOpen ? 'Hide form instructions' : 'How to do this step-by-step'}</span>
                              {isStepsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {isStepsOpen && (
                              <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-800 dark:text-slate-300 font-medium animate-fadeIn">
                                <p className="font-mono text-[10px] uppercase font-bold text-slate-700 dark:text-slate-400">
                                  Step-by-step guide:
                                </p>
                                {exercise.howToSteps.map((step, stpIdx) => (
                                  <div key={stpIdx} className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-cyan-700 dark:text-neon-cyan shrink-0">
                                      {stpIdx + 1}.
                                    </span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Swap & Rest Timer */}
                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-start">
                      <button
                        onClick={() => handleOpenSwap(idx, exercise)}
                        title="Swap for a gentler or different variation"
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-cyber-card border border-slate-300 dark:border-cyber-border hover:border-cyan-500 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-neon-cyan text-xs font-mono transition"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Swap Move</span>
                      </button>

                      <button
                        onClick={() => startRestTimer(idx, exercise.restSeconds || 60)}
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-cyber-card border border-slate-300 dark:border-cyber-border hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-neon-green text-xs font-mono transition"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{exercise.restSeconds || 60}s Rest</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SWAP ALTERNATIVES MODAL */}
      {swapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md cyber-card rounded-2xl p-5 border border-cyan-500/40 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-cyber-border mb-4">
              <div>
                <h3 className="font-cyber text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-cyan-600 dark:text-neon-cyan" />
                  CHOOSE AN ALTERNATIVE MOVE
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pick a gentler or different move that feels better for you today
                </p>
              </div>
              <button
                onClick={() => setSwapModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingAlternatives ? (
              <div className="py-8 text-center text-xs font-mono text-slate-500">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-500" />
                Finding great alternatives...
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {alternativesList.map((alt, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-border hover:border-cyan-500 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-cyber text-sm font-bold text-slate-900 dark:text-white">
                          {alt.name}
                        </h4>
                        <p className="text-xs text-emerald-600 dark:text-neon-green font-medium mt-0.5">
                          ✓ {alt.reason}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          💡 {alt.tip}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectAlternative(alt)}
                        className="px-3 py-1.5 rounded-lg cyber-button-green text-xs font-mono font-bold shrink-0 mt-1"
                      >
                        Use This
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
