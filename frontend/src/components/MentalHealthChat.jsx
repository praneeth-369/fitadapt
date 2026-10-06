import React, { useState, useRef, useEffect } from 'react';
import { axiosClient } from '../api/axiosClient';
import { useSocket } from '../context/SocketContext';
import {
  HeartHandshake,
  Send,
  Sparkles,
  Smile,
  Zap,
  Coffee,
  X,
  Bot,
  User,
  RefreshCw,
} from 'lucide-react';

const QUICK_PROMPTS = [
  { label: 'Low Motivation', prompt: 'I feel really unmotivated and lazy today. What should I do?' },
  { label: 'Work Stress', prompt: 'I had a super stressful day. Help me relax and unwind.' },
  { label: 'Pre-Workout Hype', prompt: 'Give me a fast, energetic pump-up talk for my workout!' },
  { label: 'Only 10 Mins', prompt: 'I only have 10 minutes today. Is that enough to make a difference?' },
];

export const MentalHealthChat = ({ onClose }) => {
  const { liveMetrics } = useSocket();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'coach',
      text: "Hey! I'm Coach Maya, your personal wellness companion. Whether you're feeling stressed, low on motivation, or just need a friendly boost, I'm here for you. How are you feeling right now?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await axiosClient.post('/api/chat/message', {
        message: text.trim(),
        history: historyPayload,
        liveMetrics,
      });

      const coachMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: res.data?.reply || "I'm right here with you! Take a deep breath and take it one small step at a time.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error('[MentalHealthChat] Error:', err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: "I hear you! Remember that showing up is a victory in itself. Take a deep breath, drink some water, and remember you don't have to be perfect—just keep moving forward!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[560px] max-h-[85vh] w-full cyber-card rounded-2xl overflow-hidden border border-emerald-500/30 dark:border-neon-green/30 shadow-2xl transition">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-cyber-dark border-b border-slate-200 dark:border-cyber-border">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-neon-green/10 border border-emerald-500/40 text-emerald-600 dark:text-neon-green flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cyber font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
              COACH MAYA
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-neon-green animate-ping inline-block" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Mental Wellness & Daily Motivation
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-100/50 dark:bg-[#080c16]/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono ${
                  isUser
                    ? 'bg-cyan-500/20 text-cyan-700 dark:text-neon-cyan border border-cyan-500/30'
                    : 'bg-emerald-500/20 text-emerald-700 dark:text-neon-green border border-emerald-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600 text-white dark:bg-neon-cyan/20 dark:text-white border border-cyan-500/30 rounded-tr-none'
                    : 'bg-white dark:bg-cyber-dark text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-cyber-border rounded-tl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="text-[10px] opacity-60 block mt-1 text-right">
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-600 dark:text-neon-green bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30 w-max">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Coach Maya is writing helpful advice...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="p-2.5 bg-slate-50 dark:bg-cyber-dark/80 border-t border-slate-200 dark:border-cyber-border flex items-center space-x-2 overflow-x-auto no-scrollbar">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(qp.prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border text-slate-800 dark:text-slate-300 font-bold hover:border-emerald-500 dark:hover:border-neon-green hover:text-emerald-700 dark:hover:text-neon-green transition disabled:opacity-50 shadow-sm"
          >
            💬 {qp.label}
          </button>
        ))}
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-3 bg-white dark:bg-cyber-dark border-t border-slate-200 dark:border-cyber-border flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder="Ask for advice, motivation, or stress relief..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-slate-100 dark:bg-cyber-black border border-slate-300 dark:border-cyber-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-neon-green font-medium transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl cyber-button-green text-xs font-bold flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
