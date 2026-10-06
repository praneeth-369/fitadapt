import React, { useState } from 'react';
import {
  Dumbbell,
  Target,
  User,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  X,
  Flame,
  Zap,
  Heart,
  AlertTriangle,
} from 'lucide-react';

const GOALS = [
  { id: 'fat_loss', label: 'Lose Fat', desc: 'Burn calories and get lean' },
  { id: 'muscle_gain', label: 'Build Muscle', desc: 'Gain healthy muscle and shape' },
  { id: 'strength', label: 'Build Strength', desc: 'Get stronger for everyday life' },
  { id: 'endurance', label: 'Improve Stamina', desc: 'Better cardio and energy' },
  { id: 'flexibility', label: 'Stay Flexible & Pain-Free', desc: 'Healthy joints and easy movement' },
  { id: 'general_health', label: 'Stay Healthy', desc: 'Feel good and stay active' },
];

const FITNESS_LEVELS = [
  { id: 'beginner', label: 'Beginner', badge: 'New to fitness' },
  { id: 'intermediate', label: 'Intermediate', badge: 'Work out regularly' },
  { id: 'advanced', label: 'Advanced', badge: 'Experienced lifter' },
  { id: 'athlete', label: 'Athlete', badge: 'High performance' },
];

const EQUIPMENT_OPTIONS = [
  { id: 'bodyweight', label: 'No Equipment (Bodyweight)', icon: '🏃' },
  { id: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
  { id: 'barbell', label: 'Barbell & Weights', icon: '⚡' },
  { id: 'resistance_bands', label: 'Resistance Bands', icon: '➰' },
  { id: 'kettlebell', label: 'Kettlebells', icon: '🔔' },
  { id: 'full_gym', label: 'Full Gym Access', icon: '🏢' },
];

const INJURY_OPTIONS = [
  { id: 'None / Fully Healthy', label: 'No Injuries (Fully Healthy)', desc: 'Ready for all exercises' },
  { id: 'Knee Pain / Sensitive Knees', label: 'Knee Pain / Sensitivity', desc: 'We will avoid deep knee bending' },
  { id: 'Lower Back Pain', label: 'Lower Back Discomfort', desc: 'We will protect your spine' },
  { id: 'Shoulder Discomfort', label: 'Shoulder Discomfort', desc: 'Safe presses with neutral grip' },
  { id: 'Wrist Sensitivity', label: 'Wrist Sensitivity', desc: 'Neutral wrist angles and soft holds' },
  { id: 'Neck / Upper Spine Tightness', label: 'Neck / Upper Back Stiffness', desc: 'Extra mobility & gentle moves' },
];

export const OnboardingModal = ({ isOpen, onClose, initialData = null, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    height: initialData?.height || 175,
    weight: initialData?.weight || 72,
    age: initialData?.age || 26,
    gender: initialData?.gender || 'prefer_not_to_say',
    primaryGoal: initialData?.primaryGoal || 'muscle_gain',
    fitnessLevel: initialData?.fitnessLevel || 'intermediate',
    availableEquipment: initialData?.availableEquipment || ['bodyweight', 'dumbbells'],
    pastInjuries: initialData?.pastInjuries?.length ? initialData.pastInjuries : ['None / Fully Healthy'],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEquipmentToggle = (item) => {
    setFormData((prev) => {
      const exists = prev.availableEquipment.includes(item);
      const updated = exists
        ? prev.availableEquipment.filter((x) => x !== item)
        : [...prev.availableEquipment, item];
      return { ...prev, availableEquipment: updated.length ? updated : ['bodyweight'] };
    });
  };

  const handleInjuryToggle = (injuryId) => {
    setFormData((prev) => {
      let updated = [...(prev.pastInjuries || [])];

      if (injuryId === 'None / Fully Healthy') {
        return { ...prev, pastInjuries: ['None / Fully Healthy'] };
      }

      // If choosing a real injury, remove "None / Fully Healthy"
      updated = updated.filter((x) => x !== 'None / Fully Healthy');

      if (updated.includes(injuryId)) {
        updated = updated.filter((x) => x !== injuryId);
        if (updated.length === 0) {
          updated = ['None / Fully Healthy'];
        }
      } else {
        updated.push(injuryId);
      }

      return { ...prev, pastInjuries: updated };
    });
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.height || !formData.weight || !formData.age) {
        setError('Please enter your height, weight, and age.');
        return;
      }
    }
    setStep((prev) => Math.min(3, prev + 1));
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg cyber-card rounded-2xl p-6 relative overflow-hidden border border-neon-green/30 shadow-neon-green max-h-[92vh] flex flex-col">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-green/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyber-border mb-4">
          <div>
            <h2 className="font-cyber text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-neon-green" />
              SET UP YOUR PROFILE
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              STEP {step} OF 3: {step === 1 ? 'BODY DETAILS' : step === 2 ? 'GOAL & FITNESS LEVEL' : 'EQUIPMENT & INJURIES'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-gradient-to-r from-neon-green to-neon-cyan' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          {/* STEP 1: Body Metrics */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    HEIGHT (CM)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="280"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-3 py-2 text-white font-cyber text-lg focus:outline-none focus:border-neon-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    WEIGHT (KG)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-3 py-2 text-white font-cyber text-lg focus:outline-none focus:border-neon-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    AGE (YEARS)
                  </label>
                  <input
                    type="number"
                    min="12"
                    max="110"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-3 py-2 text-white font-cyber text-lg focus:outline-none focus:border-neon-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    GENDER
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    style={{ colorScheme: 'dark' }}
                    className="w-full bg-[#0d111a] border border-cyber-border rounded-lg px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-neon-green"
                  >
                    <option value="male" className="bg-[#0d111a] text-white py-1">Male</option>
                    <option value="female" className="bg-[#0d111a] text-white py-1">Female</option>
                    <option value="non-binary" className="bg-[#0d111a] text-white py-1">Non-binary</option>
                    <option value="prefer_not_to_say" className="bg-[#0d111a] text-white py-1">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* BMI Live Indicator */}
              <div className="p-3 bg-cyber-dark/60 rounded-xl border border-cyber-border flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">YOUR BMI:</span>
                <span className="font-cyber text-neon-cyan font-bold text-base">
                  {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Goals & Level */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  WHAT IS YOUR MAIN FITNESS GOAL?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map((goal) => {
                    const isSelected = formData.primaryGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, primaryGoal: goal.id })}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-neon-green/10 border-neon-green text-white shadow-neon-green'
                            : 'bg-cyber-dark/80 border-cyber-border text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="font-cyber font-bold text-xs flex items-center justify-between">
                          <span>{goal.label}</span>
                          {isSelected && <CheckCircle className="w-3.5 h-3.5 text-neon-green" />}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{goal.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  YOUR CURRENT FITNESS LEVEL
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FITNESS_LEVELS.map((lvl) => {
                    const isSelected = formData.fitnessLevel === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, fitnessLevel: lvl.id })}
                        className={`p-2 rounded-lg text-center border text-xs font-mono transition ${
                          isSelected
                            ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan font-bold shadow-neon-cyan'
                            : 'bg-cyber-dark border-cyber-border text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <div>{lvl.label}</div>
                        <span className="text-[9px] opacity-70">{lvl.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Equipment & Past Injuries */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  WHAT EQUIPMENT DO YOU HAVE? (SELECT ALL THAT APPLY)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {EQUIPMENT_OPTIONS.map((item) => {
                    const isChecked = formData.availableEquipment.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleEquipmentToggle(item.id)}
                        className={`p-2.5 rounded-xl border flex items-center space-x-2.5 transition-all text-left ${
                          isChecked
                            ? 'bg-neon-green/10 border-neon-green text-white shadow-neon-green'
                            : 'bg-cyber-dark/80 border-cyber-border text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex-1">
                          <p className="text-xs font-cyber font-bold">{item.label}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                            isChecked
                              ? 'bg-neon-green text-black border-neon-green'
                              : 'border-slate-600'
                          }`}
                        >
                          {isChecked && '✓'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PAST INJURIES / JOINT SENSITIVITIES */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5 font-bold">
                    <Shield className="w-3.5 h-3.5 text-neon-yellow" />
                    PAST INJURIES & SENSITIVE JOINTS
                  </label>
                  <span className="text-[10px] text-neon-green font-mono">COACH SAFETY CHECK</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2.5">
                  Select any areas where you have discomfort so our AI coach can choose pain-free movements for you:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INJURY_OPTIONS.map((injury) => {
                    const isChecked = (formData.pastInjuries || []).includes(injury.id);
                    return (
                      <button
                        key={injury.id}
                        type="button"
                        onClick={() => handleInjuryToggle(injury.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                          isChecked
                            ? injury.id.includes('None')
                              ? 'bg-neon-green/10 border-neon-green text-white'
                              : 'bg-neon-yellow/10 border-neon-yellow text-white shadow-sm'
                            : 'bg-cyber-dark/80 border-cyber-border text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-medium">{injury.label}</p>
                          <p className="text-[10px] text-slate-400">{injury.desc}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ml-2 shrink-0 ${
                            isChecked
                              ? injury.id.includes('None')
                                ? 'bg-neon-green text-black border-neon-green'
                                : 'bg-neon-yellow text-black border-neon-yellow'
                              : 'border-slate-600'
                          }`}
                        >
                          {isChecked && '✓'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-cyber-border mt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-border text-slate-300 hover:text-white text-xs font-mono transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg cyber-button-green text-xs font-mono transition"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg cyber-button-green text-xs font-mono transition disabled:opacity-50"
            >
              {loading ? (
                <span>SAVING PROFILE...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>SAVE & START</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
