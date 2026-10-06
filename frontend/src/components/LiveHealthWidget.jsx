import React from 'react';
import { useSocket } from '../context/SocketContext';
import {
  Heart,
  Flame,
  Footprints,
  Activity,
  Radio,
  Zap,
  Watch,
  Power,
  PowerOff,
  Bluetooth,
  Battery,
} from 'lucide-react';

export const LiveHealthWidget = ({ onOpenPairingModal }) => {
  const {
    liveMetrics,
    isDeviceConnected,
    connectionType,
    connectedDeviceDetails,
    disconnectDevice,
    hrHistory,
    triggerActivitySurge,
  } = useSocket();

  const getHeartRateZone = (hr) => {
    if (!hr) return { label: 'No Signal', color: 'text-slate-400', border: 'border-slate-500' };
    if (hr < 80) return { label: 'Relaxed / Resting', color: 'text-neon-cyan', border: 'border-neon-cyan/40' };
    if (hr < 100) return { label: 'Fat Burning Pace', color: 'text-neon-green', border: 'border-neon-green/40' };
    if (hr < 115) return { label: 'Cardio Workout Pace', color: 'text-yellow-400', border: 'border-yellow-400/40' };
    return { label: 'Peak Sprint Pace', color: 'text-pink-500', border: 'border-pink-500/40' };
  };

  const zone = getHeartRateZone(liveMetrics?.heartRate);
  const stepGoal = 10000;
  const stepPercentage = liveMetrics?.steps ? Math.min(100, Math.round((liveMetrics.steps / stepGoal) * 100)) : 0;

  return (
    <div className="w-full cyber-card rounded-2xl p-4 sm:p-6 relative overflow-hidden transition-all duration-300">
      {/* Glow Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 dark:bg-neon-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 dark:border-cyber-border mb-4 gap-2">
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition ${
              isDeviceConnected
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-neon-green shadow-neon-green'
                : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
            }`}
          >
            {isDeviceConnected ? (
              connectionType === 'bluetooth' ? (
                <Bluetooth className="w-4 h-4 text-cyan-500 animate-pulse" />
              ) : (
                <Activity className="w-4 h-4 animate-pulse" />
              )
            ) : (
              <Watch className="w-4 h-4" />
            )}
          </div>
          <div>
            <h3 className="font-cyber text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
              LIVE WEARABLE TELEMETRY
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isDeviceConnected
                    ? connectionType === 'bluetooth'
                      ? 'bg-cyan-500/15 text-cyan-700 dark:text-neon-cyan border-cyan-500/40'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-neon-green border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                }`}
              >
                {isDeviceConnected
                  ? connectionType === 'bluetooth'
                    ? 'REAL BLUETOOTH BLE'
                    : 'DEVICE PAIRED'
                  : 'DISCONNECTED'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {isDeviceConnected
                ? `Device: ${connectedDeviceDetails.name || liveMetrics.deviceId}`
                : 'No smartwatch connected'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {isDeviceConnected ? (
            <>
              {connectedDeviceDetails.battery !== null && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-cyber-dark text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-cyber-border">
                  <Battery className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{connectedDeviceDetails.battery}%</span>
                </div>
              )}

              <button
                onClick={triggerActivitySurge}
                title="Simulate quick sprint surge"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-500/10 dark:bg-cyber-card border border-emerald-500/30 text-emerald-600 dark:text-neon-green hover:border-emerald-500 transition"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Boost HR</span>
              </button>

              <button
                onClick={disconnectDevice}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-mono bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition"
              >
                <PowerOff className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenPairingModal}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-mono cyber-button-green transition shadow-sm"
            >
              <Bluetooth className="w-3.5 h-3.5" />
              <span>Link Fitness Band</span>
            </button>
          )}
        </div>
      </div>

      {/* DISCONNECTED STATE */}
      {!isDeviceConnected ? (
        <div className="p-8 rounded-xl border-2 border-dashed border-slate-300 dark:border-cyber-border/80 bg-slate-50/50 dark:bg-cyber-dark/40 text-center my-2 transition">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-200 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
            <Bluetooth className="w-7 h-7" />
          </div>
          <h4 className="font-cyber text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            No Wearable Device Connected
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Link your real physical Bluetooth fitness band (Apple Watch, Polar, Garmin, Whoop, etc.) or connect the virtual band to start live tracking.
          </p>

          <button
            onClick={onOpenPairingModal}
            className="px-5 py-2.5 rounded-xl cyber-button-green text-xs font-mono inline-flex items-center gap-2 shadow-neon-green"
          >
            <Bluetooth className="w-4 h-4" />
            <span>Pair Bluetooth Fitness Band</span>
          </button>

          {/* Blank Telemetry placeholders */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-cyber-border/40 opacity-40">
            <div className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700">
              <span className="text-[10px] font-mono text-slate-400 block">HEART RATE</span>
              <span className="font-cyber text-xl font-bold text-slate-400">-- BPM</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700">
              <span className="text-[10px] font-mono text-slate-400 block">STEPS</span>
              <span className="font-cyber text-xl font-bold text-slate-400">--</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700">
              <span className="text-[10px] font-mono text-slate-400 block">CALORIES</span>
              <span className="font-cyber text-xl font-bold text-slate-400">-- KCAL</span>
            </div>
          </div>
        </div>
      ) : (
        /* CONNECTED TELEMETRY STREAM */
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {/* Heart Rate */}
            <div className="bg-white dark:bg-cyber-dark/80 border border-slate-200 dark:border-cyber-border hover:border-emerald-500/40 rounded-xl p-3.5 relative overflow-hidden transition shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                  HEART RATE
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${zone.border} ${zone.color}`}>
                  {zone.label}
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="font-cyber text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {liveMetrics.heartRate}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">BPM</span>
              </div>

              <div className="mt-3 flex items-end space-x-1 h-6">
                {hrHistory.map((val, idx) => {
                  const heightPct = Math.max(20, Math.min(100, ((val - 60) / 65) * 100));
                  return (
                    <div
                      key={idx}
                      className="flex-1 rounded-t bg-gradient-to-t from-red-500/20 to-emerald-500 dark:to-neon-green transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white dark:bg-cyber-dark/80 border border-slate-200 dark:border-cyber-border hover:border-cyan-500/40 rounded-xl p-3.5 relative overflow-hidden transition shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                  DAILY STEPS
                </span>
                <span className="text-[10px] font-mono text-cyan-600 dark:text-neon-cyan font-bold">
                  {stepPercentage}% OF 10,000
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="font-cyber text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {liveMetrics.steps?.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">STEPS</span>
              </div>

              <div className="mt-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-neon-cyan h-full rounded-full transition-all duration-500"
                  style={{ width: `${stepPercentage}%` }}
                />
              </div>
            </div>

            {/* Calories */}
            <div className="bg-white dark:bg-cyber-dark/80 border border-slate-200 dark:border-cyber-border hover:border-yellow-400/40 rounded-xl p-3.5 relative overflow-hidden transition shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  BURNED CALORIES
                </span>
                <span className="text-[10px] font-mono text-yellow-600 dark:text-yellow-400 font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="font-cyber text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {liveMetrics.activeCalories}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">KCAL</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>Oxygen: <strong className="text-cyan-600 dark:text-neon-cyan">{liveMetrics.spo2 || 98}%</strong></span>
                <span>Signal: <strong className="text-emerald-600 dark:text-neon-green">Strong BLE Link</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-cyber-border/60">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-500 dark:text-neon-green animate-pulse" />
              {connectionType === 'bluetooth'
                ? `Physical Band Streaming Real Heart Rate (${connectedDeviceDetails.name})`
                : 'Virtual Telemetry Stream Synced Every 4 Seconds'}
            </span>
            <span>
              Updated: {liveMetrics.timestamp ? new Date(liveMetrics.timestamp).toLocaleTimeString() : 'Now'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
