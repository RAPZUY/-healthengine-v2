'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  calculateBMI,
  getBMICategory,
  getWeightTargetAnalysis,
  calculateBMR,
  calculateTDEE,
  getStrategyDetails,
  getLocalDateString,
  calculateWorkoutStreak,
  scaleMealToTarget,
} from '@/utils/healthCalculations';
import { WEEKLY_MEALS, BASE_DAILY_CALORIES, DAILY_FRUITS } from '@/data/nutritionData';
import { WORKOUT_SCHEDULE, EQUIPMENT_LIST } from '@/data/workoutData';
import ArcGauge from '@/components/ArcGauge';
import MealDetailModal from '@/components/MealDetailModal';
import BiometricModal from '@/components/BiometricModal';
import MuscleAnatomyModal from '@/components/MuscleAnatomyModal';
import MartialArtsSection from '@/components/MartialArtsSection';
import WeightProgressCard from '@/components/WeightProgressCard';
import InstallPwaBanner from '@/components/InstallPwaBanner';

// Hari dalam seminggu
const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const DAY_MAP = { 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu', 0: 'Minggu' };

function getTodayDayName() {
  return DAY_MAP[new Date().getDay()];
}

function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Minggu
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return DAY_NAMES.map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { name, date: getLocalDateString(d), dayNum: d.getDate(), isToday: getLocalDateString(d) === getLocalDateString(today) };
  });
}

// Kamus pemetaan label otot Bahasa Indonesia
const MUSCLE_LABELS_ID = {
  chest: 'Dada',
  front_delts: 'Bahu Depan',
  'front delts': 'Bahu Depan',
  side_delts: 'Bahu Samping',
  'side delts': 'Bahu Samping',
  rear_delts: 'Bahu Belakang',
  'rear delts': 'Bahu Belakang',
  biceps: 'Bisep',
  triceps: 'Trisep',
  abs: 'Perut (Core)',
  obliques: 'Perut Samping',
  quads: 'Paha Depan',
  calves: 'Betis',
  upper_back: 'Punggung Atas',
  'upper back': 'Punggung Atas',
  lats: 'Punggung Sayap',
  lower_back: 'Punggung Bawah',
  'lower back': 'Punggung Bawah',
  glutes: 'Bokong (Glutes)',
  hamstrings: 'Paha Belakang',
};

// Default state
const DEFAULT_BIO = { gender: 'male', age: 20, heightCm: 168, weightKg: 60, activityLevel: 1.375, strategyMode: 'auto' };

