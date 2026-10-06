import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import {
  Heart,
  Flame,
  Footprints,
  Activity,
  Watch,
  Bluetooth,
  Battery,
  TrendingUp,
  Zap,
  PowerOff,
  CheckCircle,
  Clock,
  Radio,
  ArrowUpRight,
  Smile,
} from 'lucide-react';

export const LiveFitnessDashboard = ({ onOpenPairingModal }) => {
  const {
    liveMetrics,
    isDeviceConnected,
    connectionType,
    connectedDeviceDetails,
    disconnectDevice,
    hrHistory,
    triggerActivitySurge,
  } = useSocket();

  const [activeGraphTab, setActiveGraphTab] = useState('heartRate'); // 'heartRate' | 'steps' | 'calories'

  // Heart rate helper in simple English
  const getSimpleHeartZone = (hr) => {
    if (!hr) return { label: 'Waiting for signal', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' };
    if (hr < 80) return { label: 'Relaxed & Resting', color: 'text-cyan-600 dark:text-neon-cyan', bg: 'bg-cyan-50 dark:bg-cyan-950/40' };
    if (hr < 100) return { label: 'Easy Fat Burn', color: 'text-emerald-600 dark:text-neon-green', bg: 'bg-emerald-50 dark:bg-emerald-950/40' };
    if (hr < 118) return { label: 'Cardio Pacing', color: 'text-amber-600 dark:text-yellow-400', bg: 'bg-amber-50 dark:bg-yellow-950/40' };
    return { label: 'High Intensity Pace', color: 'text-rose-600 dark:text-pink-400', bg: 'bg-rose-50 dark:bg-rose-950/40' };
  };

  const zone = getSimpleHeartZone(liveMetrics?.heartRate);

  const stepGoal = 10000;
  const currentSteps = liveMetrics?.steps || 0;
  const stepPercent = Math.min(100, Math.round((currentSteps / stepGoal) * 100));
  const kmWalked = (currentSteps * 0.00075).toFixed(2);

  // Hourly step simulation data based on current steps
  const hourlySteps = [
    { hour: '8 AM', steps: Math.round(currentSteps * 0.08) },
    { hour: '10 AM', steps: Math.round(currentSteps * 0.16) },
    { hour: '12 PM', steps: Math.round(currentSteps * 0.22) },
    { hour: '2 PM', steps: Math.round(currentSteps * 0.18) },
    { hour: '4 PM', steps: Math.round(currentSteps * 0.14) },
    { hour: '6 PM', steps: Math.round(currentSteps * 0.12) },
    { hour: '8 PM', steps: Math.round(currentSteps * 0.10) },
  ];
  const maxHourlySteps = Math.max(...hourlySteps.map((h) => h.steps), 100);

  // Weekly consistency data in simple English
  const weeklyDays = [
    { day: 'Mon', completed: true, pct: 100, cals: 420 },
    { day: 'Tue', completed: true, pct: 95, cals: 380 },
    { day: 'Wed', completed: true, pct: 100, cals: 510 },
    { day: 'Thu', completed: true, pct: 85, cals: 340 },
    { day: 'Fri', completed: true, pct: 100, cals: 490 },
    { day: 'Sat', completed: true, pct: 100, cals: 620 },
    { day: 'Sun (Today)', completed: stepPercent >= 70, pct: stepPercent, cals: liveMetrics?.activeCalories || 210, isToday: true },
  ];

  // SVG coordinates for Heart Rate Line Graph
  const chartWidth = 600;
  const chartHeight = 160;
  const hrPoints = hrHistory.length > 0 ? hrHistory : [72, 75, 78, 82, 85, 80, 84, 88, 92, 86];
  const minHr = 55;
  const maxHr = 130;

  const pointsString = hrPoints
    .map((val, idx) => {
      const x = (idx / (hrPoints.length - 1 || 1)) * chartWidth;
      const y = chartHeight - ((val - minHr) / (maxHr - minHr)) * chartHeight;
      return `${x},${Math.max(10, Math.min(chartHeight - 10, y))}`;
    })
    .join(' ');

  const areaPointsString = `0,${chartHeight} ${pointsString} ${chartWidth},${chartHeight}`;
  const lastPoint = pointsString.split(' ').pop() || `0,${chartHeight / 2}`;
  const [lastX, lastY] = lastPoint.split(',');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Connection & Quick Device Controls */}
      <div className="cyber-card rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition ${
              isDeviceConnected
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-neon-green shadow-neon-green'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
            }`}
          >
            {isDeviceConnected ? (
              <Bluetooth className="w-5 h-5 text-cyan-600 dark:text-neon-cyan animate-pulse" />
            ) : (
              <Watch className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cyber font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                LIVE FITNESS DATA & GRAPHS
              </h2>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  isDeviceConnected
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-neon-green border border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                }`}
              >
                {isDeviceConnected ? 'DEVICE CONNECTED' : 'NOT CONNECTED'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isDeviceConnected
                ? `Connected to: ${connectedDeviceDetails.name || 'Smartwatch'} • Streaming live numbers`
                : 'Connect your smartwatch or Bluetooth band to view live pulse & motion.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isDeviceConnected ? (
            <>
              {connectedDeviceDetails.battery !== null && (
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-100 dark:bg-cyber-dark text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-cyber-border">
                  <Battery className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{connectedDeviceDetails.battery}% Battery</span>
                </div>
              )}
              <button
                onClick={triggerActivitySurge}
                title="Simulate quick exercise pulse increase"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-neon-green hover:bg-emerald-500/20 transition font-bold"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Workout Surge</span>
              </button>
              <button
                onClick={disconnectDevice}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-mono bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition font-bold"
              >
                <PowerOff className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenPairingModal}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-mono cyber-button-green transition font-bold"
            >
              <Bluetooth className="w-4 h-4" />
              <span>Connect Watch / Band</span>
            </button>
          )}
        </div>
      </div>

      {/* DISCONNECTED PLACEHOLDER CALLOUT */}
      {!isDeviceConnected && (
        <div className="cyber-card p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-cyber-border/80 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <Bluetooth className="w-7 h-7" />
          </div>
          <h3 className="font-cyber text-lg font-bold text-slate-900 dark:text-white mb-1">
            No Watch or Fitness Band Connected
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 max-w-md mx-auto mb-5 leading-relaxed font-medium">
            Link your real Bluetooth band (Apple Watch, Polar, Garmin, etc.) or open the virtual band simulator to stream live heart rate, steps, and activity charts!
          </p>
          <button
            onClick={onOpenPairingModal}
            className="px-6 py-2.5 rounded-xl cyber-button-green text-xs font-mono inline-flex items-center gap-2 font-bold shadow-md"
          >
            <Bluetooth className="w-4 h-4" />
            <span>Connect Fitness Device Now</span>
          </button>
        </div>
      )}

      {/* 4 CORE LIVE STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate Card */}
        <div className="cyber-card rounded-2xl p-4 relative overflow-hidden transition-all hover:border-emerald-500/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-800 dark:text-slate-300 flex items-center gap-1.5 font-bold">
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              HEART RATE
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${zone.bg} ${zone.color}`}>
              {isDeviceConnected ? zone.label : 'Offline'}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-cyber text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {isDeviceConnected ? liveMetrics?.heartRate : '--'}
            </span>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-400 font-bold">BPM (BEATS/MIN)</span>
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-400 mt-2 font-medium">
            {isDeviceConnected ? 'Normal resting: 65 - 80 bpm' : 'Connect band to measure'}
          </p>
        </div>

        {/* Daily Steps Card */}
        <div className="cyber-card rounded-2xl p-4 relative overflow-hidden transition-all hover:border-cyan-500/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-800 dark:text-slate-300 flex items-center gap-1.5 font-bold">
              <Footprints className="w-4 h-4 text-cyan-600 dark:text-neon-cyan" />
              DAILY STEPS
            </span>
            <span className="text-[10px] font-mono text-cyan-700 dark:text-neon-cyan font-bold">
              {isDeviceConnected ? `${stepPercent}% of goal` : 'Goal: 10k'}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-cyber text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {isDeviceConnected ? currentSteps.toLocaleString() : '--'}
            </span>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-400 font-bold">STEPS</span>
          </div>
          {/* Progress Bar */}
          <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-neon-cyan h-full rounded-full transition-all duration-500"
              style={{ width: `${isDeviceConnected ? stepPercent : 0}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-400 mt-1.5 font-medium">
            {isDeviceConnected ? `Distance walked: approx ${kmWalked} km` : 'Track your daily movement'}
          </p>
        </div>

        {/* Calories Burned Card */}
        <div className="cyber-card rounded-2xl p-4 relative overflow-hidden transition-all hover:border-yellow-400/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-800 dark:text-slate-300 flex items-center gap-1.5 font-bold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              BURNED CALORIES
            </span>
            <span className="text-[10px] font-mono text-amber-700 dark:text-yellow-400 font-bold">
              ACTIVE BURN
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-cyber text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {isDeviceConnected ? liveMetrics?.activeCalories : '--'}
            </span>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-400 font-bold">CALORIES (KCAL)</span>
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-400 mt-2 font-medium">
            {isDeviceConnected ? 'Energy burned from walking and workouts' : 'Connect watch to calculate'}
          </p>
        </div>

        {/* Oxygen & Stress Level Card */}
        <div className="cyber-card rounded-2xl p-4 relative overflow-hidden transition-all hover:border-purple-500/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-800 dark:text-slate-300 flex items-center gap-1.5 font-bold">
              <Activity className="w-4 h-4 text-purple-500" />
              BODY OXYGEN & STRESS
            </span>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-neon-green font-bold">
              {isDeviceConnected ? 'HEALTHY' : 'READY'}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-cyber text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {isDeviceConnected ? `${liveMetrics?.spo2 || 98}%` : '--'}
            </span>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-400 font-bold">BLOOD OXYGEN</span>
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-400 mt-2 font-medium">
            {isDeviceConnected
              ? `Stress level: ${liveMetrics?.stressScore || 22}/100 (Calm & steady)`
              : 'Shows oxygen and relaxation levels'}
          </p>
        </div>
      </div>

      {/* MAIN INTERACTIVE FITNESS GRAPHS SECTION */}
      <div className="cyber-card rounded-2xl p-5 sm:p-6 space-y-6">
        {/* Graph Header & Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-cyber-border gap-3">
          <div>
            <h3 className="font-cyber text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-neon-green" />
              LIVE HEALTH & ACTIVITY CHARTS
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
              Live trends over time to track your daily progress
            </p>
          </div>

          {/* Graph selector tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-cyber-dark p-1 rounded-xl border border-slate-300 dark:border-cyber-border self-start sm:self-auto">
            <button
              onClick={() => setActiveGraphTab('heartRate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                activeGraphTab === 'heartRate'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Heart Rate Graph</span>
            </button>
            <button
              onClick={() => setActiveGraphTab('steps')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                activeGraphTab === 'steps'
                  ? 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-neon-cyan shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Steps by Hour</span>
            </button>
            <button
              onClick={() => setActiveGraphTab('calories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                activeGraphTab === 'calories'
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-yellow-400 shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Calories Burned</span>
            </button>
          </div>
        </div>

        {/* 1. HEART RATE GRAPH */}
        {activeGraphTab === 'heartRate' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-slate-800 dark:text-slate-300 font-bold">
                PULSE WAVE (RECENT READINGS):
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                  Resting Line: 70 bpm
                </span>
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Cardio Line: 105 bpm
                </span>
              </div>
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="w-full bg-slate-50 dark:bg-cyber-dark/80 rounded-xl p-4 border border-slate-200 dark:border-cyber-border overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-44 sm:h-52 overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.3" />
                <line x1="0" y1={chartHeight * 0.55} x2={chartWidth} y2={chartHeight * 0.55} stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.3" />
                <line x1="0" y1={chartHeight * 0.85} x2={chartWidth} y2={chartHeight * 0.85} stroke="#94a3b8" strokeDasharray="3 3" strokeOpacity="0.3" />

                {/* Shaded Area under Curve */}
                <polygon points={areaPointsString} fill="url(#hrGradient)" />

                {/* Main Heart Rate Line */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />

                {/* Live Current Point Dot */}
                <circle cx={lastX} cy={lastY} r="6" fill="#ef4444" className="animate-pulse" />
                <circle cx={lastX} cy={lastY} r="10" fill="#ef4444" fillOpacity="0.3" className="animate-ping" />
              </svg>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-700 dark:text-slate-400 font-semibold mt-2 px-1">
                <span>10 updates ago</span>
                <span>5 updates ago</span>
                <span className="font-bold text-red-600 dark:text-red-400">Live: {isDeviceConnected ? `${liveMetrics?.heartRate} BPM` : '--'}</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. HOURLY STEPS BAR GRAPH */}
        {activeGraphTab === 'steps' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-800 dark:text-slate-300 font-bold">
                WALKING & MOVING THROUGHOUT THE DAY:
              </span>
              <span className="text-cyan-700 dark:text-neon-cyan font-bold">
                Total Today: {currentSteps.toLocaleString()} steps
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-cyber-dark/80 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-cyber-border">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 h-44 sm:h-52 items-end pt-4 pb-2">
                {hourlySteps.map((h, i) => {
                  const heightPercent = Math.max(12, Math.round((h.steps / maxHourlySteps) * 100));
                  return (
                    <div key={i} className="flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 mb-1 opacity-0 group-hover:opacity-100 transition">
                        {h.steps}
                      </span>
                      <div className="w-full max-w-[40px] bg-slate-200 dark:bg-slate-800 rounded-t-lg overflow-hidden flex items-end h-full">
                        <div
                          className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 mt-2 font-semibold">
                        {h.hour}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. CALORIES BURNED GRAPH */}
        {activeGraphTab === 'calories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-800 dark:text-slate-300 font-bold">
                CALORIE BURN PROGRESSION:
              </span>
              <span className="text-amber-700 dark:text-yellow-400 font-bold">
                Burned: {liveMetrics?.activeCalories || 0} kcal
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-cyber-dark/80 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-cyber-border">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 block font-semibold">Morning Burn</span>
                  <strong className="font-cyber text-base text-slate-900 dark:text-slate-200">
                    {Math.round((liveMetrics?.activeCalories || 100) * 0.35)} kcal
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 block font-semibold">Afternoon Burn</span>
                  <strong className="font-cyber text-base text-slate-900 dark:text-slate-200">
                    {Math.round((liveMetrics?.activeCalories || 100) * 0.45)} kcal
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 block font-semibold">Evening Burn</span>
                  <strong className="font-cyber text-base text-slate-900 dark:text-slate-200">
                    {Math.round((liveMetrics?.activeCalories || 100) * 0.2)} kcal
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/40 text-center">
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 block font-semibold">Total Active</span>
                  <strong className="font-cyber text-base text-amber-700 dark:text-yellow-400">
                    {liveMetrics?.activeCalories || 0} kcal
                  </strong>
                </div>
              </div>

              <div className="h-32 flex items-end gap-2 pt-2">
                {[20, 35, 45, 60, 75, 90, 100].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-amber-600 to-yellow-400 transition-all duration-500"
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[9px] font-mono text-slate-700 dark:text-slate-400 mt-1 font-semibold">
                      {idx * 2 + 8}:00
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WEEKLY CONSISTENCY TRACKER */}
        <div className="pt-2 border-t border-slate-200 dark:border-cyber-border/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300 uppercase">
              WEEKLY ACTIVITY & HABIT TRACKER
            </span>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-neon-green font-bold">
              6 of 7 Days Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {weeklyDays.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center transition ${
                  item.isToday
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-sm'
                    : item.completed
                    ? 'bg-slate-50 dark:bg-cyber-dark/60 border-slate-200 dark:border-cyber-border'
                    : 'bg-slate-50 dark:bg-cyber-dark/30 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  {item.completed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-neon-green" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <p className="font-cyber text-xs font-bold text-slate-900 dark:text-white">
                  {item.day}
                </p>
                <p className="text-[10px] font-mono text-slate-700 dark:text-slate-400 mt-0.5 font-semibold">
                  {item.cals} kcal
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
