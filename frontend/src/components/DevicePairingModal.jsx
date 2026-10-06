import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import {
  Watch,
  Bluetooth,
  Radio,
  Battery,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Zap,
  Info,
} from 'lucide-react';

export const DevicePairingModal = ({ isOpen, onClose }) => {
  const {
    isDeviceConnected,
    connectionType,
    connectedDeviceDetails,
    isBluetoothSupported,
    isBluetoothConnecting,
    bluetoothError,
    connectRealBluetoothDevice,
    connectVirtualDevice,
    disconnectDevice,
  } = useSocket();

  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const handleConnectRealBLE = async () => {
    setLocalError('');
    try {
      await connectRealBluetoothDevice();
      onClose();
    } catch (err) {
      if (err.name !== 'NotFoundError') {
        setLocalError(err.message || 'Failed to connect via Bluetooth');
      }
    }
  };

  const handleConnectVirtual = () => {
    connectVirtualDevice();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md cyber-card rounded-2xl p-6 border border-emerald-500/40 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-cyber-border mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-600 dark:text-neon-cyan flex items-center justify-center">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cyber font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                FITNESS BAND LINK
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-400 font-mono font-semibold">
                Pair Physical or Virtual Smartwatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currently Connected Info (if active) */}
        {isDeviceConnected && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-neon-green flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <strong className="font-cyber text-xs text-slate-900 dark:text-white block">
                  {connectedDeviceDetails.name || 'Connected Band'}
                </strong>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-neon-green font-bold">
                  {connectedDeviceDetails.isRealBluetooth
                    ? 'REAL BLUETOOTH BLE ACTIVE'
                    : 'VIRTUAL TELEMETRY STREAM ACTIVE'}
                </span>
              </div>
            </div>

            <button
              onClick={disconnectDevice}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-red-500/10 text-red-600 border border-red-500/30 hover:bg-red-500/20 font-bold"
            >
              Unpair
            </button>
          </div>
        )}

        {(localError || bluetoothError) && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-mono flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{localError || bluetoothError}</span>
          </div>
        )}

        {/* Pairing Option 1: Real Physical Bluetooth Device */}
        <div className="space-y-3 mb-4">
          <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-500/5 hover:border-cyan-500 transition shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Bluetooth className="w-4 h-4 text-cyan-700 dark:text-neon-cyan" />
                <h4 className="font-cyber font-bold text-sm text-slate-900 dark:text-white">
                  Physical Bluetooth Smartband
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-neon-cyan border border-cyan-500/30 font-bold">
                W3C Web BLE
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
              Scan for your real heart rate band, Apple Watch, Polar, Garmin, Whoop, or BLE fitness tracker using Web Bluetooth.
            </p>

            <button
              onClick={handleConnectRealBLE}
              disabled={isBluetoothConnecting || !isBluetoothSupported}
              className="w-full py-2.5 rounded-xl cyber-button-green text-xs font-mono flex items-center justify-center space-x-2 font-bold shadow-md disabled:opacity-50"
            >
              {isBluetoothConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning for Bluetooth Devices...</span>
                </>
              ) : (
                <>
                  <Bluetooth className="w-4 h-4" />
                  <span>Scan & Connect Real Fitness Band</span>
                </>
              )}
            </button>

            {!isBluetoothSupported && (
              <span className="text-[10px] text-amber-700 dark:text-yellow-400 font-mono block mt-2 font-semibold">
                ⚠️ Web Bluetooth requires Google Chrome or Microsoft Edge on HTTPS or localhost.
              </span>
            )}
          </div>

          {/* Pairing Option 2: Virtual CyberBand Link */}
          <div className="p-4 rounded-xl border border-slate-300 dark:border-cyber-border bg-slate-50 dark:bg-cyber-dark hover:border-slate-400 dark:hover:border-slate-600 transition shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-emerald-600 dark:text-neon-green" />
                <h4 className="font-cyber font-bold text-sm text-slate-900 dark:text-white">
                  Virtual CyberBand Simulator
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-neon-green border border-emerald-500/30 font-bold">
                Instant Demo
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 leading-relaxed font-medium">
              Don't have your physical watch nearby? Connect the virtual smartwatch link for real-time 4-second telemetry streaming.
            </p>

            <button
              onClick={handleConnectVirtual}
              className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-cyber-card border border-slate-300 dark:border-cyber-border hover:border-emerald-500 text-slate-900 dark:text-white text-xs font-mono font-bold transition flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-emerald-600 dark:text-neon-green" />
              <span>Connect Virtual CyberBand Link</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-cyber-border/70">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Both modes stream live BPM directly to FitAdapt AI.</span>
        </div>
      </div>
    </div>
  );
};