export default function HealthAppPage() {
  // Core state
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [workoutSubTab, setWorkoutSubTab] = useState('muscle'); // 'muscle' | 'martial'
  const [skipFruit, setSkipFruit] = useState(false);
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [ownedEquipment, setOwnedEquipment] = useState(['bodyweight']);
  const [completedDates, setCompletedDates] = useState([]);
  const [swappedSlots, setSwappedSlots] = useState({}); // { 'Senin-0': 1, 'Senin-1': 0 }
  const [weightHistory, setWeightHistory] = useState([]);
  const [selectedDayName, setSelectedDayName] = useState(getTodayDayName());
  const [budgetTier, setBudgetTier] = useState('budget');

  // Modal state
  const [showBioModal, setShowBioModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState(null);

  // ==================== PERSISTENCE ====================
  useEffect(() => {
    try {
      const v2Data = localStorage.getItem('healtyapp_v2_state');
      if (v2Data) {
        const parsed = JSON.parse(v2Data);
        if (parsed.bio) setBio({ ...DEFAULT_BIO, ...parsed.bio });
        if (parsed.ownedEquipment) setOwnedEquipment(parsed.ownedEquipment);
        if (parsed.completedDates) setCompletedDates(parsed.completedDates);
        if (parsed.swappedSlots) setSwappedSlots(parsed.swappedSlots);
        if (parsed.weightHistory) setWeightHistory(parsed.weightHistory);
        if (parsed.budgetTier) setBudgetTier(parsed.budgetTier);
        if (parsed.skipFruit !== undefined) setSkipFruit(parsed.skipFruit);
      } else {
        // Migrate from v1
        const v1Data = localStorage.getItem('healtyapp_biometrics_v1');
        if (v1Data) {
          const parsed = JSON.parse(v1Data);
          setBio({
            gender: parsed.gender || 'male',
            age: Number(parsed.age) || 20,
            heightCm: Number(parsed.heightCm) || 168,
            weightKg: Number(parsed.weightKg) || 60,
            activityLevel: Number(parsed.activityLevel) || 1.375,
            strategyMode: parsed.strategyMode || 'auto',
          });
        }
      }
    } catch (err) {
      console.warn('Gagal memuat data:', err);
    } finally {
      setIsLoaded(true);
    }

    // Registrasi Service Worker untuk PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker berhasil didaftarkan:', registration.scope);
          })
          .catch((error) => {
            console.warn('Pendaftaran Service Worker gagal:', error);
          });
      });
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('healtyapp_v2_state', JSON.stringify({
        bio, ownedEquipment, completedDates, swappedSlots, weightHistory, budgetTier, skipFruit,
      }));
    } catch (err) {
      console.warn('Gagal menyimpan:', err);
    }
  }, [bio, ownedEquipment, completedDates, swappedSlots, weightHistory, budgetTier, skipFruit, isLoaded]);

  // ==================== CALCULATIONS ====================
  const bmi = useMemo(() => calculateBMI(bio.weightKg, bio.heightCm), [bio.weightKg, bio.heightCm]);
  const bmiCategory = useMemo(() => getBMICategory(bmi), [bmi]);
  const weightTarget = useMemo(() => getWeightTargetAnalysis(bio.weightKg, bio.heightCm), [bio.weightKg, bio.heightCm]);
  const bmr = useMemo(() => calculateBMR(bio.gender, bio.weightKg, bio.heightCm, bio.age), [bio]);
  const tdee = useMemo(() => calculateTDEE(bmr, bio.activityLevel), [bmr, bio.activityLevel]);

  const activeGoal = useMemo(() => {
    if (bio.strategyMode !== 'auto') return bio.strategyMode;
    if (bmi < 18.5) return 'bulking';
    if (bmi >= 25.0) return 'cutting';
    return 'maintenance';
  }, [bio.strategyMode, bmi]);

  const strategy = useMemo(() => getStrategyDetails(activeGoal, tdee, bio.weightKg), [activeGoal, tdee, bio.weightKg]);

  const weekDates = useMemo(() => getWeekDates(), []);
  const todayStr = useMemo(() => getLocalDateString(), []);
  const completedSet = useMemo(() => new Set(completedDates), [completedDates]);
  const isTodayCompleted = completedSet.has(todayStr);

  const streak = useMemo(() => calculateWorkoutStreak(completedDates), [completedDates]);

  // Current day workout
  const currentDayData = useMemo(() => {
    return WORKOUT_SCHEDULE.find((d) => d.day === selectedDayName) || WORKOUT_SCHEDULE[0];
  }, [selectedDayName]);

  // Get active variation for each slot (considering owned equipment and swaps)
  const getActiveVariation = useCallback((dayName, slotIdx, slot) => {
    const swapKey = `${dayName}-${slotIdx}`;
    const swapIdx = swappedSlots[swapKey];

    // Filter variations by owned equipment
    const available = slot.variations.filter((v) => ownedEquipment.includes(v.equipment));
    if (available.length === 0) return { variation: slot.variations[0], availableCount: slot.variations.length, currentIdx: 0 };

    const idx = (swapIdx !== undefined ? swapIdx : 0) % available.length;
    return { variation: available[idx], availableCount: available.length, currentIdx: idx };
  }, [ownedEquipment, swappedSlots]);

  // Active Fruit data
  const activeFruit = useMemo(() => {
    return DAILY_FRUITS[selectedDayName] || DAILY_FRUITS.Senin;
  }, [selectedDayName]);

  // ==================== HANDLERS ====================
  const handleBioSave = (newBio) => {
    setBio(newBio);
    // Upsert weight history
    const today = getLocalDateString();
    setWeightHistory((prev) => {
      const existing = prev.findIndex((e) => e.date === today);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { date: today, weight: newBio.weightKg };
        return updated;
      }
      return [...prev, { date: today, weight: newBio.weightKg }];
    });
    setShowBioModal(false);
  };

  const handleSwapVariation = (dayName, slotIdx, slot) => {
    const swapKey = `${dayName}-${slotIdx}`;
    const available = slot.variations.filter((v) => ownedEquipment.includes(v.equipment));
    if (available.length <= 1) return;

    setSwappedSlots((prev) => {
      const current = prev[swapKey] || 0;
      return { ...prev, [swapKey]: (current + 1) % available.length };
    });
  };

  const handleCheckIn = () => {
    if (!isTodayCompleted) {
      setCompletedDates((prev) => [...prev, todayStr]);
    }
  };

  const toggleEquipment = (eqId) => {
    if (eqId === 'bodyweight') return; // Always on
    setOwnedEquipment((prev) =>
      prev.includes(eqId) ? prev.filter((e) => e !== eqId) : [...prev, eqId]
    );
  };

  // ==================== MEAL SCALING & FRUIT REALLOCATION ====================
  const dayMeals = useMemo(() => {
    const dayData = WEEKLY_MEALS[selectedDayName];
    if (!dayData) return null;
    const tierData = dayData[budgetTier];
    if (!tierData) return null;

    const baseCal = BASE_DAILY_CALORIES[budgetTier] || 1400;
    const targetCal = strategy.targetCalories;

    const breakfast = scaleMealToTarget(tierData.breakfast, targetCal, baseCal);
    const lunch = scaleMealToTarget(tierData.lunch, targetCal, baseCal);
    let snack = scaleMealToTarget(tierData.snack, targetCal, baseCal);
    const dinner = scaleMealToTarget(tierData.dinner, targetCal, baseCal);

    // Alokasikan kalori dan karbohidrat buah harian ke Jajan jika skipFruit diaktifkan
    if (skipFruit && activeFruit) {
      snack = {
        ...snack,
        calories: snack.calories + activeFruit.calories,
        carbs: snack.carbs + activeFruit.carbs,
        divertedFromFruit: true,
        fruitBonusCalories: activeFruit.calories,
      };
    }

    return {
      breakfast,
      lunch,
      snack,
      dinner,
    };
  }, [selectedDayName, budgetTier, strategy.targetCalories, skipFruit, activeFruit]);

  // Prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-400 text-sm">Memuat HealthEngine...</div>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
              ⚡
            </div>
            <div>
              <span className="font-bold text-sm text-white">HealthEngine</span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                V2.6
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="max-w-lg mx-auto px-4 pb-24 pt-4">

        {/* ==================== TAB 1: BERANDA ==================== */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Banner Pasang Aplikasi PWA */}
            <InstallPwaBanner />

            {/* Streak Banner */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="text-xs text-slate-400">Streak Latihan</p>
                    <p className="text-2xl font-extrabold font-mono text-white tabular-nums">{streak.streak} <span className="text-sm font-normal text-slate-400">hari</span></p>
                  </div>
                </div>
                {streak.hasStreakFreeze && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    ❄️ Streak Freeze
                  </span>
                )}
                {isTodayCompleted && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ✓ Selesai Hari Ini
                  </span>
                )}
              </div>

              {/* Weekly Calendar */}
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map((wd) => {
                  const isRest = wd.name === 'Rabu' || wd.name === 'Minggu';
                  const done = completedSet.has(wd.date);
                  const isSelected = wd.name === selectedDayName;

                  return (
                    <button
                      key={wd.name}
                      type="button"
                      onClick={() => setSelectedDayName(wd.name)}
                      className={`min-h-11 rounded-xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white font-bold'
                          : done
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'
                          : isRest
                          ? 'bg-slate-950 border-slate-800 text-slate-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-semibold">{wd.name.slice(0, 3)}</span>
                      <span className="text-xs font-mono">{wd.dayNum}</span>
                      {done && !isSelected && <span className="text-xs">✓</span>}
                      {isRest && !isSelected && <span className="text-xs">💤</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Biometric Profile Card */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100">📊 Profil Biometrik</h3>
                <button
                  type="button"
                  onClick={() => setShowBioModal(true)}
                  className="min-h-11 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                >
                  Edit BB / Profil
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Tinggi</span>
                  <span className="font-bold font-mono text-white">{bio.heightCm} cm</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Berat</span>
                  <span className="font-bold font-mono text-white">{bio.weightKg} kg</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Usia</span>
                  <span className="font-bold font-mono text-white">{bio.age} tahun</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">BMI</span>
                  <span className="font-bold font-mono text-white">{bmi} <span className="text-slate-500 font-normal">kg/m²</span></span>
                </div>
              </div>

              {/* BMI Badge */}
              <div className={`px-3 py-2 rounded-lg border text-xs font-medium ${bmiCategory.badgeClass}`}>
                {bmiCategory.label} — {bmiCategory.advice}
              </div>

              {/* Target & Strategy */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 block text-xs">Target Berat</span>
                  <span className="font-bold text-emerald-400 font-mono">~{weightTarget.targetOptimalKg} kg</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 block text-xs">TDEE</span>
                  <span className="font-bold text-blue-400 font-mono">{tdee} kkal</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 block text-xs">Target Kalori</span>
                  <span className="font-bold text-emerald-400 font-mono">{strategy.targetCalories} kkal</span>
                </div>
              </div>
            </div>

            {/* Weight Progress */}
            <WeightProgressCard
              weightHistory={weightHistory}
              weightTarget={weightTarget}
              activeGoal={activeGoal}
            />
          </div>
        )}

        {/* ==================== TAB 2: OLAHRAGA ==================== */}
        {activeTab === 'workout' && (
          <div className="space-y-4">
            {/* Sub-tab Switcher: Pembentukan Otot vs Bela Diri Praktis */}
            <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setWorkoutSubTab('muscle')}
                className={`flex-1 min-h-11 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  workoutSubTab === 'muscle'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🏋️</span>
                <span>Pembentukan Otot</span>
              </button>
              <button
                type="button"
                onClick={() => setWorkoutSubTab('martial')}
                className={`flex-1 min-h-11 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  workoutSubTab === 'martial'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🥊</span>
                <span>Bela Diri Praktis</span>
              </button>
            </div>

            {/* Sub-tab 1: Pembentukan Otot (Gym & Kalistenik) */}
            {workoutSubTab === 'muscle' && (
              <div className="space-y-4">
                {/* Day Selector */}
                <div className="grid grid-cols-7 gap-1">
                  {DAY_NAMES.map((day) => {
                    const isRest = day === 'Rabu' || day === 'Minggu';
                    const isSelected = day === selectedDayName;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDayName(day)}
                        className={`min-h-11 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 border-blue-500 text-white font-bold'
                            : isRest
                            ? 'bg-amber-950/20 border-amber-500/20 text-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-semibold">{day.slice(0, 3)}</span>
                        <span className="text-xs font-mono">{isRest ? '💤' : '💪'}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Muscle Focus Header */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {currentDayData.day}
                    </span>
                    {currentDayData.isRestDay && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Hari Istirahat
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-white">{currentDayData.title}</h2>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <span>⏱️ {currentDayData.duration}</span>
                    <span>•</span>
                    <span>{currentDayData.slots.length} gerakan</span>
                  </div>

                  {currentDayData.targetMusclesSummary.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {currentDayData.targetMusclesSummary.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded text-xs font-medium bg-slate-950 text-slate-300 border border-slate-800">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Equipment Chips (only on training days) */}
                {!currentDayData.isRestDay && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-400">Alat yang kamu miliki:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {EQUIPMENT_LIST.map((eq) => {
                        const isOwned = ownedEquipment.includes(eq.id);
                        const isDefault = eq.id === 'bodyweight';
                        return (
                          <button
                            key={eq.id}
                            type="button"
                            onClick={() => toggleEquipment(eq.id)}
                            disabled={isDefault}
                            className={`min-h-11 px-3 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                              isOwned
                                ? 'bg-emerald-600/15 border-emerald-500/40 text-emerald-400'
                                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                            } ${isDefault ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <span>{eq.emoji}</span>
                            <span>{eq.label}</span>
                            {isOwned && <span>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Exercise Slots */}
                {!currentDayData.isRestDay && currentDayData.slots.length > 0 && (
                  <div className="space-y-3">
                    {currentDayData.slots.map((slot, slotIdx) => {
                      const { variation, availableCount, currentIdx } = getActiveVariation(selectedDayName, slotIdx, slot);
                      return (
                        <div
                          key={slotIdx}
                          className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2 cursor-pointer hover:border-slate-700 transition"
                          onClick={() => setSelectedExercise(variation)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono font-bold text-slate-500">#{slotIdx + 1}</span>
                                <span className="text-xs text-slate-500">{slot.slotLabel}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-100 leading-snug">{variation.name}</h4>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  {EQUIPMENT_LIST.find((e) => e.id === variation.equipment)?.label || variation.equipment}
                                </span>
                                {variation.primaryMuscles.slice(0, 2).map((m) => (
                                  <span key={m} className="px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                    {MUSCLE_LABELS_ID[m] || m}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Swap Button */}
                            {availableCount > 1 && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleSwapVariation(selectedDayName, slotIdx, slot); }}
                                className="min-h-11 min-w-11 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-blue-400 hover:bg-slate-800 transition flex items-center gap-1 shrink-0"
                              >
                                ⟳ {currentIdx + 1}/{availableCount}
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono">
                            <span className="text-emerald-400 font-semibold">{variation.setsReps}</span>
                            <span className="text-slate-600">|</span>
                            <span className="text-amber-400">Rest {variation.rest}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Rest Day Message */}
                {currentDayData.isRestDay && (
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-center space-y-3">
                    <span className="text-4xl">😴</span>
                    <h3 className="text-lg font-bold text-slate-100">Hari Pemulihan</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Otot tumbuh saat kamu istirahat, bukan saat latihan. Tidur 7-8 jam, minum 2L air, dan pastikan asupan protein tetap tercukupi.
                    </p>
                  </div>
                )}

                {/* Check-in Button */}
                {!currentDayData.isRestDay && selectedDayName === getTodayDayName() && (
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    disabled={isTodayCompleted}
                    className={`w-full min-h-11 rounded-xl text-sm font-bold transition ${
                      isTodayCompleted
                        ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
                    }`}
                  >
                    {isTodayCompleted ? '✓ Latihan Hari Ini Selesai!' : '🏁 Selesai Latihan Hari Ini'}
                  </button>
                )}
              </div>
            )}

            {/* Sub-tab 2: Modul Bela Diri Praktis */}
            {workoutSubTab === 'martial' && (
              <MartialArtsSection />
            )}
          </div>
        )}

        {/* ==================== TAB 3: MAKANAN ==================== */}
        {activeTab === 'meals' && (
          <div className="space-y-4">
            {/* Day Selector */}
            <div className="grid grid-cols-7 gap-1">
              {DAY_NAMES.map((day) => {
                const isSelected = day === selectedDayName;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDayName(day)}
                    className={`min-h-11 rounded-xl border text-center transition ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-semibold">{day.slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>

            {/* Budget Filter */}
            <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setBudgetTier('budget')}
                className={`flex-1 min-h-11 rounded-lg text-xs font-semibold transition ${
                  budgetTier === 'budget' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                💰 Anak Kos
              </button>
              <button
                type="button"
                onClick={() => setBudgetTier('standard')}
                className={`flex-1 min-h-11 rounded-lg text-xs font-semibold transition ${
                  budgetTier === 'standard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🍱 Standar
              </button>
            </div>

            {/* Nutrition Target Banner */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Target Nutrisi Harian</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  activeGoal === 'bulking' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : activeGoal === 'cutting' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {strategy.title}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Kalori</span>
                  <span className="font-bold font-mono text-white">{strategy.targetCalories}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-blue-500/20">
                  <span className="text-blue-400 block">Protein</span>
                  <span className="font-bold font-mono text-blue-400">{strategy.macros.proteinG}g</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-emerald-500/20">
                  <span className="text-emerald-400 block">Karbo</span>
                  <span className="font-bold font-mono text-emerald-400">{strategy.macros.carbsG}g</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-amber-500/20">
                  <span className="text-amber-400 block">Lemak</span>
                  <span className="font-bold font-mono text-amber-400">{strategy.macros.fatG}g</span>
                </div>
              </div>
            </div>

            {/* Kartu Buah Harian & Tombol Pengalihan Kalori */}
            {activeFruit && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{activeFruit.emoji}</span>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Buah Harian ({selectedDayName})</span>
                      <h4 className="text-sm font-bold text-white">{activeFruit.name}</h4>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    skipFruit ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {skipFruit ? 'Kalori Dialihkan' : 'Jatah Aktif'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Takaran URT</span>
                    <span className="font-semibold text-slate-200">{activeFruit.householdPortion}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Nilai Kalori</span>
                    <span className="font-mono font-bold text-emerald-400">{activeFruit.calories} kkal</span>
                    <span className="text-slate-400 text-xs ml-1">({activeFruit.carbs}g karbo)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-snug">
                  💡 {activeFruit.benefits}
                </p>

                {/* Tombol Toggle Skip Fruit */}
                <button
                  type="button"
                  onClick={() => setSkipFruit((prev) => !prev)}
                  className={`w-full min-h-11 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                    skipFruit
                      ? 'bg-slate-950 border-emerald-500/40 text-emerald-400 hover:bg-slate-800 active:scale-95'
                      : 'bg-slate-950 border-amber-500/40 text-amber-400 hover:bg-slate-800 active:scale-95'
                  }`}
                >
                  {skipFruit ? (
                    <>
                      <span>🔄</span>
                      <span>Aktifkan Kembali Buah</span>
                    </>
                  ) : (
                    <>
                      <span>⚡</span>
                      <span>Lewati Buah & Alihkan Kalori ke Jajan</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 4 Meal Cards */}
            {dayMeals && (
              <div className="space-y-3">
                {[
                  { key: 'breakfast', label: '🌅 Sarapan', meal: dayMeals.breakfast },
                  { key: 'lunch', label: '☀️ Makan Siang', meal: dayMeals.lunch },
                  { key: 'snack', label: '🥟 Jajan', meal: dayMeals.snack },
                  { key: 'dinner', label: '🌙 Makan Malam', meal: dayMeals.dinner },
                ].map(({ key, label, meal }) => (
                  <div
                    key={key}
                    className="rounded-xl bg-slate-900 border border-slate-800 p-4 cursor-pointer hover:border-slate-700 transition space-y-2.5"
                    onClick={() => setSelectedFoodForModal(meal)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs text-blue-400 font-semibold">{label}</span>
                        <h4 className="text-sm font-bold text-slate-100 leading-snug mt-0.5">{meal.name}</h4>
                      </div>
                      <span className="text-lg shrink-0">{meal.emoji}</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">{meal.shortDesc}</p>

                    {/* Takaran URT Langsung di Kartu */}
                    {(meal.scaledHouseholdPortion || meal.householdPortion) && (
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                        <span className="text-emerald-400 font-semibold mr-1">🥄 URT:</span>
                        <span>{meal.scaledHouseholdPortion || meal.householdPortion}</span>
                      </div>
                    )}

                    {/* Badge Pengalihan Kalori Buah pada Kartu Jajan */}
                    {key === 'snack' && skipFruit && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                        <span>✨</span>
                        <span>+Kalori dialihkan dari jatah buah (+{activeFruit.calories} kkal)</span>
                      </div>
                    )}

                    {/* Portion Note */}
                    {meal.portionNote && meal.portionNote !== 'Porsi standar (sesuai resep asli)' && (
                      <p className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                        📏 {meal.portionNote}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
                      <span>🔥 <strong className="text-white">{meal.calories}</strong> kkal</span>
                      <span>P: <strong className="text-blue-400">{meal.protein}g</strong></span>
                      <span>K: <strong className="text-emerald-400">{meal.carbs}g</strong></span>
                      <span>L: <strong className="text-amber-400">{meal.fat}g</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Daily Total */}
            {dayMeals && (
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-center">
                <span className="text-slate-400">Total Hari Ini: </span>
                <strong className="text-white">
                  {dayMeals.breakfast.calories + dayMeals.lunch.calories + dayMeals.snack.calories + dayMeals.dinner.calories} kkal
                </strong>
                <span className="text-slate-600 mx-2">|</span>
                <span className="text-blue-400">
                  P: {dayMeals.breakfast.protein + dayMeals.lunch.protein + dayMeals.snack.protein + dayMeals.dinner.protein}g
                </span>
                <span className="text-slate-600 mx-2">|</span>
                <span className="text-emerald-400">
                  K: {dayMeals.breakfast.carbs + dayMeals.lunch.carbs + dayMeals.snack.carbs + dayMeals.dinner.carbs}g
                </span>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==================== BOTTOM NAVIGATION ==================== */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur border-t border-slate-800">
        <div className="max-w-lg mx-auto flex">
          {[
            { id: 'home', label: 'Beranda', emoji: '🏠' },
            { id: 'workout', label: 'Olahraga', emoji: '🏋️' },
            { id: 'meals', label: 'Makanan', emoji: '🍽️' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-h-14 flex flex-col items-center justify-center gap-0.5 transition ${
                activeTab === tab.id ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-lg">{tab.emoji}</span>
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ==================== MODALS ==================== */}
      {showBioModal && (
        <BiometricModal
          biometrics={bio}
          onSave={handleBioSave}
          onClose={() => setShowBioModal(false)}
        />
      )}

      {selectedExercise && (
        <MuscleAnatomyModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {selectedFoodForModal && (
        <MealDetailModal
          food={selectedFoodForModal}
          onClose={() => setSelectedFoodForModal(null)}
        />
      )}
    </div>
  );
}