import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Flame,
  Utensils,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Info,
} from 'lucide-react';
import { nutritionApi } from '../api/axiosClient';

export const FoodTrackerModal = ({ isOpen, onClose, onMealLogged }) => {
  const [mode, setMode] = useState('text'); // 'text' | 'photo'
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMimeType, setImageMimeType] = useState('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image file size should be less than 8MB.');
      return;
    }

    setError('');
    setImageMimeType(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'text' && !description.trim()) {
      setError('Please type a description of what you ate.');
      return;
    }

    if (mode === 'photo' && !imageBase64 && !description.trim()) {
      setError('Please choose or take a photo of your food.');
      return;
    }

    setLoading(true);

    try {
      const response = await nutritionApi.analyzeFood({
        description: description.trim(),
        imageBase64: imageBase64 || null,
        mimeType: imageMimeType,
      });

      if (response.data?.success && response.data?.analysis) {
        setResult(response.data.analysis);
      } else {
        throw new Error(response.data?.message || 'Could not analyze food item');
      }
    } catch (err) {
      console.error('Food analysis error:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to estimate calories. Please try again with simple details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = () => {
    if (result && onMealLogged) {
      onMealLogged(result);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg cyber-card rounded-2xl p-6 relative overflow-hidden border border-neon-cyan/40 shadow-neon-cyan max-h-[92vh] flex flex-col">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-green/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyber-border mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cyber text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                SMART FOOD & CALORIE ESTIMATOR
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-400 font-mono font-semibold">
                AI analyzes your meal photo or description
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

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-600 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!result ? (
            <form onSubmit={handleAnalyze} className="space-y-4">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-cyber-dark rounded-xl border border-slate-300 dark:border-cyber-border">
                <button
                  type="button"
                  onClick={() => setMode('text')}
                  className={`py-2 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'text'
                      ? 'bg-white dark:bg-neon-cyan/20 border border-cyan-500 text-cyan-800 dark:text-neon-cyan font-bold shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Type Food Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('photo')}
                  className={`py-2 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'photo'
                      ? 'bg-white dark:bg-neon-cyan/20 border border-cyan-500 text-cyan-800 dark:text-neon-cyan font-bold shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Food Photo</span>
                </button>
              </div>

              {/* Photo Mode */}
              {mode === 'photo' && (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 rounded-xl p-4 text-center cursor-pointer transition bg-slate-50 dark:bg-cyber-dark/50 group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Food Preview"
                          className="max-h-48 rounded-lg mx-auto object-cover border border-slate-400"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearImage();
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-4 space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-400 group-hover:text-cyan-600 transition">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-slate-900 dark:text-white font-bold">
                          Click to upload or take a photo of your plate
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                          PNG, JPG, or WEBP (up to 8MB)
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-800 dark:text-slate-400 mb-1 font-bold">
                      OPTIONAL: ADD QUICK NOTES (e.g. "cooked in olive oil, no sauce")
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. 1 medium chicken breast with white rice"
                      className="w-full bg-white dark:bg-cyber-dark border border-slate-300 dark:border-cyber-border rounded-lg px-3 py-2 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Text Mode */}
              {mode === 'text' && (
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-800 dark:text-slate-400 font-bold">
                    DESCRIBE WHAT YOU ATE OR PLAN TO EAT:
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Examples:&#10;• 2 boiled eggs with 1 slice whole wheat bread and black coffee&#10;• A bowl of chicken fried rice with salad&#10;• 1 medium banana and a protein shake"
                    className="w-full bg-white dark:bg-cyber-dark border border-slate-300 dark:border-cyber-border rounded-xl p-3 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 leading-relaxed font-medium"
                  />
                  <p className="text-[11px] text-slate-700 dark:text-slate-400 flex items-center gap-1 font-semibold">
                    <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                    You can type naturally! The AI estimates calories and all macros.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl cyber-button-cyan text-xs font-mono flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI IS ANALYZING NUTRITION...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>ESTIMATE CALORIES & MACROS</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Analysis Result Card */
            <div className="space-y-4 animate-fadeIn">
              {/* Header result */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-cyber-dark border border-cyan-500/40 flex items-start justify-between shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-800 dark:text-neon-cyan font-bold border border-cyan-500/30">
                    {result.healthRating || 'Healthy Fuel'}
                  </span>
                  <h3 className="font-cyber text-lg font-bold text-slate-900 dark:text-white mt-1.5">
                    {result.foodName}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-400 font-mono mt-0.5 font-medium">
                    Portion: {result.portionEstimate}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-amber-600 dark:text-neon-orange font-cyber font-bold text-2xl">
                    <Flame className="w-5 h-5 text-amber-500" />
                    <span>{result.calories}</span>
                  </div>
                  <span className="text-[10px] text-slate-700 dark:text-slate-400 font-mono uppercase font-bold">
                    TOTAL CALORIES
                  </span>
                </div>
              </div>

              {/* 4 Macros Cards */}
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-center shadow-sm">
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 uppercase font-mono font-bold">PROTEIN</p>
                  <p className="font-cyber font-bold text-emerald-700 dark:text-neon-green text-base mt-0.5">
                    {result.proteinGrams}g
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-center shadow-sm">
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 uppercase font-mono font-bold">CARBS</p>
                  <p className="font-cyber font-bold text-cyan-700 dark:text-neon-cyan text-base mt-0.5">
                    {result.carbsGrams}g
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-center shadow-sm">
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 uppercase font-mono font-bold">FATS</p>
                  <p className="font-cyber font-bold text-amber-700 dark:text-yellow-400 text-base mt-0.5">
                    {result.fatsGrams}g
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/40 text-center shadow-sm">
                  <p className="text-[10px] text-slate-700 dark:text-slate-400 uppercase font-mono font-bold">FIBER</p>
                  <p className="font-cyber font-bold text-purple-700 dark:text-purple-400 text-base mt-0.5">
                    {result.fiberGrams || 0}g
                  </p>
                </div>
              </div>

              {/* Simple Summary */}
              {result.simpleSummary && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-cyber-border">
                  <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-medium">
                    💡 {result.simpleSummary}
                  </p>
                </div>
              )}

              {/* Coach Tips */}
              {Array.isArray(result.coachTips) && result.coachTips.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-mono text-slate-800 dark:text-slate-400 uppercase font-bold">
                    Coach Tips:
                  </p>
                  {result.coachTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-slate-800 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-cyber-dark/40 p-2 rounded-lg border border-slate-200 dark:border-slate-800 font-medium"
                    >
                      <span className="text-cyan-700 dark:text-neon-cyan shrink-0 font-bold">✔</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Result Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-cyber-border">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-cyber-dark border border-slate-300 dark:border-cyber-border text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono font-bold transition"
                >
                  Estimate Another
                </button>
                <button
                  type="button"
                  onClick={handleSaveMeal}
                  className="py-2.5 px-3 rounded-xl cyber-button-green text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition shadow-md"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Log This Meal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
