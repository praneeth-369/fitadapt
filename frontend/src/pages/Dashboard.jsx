import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { workoutApi } from '../api/axiosClient';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { LiveFitnessDashboard } from '../components/LiveFitnessDashboard';
import { WorkoutCard } from '../components/WorkoutCard';
import { NutritionCard } from '../components/NutritionCard';
import { MentalHealthChat } from '../components/MentalHealthChat';
import { OnboardingModal } from '../components/OnboardingModal';
import { DevicePairingModal } from '../components/DevicePairingModal';
import { FoodTrackerModal } from '../components/FoodTrackerModal';
import {
  Zap,
  Sparkles,
  Dumbbell,
  Utensils,
  Flame,
  Clock,
  HeartHandshake,
  AlertCircle,
  Bluetooth,
  Camera,
  Calendar,
  CheckCircle,
  X,
  Activity,
} from 'lucide-react';

const WORKOUT_SPLITS = [
  { id: 'Chest-Tricep', name: 'Chest-Tricep', simpleLabel: 'Chest & Triceps', desc: 'Push strength & arms', icon: '💥' },
  { id: 'Back-Bicep', name: 'Back-Bicep', simpleLabel: 'Back & Biceps', desc: 'Pull strength & posture', icon: '⚡' },
  { id: 'Legs-Shoulders', name: 'Legs-Shoulders', simpleLabel: 'Legs & Shoulders', desc: 'Legs & shoulder presses', icon: '🦵' },
  { id: 'Upper-Body', name: 'Upper-Body', simpleLabel: 'Upper Body', desc: 'Full upper torso & arms', icon: '💪' },
  { id: 'Lower-Body', name: 'Lower-Body', simpleLabel: 'Lower Body', desc: 'Hips, legs & calves', icon: '🏃' },
  { id: 'Cardio/Run', name: 'Cardio/Run', simpleLabel: 'Cardio & Run', desc: 'Heart stamina & pacing', icon: '❤️' },
  { id: 'REST', name: 'REST', simpleLabel: 'Rest & Recover', desc: 'Gentle stretch & recharge', icon: '🧘' },
];

