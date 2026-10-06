import React from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  Activity,
  Dumbbell,
  Utensils,
  HeartHandshake,
  UserCheck,
  Watch,
  LogOut,
  X,
  Bluetooth,
} from 'lucide-react';

export const Sidebar = ({
  activeSection,
  onSelectSection,
  isOpen,
  onClose,
  onOpenProfileModal,
  onOpenPairingModal,
}) => {
  const { isDeviceConnected, connectionType, connectedDeviceDetails, disconnectDevice } = useSocket();
  const { user, logout } = useAuth();

  const NAV_ITEMS = [
    { id: 'overview', label: 'Live Dashboard', desc: 'Live Numbers & Graphs', icon: Activity },
    { id: 'workout', label: 'Workouts & Splits', desc: '7-Day Plan & Moves', icon: Dumbbell },
    { id: 'nutrition', label: 'Healthy Meals', desc: 'Recipes & Food Tracker', icon: Utensils },
    { id: 'chat', label: 'Coach Maya Support', desc: 'Encouragement & Chat', icon: HeartHandshake },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-[#090d18] border-r border-slate-200 dark:border-cyber-border flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-cyber-border">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-neon-green/10 border border-emerald-500/40 text-emerald-600 dark:text-neon-green flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="font-cyber text-lg font-bold tracking-wider text-slate-900 dark:text-white">
                  FIT<span className="text-emerald-600 dark:text-neon-green">ADAPT</span>
                </span>
                <span className="block text-[9px] font-mono text-cyan-600 dark:text-neon-cyan tracking-widest">
                  AI EXPERIENCES
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Quick Info */}
          {user && (
            <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-border flex items-center justify-between">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-neon-cyan flex items-center justify-center font-cyber font-bold text-xs shrink-0">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <span className="font-cyber text-xs font-bold text-slate-900 dark:text-white block truncate">
                    {user.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-neon-green uppercase font-semibold">
                    {user.fitnessLevel}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onOpenProfileModal();
                  if (onClose) onClose();
                }}
                className="p-1 rounded text-slate-400 hover:text-cyan-500 text-xs font-mono"
                title="Edit Profile"
              >
                <UserCheck className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5 mt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 dark:bg-neon-green/15 text-emerald-700 dark:text-neon-green font-bold border border-emerald-500/40 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-cyber-dark/60 hover:text-slate-900 dark:hover:text-white border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-emerald-600 dark:text-neon-green' : 'text-slate-400'
                    }`}
                  />
                  <div className="flex-1">
                    <span className="font-cyber text-xs block text-slate-900 dark:text-white font-bold">{item.label}</span>
                    <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 block -mt-0.5 font-medium">
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Preferences & Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-cyber-border space-y-2 bg-slate-50/50 dark:bg-cyber-dark/30">
          {/* Smartwatch Connection / Bluetooth Trigger */}
          <button
            onClick={() => {
              if (isDeviceConnected) {
                disconnectDevice();
              } else if (onOpenPairingModal) {
                onOpenPairingModal();
              }
              if (onClose) onClose();
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-mono border transition ${
              isDeviceConnected
                ? 'bg-emerald-500/10 text-emerald-800 dark:text-neon-green border-emerald-500/30'
                : 'bg-slate-100 dark:bg-cyber-dark text-slate-800 dark:text-slate-300 border-slate-300 dark:border-cyber-border hover:border-cyan-500'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {connectionType === 'bluetooth' ? (
                <Bluetooth className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-500" />
              ) : (
                <Watch className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              )}
              <span className="truncate max-w-[130px] font-semibold">
                {isDeviceConnected
                  ? connectionType === 'bluetooth'
                    ? 'Real BLE Band'
                    : 'Virtual Band'
                  : 'Link Smartband'}
              </span>
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                isDeviceConnected
                  ? 'bg-emerald-600 text-white'
                  : 'bg-cyan-500/20 text-cyan-800 dark:text-neon-cyan border border-cyan-500/30'
              }`}
            >
              {isDeviceConnected ? 'ON' : 'PAIR'}
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 p-2 rounded-xl text-xs font-mono text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
