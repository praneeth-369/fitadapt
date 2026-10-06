import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Zap,
  LogOut,
  Radio,
  UserCheck,
  Menu,
  HeartHandshake,
} from 'lucide-react';

export const Navbar = ({ onOpenProfileModal, onToggleSidebar, onOpenChat }) => {
  const { user, logout } = useAuth();
  const { isDeviceConnected } = useSocket();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#06080e]/90 backdrop-blur-md border-b border-cyber-border px-4 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Sidebar Toggle Hamburger & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 border border-cyber-border transition"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-neon-green/10 border border-neon-green/40 text-neon-green flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-cyber text-lg font-bold tracking-wider text-white">
              FIT<span className="text-neon-green">ADAPT</span>
            </span>
          </div>
        </div>

        {/* Right Side: Coach Maya Chat, Wearable Status, User */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Chat Coach Maya Button */}
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              title="Chat with Coach Maya for motivation"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-neon-green text-xs font-mono font-bold hover:bg-emerald-500/20 transition"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Coach Maya</span>
            </button>
          )}

          {/* Device Sync Pill */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
              isDeviceConnected
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-neon-green'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 font-bold'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDeviceConnected ? 'bg-emerald-500 dark:bg-neon-green animate-ping' : 'bg-slate-400'
              }`}
            />
            <Radio className="w-3 h-3" />
            <span className="font-semibold hidden sm:inline">
              {isDeviceConnected ? 'SYNCED' : 'OFFLINE'}
            </span>
          </div>

          {/* User Profile Pill */}
          {user && (
            <button
              onClick={onOpenProfileModal}
              title="Edit Profile"
              className="flex items-center space-x-1.5 bg-slate-100 dark:bg-cyber-card border border-slate-300 dark:border-cyber-border px-2.5 py-1 rounded-xl text-xs transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
              <span className="text-slate-800 dark:text-slate-200 font-cyber font-bold uppercase hidden sm:inline">
                {user.fitnessLevel}
              </span>
            </button>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
