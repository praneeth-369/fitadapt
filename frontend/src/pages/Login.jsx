import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OnboardingModal } from '../components/OnboardingModal';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Handle direct sign in
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      // Open onboarding modal to gather complete physical specs before saving
      if (!email || !password) {
        setError('Please enter your email and password.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      setIsOnboardingOpen(true);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Complete registration with biometric profile
  const handleRegisterWithProfile = async (profileData) => {
    setLoading(true);
    try {
      await register({
        email,
        password,
        ...profileData,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fast Demo Fill for Hackathon Judges
  const fillDemoCredentials = () => {
    setEmail('cyberathlete@fitadapt.ai');
    setPassword('cyberpass123');
  };

  return (
    <div className="min-h-screen bg-cyber-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-neon-green/10 border border-neon-green/50 text-neon-green shadow-neon-green mb-3">
            <Zap className="w-8 h-8 fill-neon-green" />
          </div>
          <h1 className="font-cyber text-2xl sm:text-3xl font-extrabold text-white tracking-wider">
            FIT<span className="text-neon-green">ADAPT</span>
          </h1>
          <p className="text-xs font-mono text-neon-cyan tracking-widest uppercase mt-1">
            Personalized AI Fitness Architecture
          </p>
        </div>

        {/* Auth Card */}
        <div className="cyber-card rounded-2xl p-6 sm:p-8">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-cyber-dark/80 rounded-xl border border-cyber-border mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setError('');
              }}
              className={`py-2 rounded-lg text-xs font-cyber font-bold uppercase tracking-wider transition ${
                !isRegisterMode
                  ? 'bg-neon-green/15 text-neon-green border border-neon-green/40 shadow-neon-green'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setError('');
              }}
              className={`py-2 rounded-lg text-xs font-cyber font-bold uppercase tracking-wider transition ${
                isRegisterMode
                  ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 shadow-neon-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase font-bold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="runner@fitadapt.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-neon-green transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase font-bold">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-neon-green transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl cyber-button-green text-sm flex items-center justify-center space-x-2 mt-6 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="font-mono">SIGNING IN...</span>
              ) : isRegisterMode ? (
                <>
                  <span className="font-cyber font-bold">REGISTER & CONTINUE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span className="font-cyber font-bold">SIGN IN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-4 border-t border-cyber-border/70 text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs font-mono text-neon-cyan hover:underline hover:text-neon-green transition"
            >
              ⚡ Fill Sample Hackathon Credentials
            </button>
          </div>
        </div>

        {/* Feature badge */}
        <div className="mt-6 text-center text-xs font-mono text-slate-400 flex items-center justify-center space-x-4">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-neon-green" /> 4s Telemetry Sync
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" /> Secure JWT Auth
          </span>
        </div>
      </div>

      {/* Multi-Step Onboarding Modal for Registration */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSave={handleRegisterWithProfile}
      />
    </div>
  );
};
