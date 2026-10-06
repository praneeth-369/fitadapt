import React, { useState } from 'react';
import {
  Utensils,
  Droplets,
  CheckCircle,
  ArrowRightLeft,
  Sparkles,
  X,
  Camera,
  Flame,
  Clock,
  ChevronDown,
  ChevronUp,
  PlusCircle,
} from 'lucide-react';

export const NutritionCard = ({
  nutritionData,
  onOpenFoodTracker,
  loggedMeals = [],
}) => {
  const [expandedRecipe, setExpandedRecipe] = useState(0);

  // Targets from AI or defaults
  const dailyTarget = nutritionData?.dailyTarget || {
    totalCalories: 2100,
    proteinGrams: 140,
    carbsGrams: 220,
    fatsGrams: 60,
    fiberGrams: 30,
  };

  const sampleRecipes = nutritionData?.sampleRecipes || [
    {
      mealType: 'Power Breakfast',
      title: 'Warm Cinnamon Banana Oatmeal with Protein',
      prepTimeMinutes: 8,
      calories: 420,
      proteinGrams: 28,
      carbsGrams: 56,
      fatsGrams: 8,
      fiberGrams: 7,
      ingredients: [
        '1/2 cup rolled oats',
        '1 cup water or milk',
        '1 scoop protein powder (or 3 egg whites on the side)',
        '1 sliced banana',
        'Pinch of cinnamon and a teaspoon of honey',
      ],
      howToCook: [
        'Cook the oats in water or milk in a small pot for 4-5 minutes until warm and creamy.',
        'Remove from heat, let cool slightly, and stir in your protein powder smoothly.',
        'Top with sliced banana, a dash of cinnamon, and honey. Enjoy warm!',
      ],
    },
    {
      mealType: 'Post-Workout Lunch',
      title: 'Easy Pan-Seared Chicken & Fluffy Rice Bowl',
      prepTimeMinutes: 15,
      calories: 550,
      proteinGrams: 44,
      carbsGrams: 65,
      fatsGrams: 12,
      fiberGrams: 6,
      ingredients: [
        '150g chicken breast cut into bite-sized cubes (or firm tofu)',
        '1 cup cooked white or brown rice',
        '1 cup steamed broccoli or green beans',
        '1 teaspoon olive oil',
        'Pinch of salt, garlic powder, and a dash of low-sodium soy sauce',
      ],
      howToCook: [
        'Heat olive oil in a non-stick pan over medium heat.',
        'Add chicken cubes, season with salt and garlic powder, and cook for 6-8 minutes until golden.',
        'Spoon warm rice into a bowl, top with cooked chicken and steamed veggies, and drizzle with soy sauce.',
      ],
    },
    {
      mealType: 'Restorative Dinner',
      title: '10-Minute Baked Salmon with Sweet Potato Mash',
      prepTimeMinutes: 18,
      calories: 510,
      proteinGrams: 38,
      carbsGrams: 48,
      fatsGrams: 16,
      fiberGrams: 7,
      ingredients: [
        '1 fresh salmon fillet (about 140g)',
        '1 medium sweet potato (pierced with a fork)',
        '1 handful baby spinach',
        '1 teaspoon olive oil and a squeeze of fresh lemon',
      ],
      howToCook: [
        'Microwave or bake the sweet potato until soft (about 5 mins in microwave), then mash with a pinch of salt.',
        'Pan-fry or bake salmon in an oven at 200°C (400°F) for 10-12 minutes until flaky.',
        'Serve salmon over mashed sweet potato with a side of fresh lemon spinach.',
      ],
    },
  ];

  const hydration = nutritionData?.hydration || {
    waterIntakeLiters: 2.8,
    simpleTip: 'Keep a water bottle near you and drink a glass of water every 2 hours.',
  };

  const coachTips = nutritionData?.coachTips || [
    'Eat a palm-sized portion of protein with each main meal to help your muscles recover.',
    'Drink a big glass of water right when you wake up.',
  ];

  return (
    <div className="cyber-card-cyan rounded-2xl p-4 sm:p-6 space-y-6 transition-all duration-300">
      {/* Header with Food Tracker Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-cyber-border gap-3">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-neon-cyan border border-cyan-500/30">
            NUTRITION & MACROS
          </span>
          <h2 className="font-cyber text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-cyan-600 dark:text-neon-cyan" />
            Daily Nutrition & Sample Recipes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Balanced calories and clean fuel for energy and recovery
          </p>
        </div>

        {/* AI Food Tracker Button */}
        <button
          onClick={onOpenFoodTracker}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-neon-cyan/15 hover:bg-neon-cyan/25 border border-neon-cyan text-cyan-800 dark:text-neon-cyan text-xs font-mono font-bold shadow-neon-cyan transition self-start sm:self-auto"
        >
          <Camera className="w-4 h-4" />
          <span>Estimate Food (AI Photo / Text)</span>
        </button>
      </div>

      {/* DAILY TARGET MACROS SUMMARY */}
      <div className="bg-slate-50 dark:bg-cyber-dark/90 border border-slate-300 dark:border-cyber-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-300">
            TODAY'S DAILY TARGETS
          </span>
          <div className="flex items-center gap-1 text-amber-600 dark:text-neon-orange font-cyber font-bold text-base">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>{dailyTarget.totalCalories} KCAL</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div className="bg-white dark:bg-cyber-black p-2.5 rounded-xl border border-emerald-500/40 shadow-sm">
            <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-bold block">
              PROTEIN (BUILD)
            </span>
            <strong className="font-cyber text-lg text-emerald-700 dark:text-neon-green">
              {dailyTarget.proteinGrams}g
            </strong>
          </div>
          <div className="bg-white dark:bg-cyber-black p-2.5 rounded-xl border border-cyan-500/40 shadow-sm">
            <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-bold block">
              CARBS (ENERGY)
            </span>
            <strong className="font-cyber text-lg text-cyan-700 dark:text-neon-cyan">
              {dailyTarget.carbsGrams}g
            </strong>
          </div>
          <div className="bg-white dark:bg-cyber-black p-2.5 rounded-xl border border-yellow-500/40 shadow-sm">
            <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-bold block">
              FATS (HEALTH)
            </span>
            <strong className="font-cyber text-lg text-yellow-700 dark:text-yellow-400">
              {dailyTarget.fatsGrams}g
            </strong>
          </div>
          <div className="bg-white dark:bg-cyber-black p-2.5 rounded-xl border border-purple-500/40 shadow-sm">
            <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-bold block">
              FIBER (DIGESTION)
            </span>
            <strong className="font-cyber text-lg text-purple-700 dark:text-purple-400">
              {dailyTarget.fiberGrams || 30}g
            </strong>
          </div>
        </div>
      </div>

      {/* RECENTLY LOGGED MEALS (IF ANY) */}
      {loggedMeals && loggedMeals.length > 0 && (
        <div className="p-4 rounded-xl bg-neon-green/5 border border-neon-green/30 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase text-emerald-700 dark:text-neon-green flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>MEALS LOGGED TODAY ({loggedMeals.length})</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-400 font-bold">
              {loggedMeals.reduce((acc, m) => acc + (m.calories || 0), 0)} kcal tracked
            </span>
          </div>

          <div className="space-y-2">
            {loggedMeals.map((meal, mIdx) => (
              <div
                key={mIdx}
                className="bg-white dark:bg-cyber-dark/80 p-2.5 rounded-lg border border-slate-200 dark:border-cyber-border flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{meal.foodName}</p>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    {meal.portionEstimate} • {meal.healthRating || 'Healthy'}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-amber-600 dark:text-neon-orange">{meal.calories} kcal</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                    P: {meal.proteinGrams}g | C: {meal.carbsGrams}g | F: {meal.fatsGrams}g
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAMPLE RECIPES ACCORDION */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-cyber text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 font-bold">
            <Utensils className="w-4 h-4 text-cyan-700 dark:text-neon-cyan" />
            SIMPLE SAMPLE RECIPES (EASY TO MAKE)
          </h3>
          <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-medium">
            Quick ingredients & step-by-step
          </span>
        </div>

        <div className="space-y-3">
          {sampleRecipes.map((recipe, rIdx) => {
            const isOpen = expandedRecipe === rIdx;
            return (
              <div
                key={rIdx}
                className="bg-white dark:bg-cyber-dark/80 border border-slate-200 dark:border-cyber-border rounded-xl overflow-hidden transition shadow-sm"
              >
                {/* Recipe Header Button */}
                <button
                  type="button"
                  onClick={() => setExpandedRecipe(isOpen ? -1 : rIdx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-neon-cyan font-bold border border-cyan-500/20">
                        {recipe.mealType || 'Meal'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTimeMinutes || 10} mins
                      </span>
                    </div>
                    <h4 className="font-cyber text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
                      {recipe.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-cyber text-base font-bold text-cyan-700 dark:text-neon-cyan">
                        {recipe.calories} kcal
                      </span>
                      <p className="text-[10px] font-mono text-slate-700 dark:text-slate-400 font-medium hidden sm:block">
                        P: {recipe.proteinGrams}g | C: {recipe.carbsGrams}g | F: {recipe.fatsGrams}g
                      </p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-700 dark:text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-700 dark:text-slate-400" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isOpen && (
                  <div className="p-4 border-t border-slate-200 dark:border-cyber-border bg-slate-50/50 dark:bg-cyber-black/50 space-y-3.5 text-xs animate-fadeIn">
                    {/* Full Macros Bar */}
                    <div className="grid grid-cols-4 gap-2 text-center p-2 rounded-lg bg-white dark:bg-cyber-dark border border-slate-200 dark:border-cyber-border font-mono">
                      <div>
                        <span className="text-[9px] text-slate-700 dark:text-slate-400 uppercase font-bold">Protein</span>
                        <p className="font-bold text-emerald-700 dark:text-neon-green">{recipe.proteinGrams}g</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-700 dark:text-slate-400 uppercase font-bold">Carbs</span>
                        <p className="font-bold text-cyan-700 dark:text-neon-cyan">{recipe.carbsGrams}g</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-700 dark:text-slate-400 uppercase font-bold">Fats</span>
                        <p className="font-bold text-amber-700 dark:text-yellow-500">{recipe.fatsGrams}g</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-700 dark:text-slate-400 uppercase font-bold">Fiber</span>
                        <p className="font-bold text-purple-700 dark:text-purple-400">{recipe.fiberGrams || 5}g</p>
                      </div>
                    </div>

                    {/* Ingredients */}
                    {Array.isArray(recipe.ingredients) && (
                      <div>
                        <span className="text-[11px] font-mono uppercase text-slate-800 dark:text-slate-300 font-bold block mb-1.5">
                          Ingredients You Need:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {recipe.ingredients.map((ing, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-mono bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-md font-medium"
                            >
                              • {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Simple Step-by-Step Cooking */}
                    {Array.isArray(recipe.howToCook) && (
                      <div className="p-3 rounded-xl bg-white dark:bg-cyber-dark border border-slate-200 dark:border-cyber-border space-y-1.5">
                        <span className="text-[11px] font-mono uppercase text-slate-800 dark:text-slate-300 font-bold block">
                          How to Prepare:
                        </span>
                        {recipe.howToCook.map((step, stpIdx) => (
                          <div key={stpIdx} className="flex items-start gap-2 text-slate-800 dark:text-slate-300 font-medium leading-relaxed">
                            <span className="font-mono font-bold text-cyan-700 dark:text-neon-cyan shrink-0">
                              {stpIdx + 1}.
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Water & Hydration */}
      <div className="bg-slate-50 dark:bg-cyber-dark/60 border border-slate-200 dark:border-cyber-border rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-700 dark:text-neon-cyan shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-cyber font-bold text-slate-900 dark:text-white uppercase">
              DAILY WATER INTAKE
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Drink at least <strong className="text-cyan-700 dark:text-neon-cyan font-bold">{hydration.waterIntakeLiters} Liters</strong> throughout today
            </p>
            {hydration.simpleTip && (
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                💡 {hydration.simpleTip}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Friendly Tips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-slate-800 dark:text-slate-300 font-bold block mb-1">
          HEALTHY EATING TIPS:
        </span>
        {coachTips.map((tip, idx) => (
          <div
            key={idx}
            className="text-xs text-slate-800 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-cyber-dark/40 p-2 rounded-lg border border-slate-200 dark:border-cyber-border font-medium"
          >
            <CheckCircle className="w-3.5 h-3.5 text-cyan-700 dark:text-neon-cyan shrink-0 mt-0.5" />
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