export const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const { liveMetrics, isDeviceConnected } = useSocket();

  const [aiPlan, setAiPlan] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'workout' | 'nutrition' | 'chat'
  const [durationPref, setDurationPref] = useState(30);
  const [energyLevel, setEnergyLevel] = useState('moderate');
  const [selectedSplit, setSelectedSplit] = useState('Chest-Tricep');

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  const [isFoodTrackerOpen, setIsFoodTrackerOpen] = useState(false);

  // Food logging state
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [mealToast, setMealToast] = useState('');

  // Generate Workout Plan
  const handleGeneratePlan = async (splitOverride) => {
    const splitToUse = splitOverride || selectedSplit;
    setLoadingAi(true);
    setError('');

    try {
      const payload = {
        liveMetrics: {
          heartRate: liveMetrics?.heartRate || 80,
          steps: liveMetrics?.steps || 3200,
          activeCalories: liveMetrics?.activeCalories || 120,
          spo2: liveMetrics?.spo2 || 98,
          stressScore: liveMetrics?.stressScore || 24,
          timestamp: liveMetrics?.timestamp || new Date().toISOString(),
        },
        splitDay: splitToUse,
        pastInjuries: user?.pastInjuries || [],
        profileOverride: {
          height: user?.height,
          weight: user?.weight,
          age: user?.age,
          gender: user?.gender,
          primaryGoal: user?.primaryGoal,
          fitnessLevel: user?.fitnessLevel,
          availableEquipment: user?.availableEquipment,
          pastInjuries: user?.pastInjuries,
        },
        workoutDurationPreference: durationPref,
        currentEnergyLevel: energyLevel,
      };

      const res = await workoutApi.generateWorkout(payload);
      if (res.data?.plan) {
        setAiPlan(res.data.plan);
      }
    } catch (err) {
      console.error('[Dashboard] Error creating plan:', err);
      setError(
        err.response?.data?.message || err.message || 'Failed to create your workout plan'
      );
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    if (!aiPlan && user) {
      handleGeneratePlan('Chest-Tricep');
    }
  }, [user]);

  const handleSelectSplit = (splitId) => {
    setSelectedSplit(splitId);
    handleGeneratePlan(splitId);
  };

  const handleSaveProfile = async (updatedData) => {
    await updateProfile(updatedData);
    handleGeneratePlan();
  };

  const handleMealLogged = (meal) => {
    setLoggedMeals((prev) => [meal, ...prev]);
    setMealToast(`Logged ${meal.foodName} (${meal.calories} kcal)`);
    setTimeout(() => setMealToast(''), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-cyber-black text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Responsive Left Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={(id) => setActiveSection(id)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenPairingModal={() => setIsPairingModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col">
        {/* Top Navbar with Prominent Top-Right Light/Dark Toggle */}
        <Navbar
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenChat={() => setIsChatModalOpen(true)}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Section Tabs (Clean navigation with no welcome banner) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveSection('overview')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeSection === 'overview'
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-neon-green border border-emerald-500/40 shadow-sm'
                    : 'bg-white dark:bg-cyber-dark text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-cyber-border hover:border-slate-400'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Live Dashboard</span>
              </button>
              <button
                onClick={() => setActiveSection('workout')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeSection === 'workout'
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-neon-green border border-emerald-500/40 shadow-sm'
                    : 'bg-white dark:bg-cyber-dark text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-cyber-border hover:border-slate-400'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Workouts</span>
              </button>
              <button
                onClick={() => setActiveSection('nutrition')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeSection === 'nutrition'
                    ? 'bg-cyan-500/15 text-cyan-800 dark:text-neon-cyan border border-cyan-500/40 shadow-sm'
                    : 'bg-white dark:bg-cyber-dark text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-cyber-border hover:border-slate-400'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Meals</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFoodTrackerOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white dark:bg-cyber-dark border border-emerald-500/40 text-emerald-800 dark:text-neon-green hover:bg-emerald-500/10 flex items-center gap-1.5 transition shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Log Food</span>
              </button>
              <button
                onClick={() => setIsPairingModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white dark:bg-cyber-dark border border-cyan-500/40 text-cyan-800 dark:text-neon-cyan hover:bg-cyan-500/10 flex items-center gap-1.5 transition shadow-sm"
              >
                <Bluetooth className="w-3.5 h-3.5" />
                <span>{isDeviceConnected ? 'Watch Linked' : 'Link Watch'}</span>
              </button>
            </div>
          </div>

          {/* Meal logged toast banner */}
          {mealToast && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-neon-green text-xs font-mono rounded-xl flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{mealToast}</span>
              </div>
              <button onClick={() => setMealToast('')} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* =========================================================
              SECTION 1: DASHBOARD (ONLY GRAPHS & LIVE FITNESS DATA)
             ========================================================= */}
          {activeSection === 'overview' && (
            <LiveFitnessDashboard
              onOpenPairingModal={() => setIsPairingModalOpen(true)}
            />
          )}

          {/* =========================================================
              SECTION 2: WORKOUTS ("IN WORKOUT SECTION AND NO WHERE ELSE")
             ========================================================= */}
          {activeSection === 'workout' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 7-DAY WORKOUT SPLIT RIBBON (ONLY IN WORKOUTS SECTION) */}
              <section className="cyber-card rounded-2xl p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-neon-green" />
                    <h3 className="font-cyber font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                      7-DAY WORKOUT SPLIT (PICK TODAY'S FOCUS)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    Includes daily warm-up & cool-down stretching
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {WORKOUT_SPLITS.map((split) => {
                    const isCurrent = selectedSplit === split.id;
                    return (
                      <button
                        key={split.id}
                        onClick={() => handleSelectSplit(split.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isCurrent
                            ? 'bg-emerald-500/15 border-emerald-500 shadow-neon-green text-slate-900 dark:text-white'
                            : 'bg-slate-50 dark:bg-cyber-black/40 border-slate-200 dark:border-cyber-border text-slate-800 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{split.icon}</span>
                          {isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-neon-green animate-pulse" />
                          )}
                        </div>
                        <p className={`font-cyber text-xs font-bold mt-2 ${isCurrent ? 'text-emerald-700 dark:text-neon-green' : 'text-slate-900 dark:text-slate-200'}`}>
                          {split.name}
                        </p>
                        <p className="text-[10px] text-slate-700 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
                          {split.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Workout Creator Controls */}
              <section className="cyber-card rounded-2xl p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-emerald-600 dark:text-neon-green text-xs font-mono font-bold tracking-wider uppercase mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>COACH WORKOUT CREATOR</span>
                    </div>
                    <h2 className="font-cyber text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      Workout for "{selectedSplit}"
                    </h2>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
                      Basic, safe moves with simple form steps and daily stretching.
                    </p>
                  </div>

                  {/* Simple Session Options */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-cyber-dark border border-cyber-border rounded-xl p-2 flex items-center space-x-2 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-300 font-semibold">Duration:</span>
                      <select
                        value={durationPref}
                        onChange={(e) => setDurationPref(Number(e.target.value))}
                        style={{ colorScheme: 'dark' }}
                        className="bg-[#0d111a] text-white font-cyber font-bold focus:outline-none cursor-pointer rounded px-1.5 py-0.5"
                      >
                        <option value={20} className="bg-[#0d111a] text-white py-1.5">20 mins</option>
                        <option value={30} className="bg-[#0d111a] text-white py-1.5">30 mins</option>
                        <option value={45} className="bg-[#0d111a] text-white py-1.5">45 mins</option>
                      </select>
                    </div>

                    <div className="bg-cyber-dark border border-cyber-border rounded-xl p-2 flex items-center space-x-2 text-xs font-mono">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-slate-300 font-semibold">Energy:</span>
                      <select
                        value={energyLevel}
                        onChange={(e) => setEnergyLevel(e.target.value)}
                        style={{ colorScheme: 'dark' }}
                        className="bg-[#0d111a] text-white font-cyber font-bold focus:outline-none cursor-pointer rounded px-1.5 py-0.5"
                      >
                        <option value="low" className="bg-[#0d111a] text-white py-1.5">Easy Pace</option>
                        <option value="moderate" className="bg-[#0d111a] text-white py-1.5">Normal</option>
                        <option value="high" className="bg-[#0d111a] text-white py-1.5">High Energy</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleGeneratePlan(selectedSplit)}
                      disabled={loadingAi}
                      className="px-6 py-2.5 rounded-xl cyber-button-green flex items-center justify-center space-x-2 font-cyber font-bold text-xs transition disabled:opacity-50"
                    >
                      {loadingAi ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                          <span>CREATING PLAN...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-current" />
                          <span>MAKE WORKOUT</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-400 text-xs font-mono rounded-xl flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </section>

              {/* Workout Cards with Daily Stretching & Form Guides */}
              {aiPlan ? (
                <WorkoutCard
                  workoutData={aiPlan}
                  adaptationAnalysis={aiPlan.adaptationAnalysis}
                />
              ) : (
                <div className="text-center py-12 cyber-card rounded-2xl p-6">
                  <Dumbbell className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
                  <h3 className="font-cyber text-lg font-bold">No active workout generated</h3>
                  <p className="text-xs text-slate-500 mb-4">Click "Make Workout" to build today's routine</p>
                  <button
                    onClick={() => handleGeneratePlan(selectedSplit)}
                    className="px-5 py-2.5 rounded-xl cyber-button-green text-xs font-mono"
                  >
                    Make Workout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              SECTION 3: NUTRITION & RECIPES
             ========================================================= */}
          {activeSection === 'nutrition' && (
            <div className="space-y-6 animate-fadeIn">
              {aiPlan ? (
                <NutritionCard
                  nutritionData={aiPlan.nutrition}
                  onOpenFoodTracker={() => setIsFoodTrackerOpen(true)}
                  loggedMeals={loggedMeals}
                />
              ) : (
                <div className="text-center py-12 cyber-card rounded-2xl p-6">
                  <Utensils className="w-12 h-12 mx-auto text-cyan-500 mb-2" />
                  <h3 className="font-cyber text-lg font-bold">No meal recommendations yet</h3>
                  <button
                    onClick={() => handleGeneratePlan()}
                    className="mt-4 px-5 py-2.5 rounded-xl cyber-button-green text-xs font-mono"
                  >
                    Create Nutrition Plan
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              SECTION 4: COACH MAYA CHAT
             ========================================================= */}
          {activeSection === 'chat' && (
            <div className="max-w-2xl mx-auto animate-fadeIn">
              <MentalHealthChat />
            </div>
          )}
        </main>
      </div>

      {/* Floating Coach Maya Chat Bubble Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsChatModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-3 rounded-full cyber-button-green text-xs font-cyber font-bold shadow-xl hover:scale-105 transition-all"
        >
          <HeartHandshake className="w-4 h-4 fill-current" />
          <span>Talk to Coach Maya</span>
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg relative">
            <MentalHealthChat onClose={() => setIsChatModalOpen(false)} />
          </div>
        </div>
      )}

      {/* AI Food & Calorie Estimator Modal (Photo or Text) */}
      <FoodTrackerModal
        isOpen={isFoodTrackerOpen}
        onClose={() => setIsFoodTrackerOpen(false)}
        onMealLogged={handleMealLogged}
      />

      {/* Device Pairing Modal for Real Bluetooth & Virtual Band */}
      <DevicePairingModal
        isOpen={isPairingModalOpen}
        onClose={() => setIsPairingModalOpen(false)}
      />

      {/* Edit Biometrics Modal */}
      <OnboardingModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialData={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};
