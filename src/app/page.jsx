'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Bot,
  CalendarCheck2,
  Dumbbell,
  Flame,
  Home,
  Moon,
  RefreshCw,
  Sparkles,
  Trophy,
  UserRound,
  UtensilsCrossed,
} from 'lucide-react';
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
import BiometricModal from '@/components/BiometricModal';
import MartialArtsSection from '@/components/MartialArtsSection';
import WeightProgressCard from '@/components/WeightProgressCard';
import InstallPwaBanner from '@/components/InstallPwaBanner';
import TodoCalendar from '@/components/ui/TodoCalendar';
import ExpandableCard from '@/components/ui/ExpandableCard';
import ExerciseDetailPanel from '@/components/ExerciseDetailPanel';
import { ToastProvider, useToast } from '@/components/ui/ToastProvider';
import {
  motionTokens,
  MorphingText,
  RollingNumber,
} from '@/components/ui/motion-primitives';

// Versi rilis tampilan — samakan dengan CACHE_NAME di public/sw.js.
const APP_VERSION = '3.1';

// Permukaan kartu V3.1: gradien gelap lembut + hairline highlight di atas.
const CARD_SURFACE =
  'rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/95 shadow-[inset_0_1px_0_0_rgba(148,163,184,0.07),0_20px_45px_-32px_rgba(0,0,0,0.95)]';
const UNIT_ROW = 'inline-flex items-baseline gap-1.5 tabular-nums';

// Hari dalam seminggu
const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const DAY_MAP = { 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu', 0: 'Minggu' };

function getTodayDayName() {
  return DAY_MAP[new Date().getDay()];
}

function getDayNameFromDateKey(key) {
  const date = new Date(`${key}T00:00:00`);
  return DAY_MAP[date.getDay()] ?? getTodayDayName();
}

function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Minggu
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return DAY_NAMES.map((name, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      name,
      date: getLocalDateString(date),
      dayNum: date.getDate(),
      isToday: getLocalDateString(date) === getLocalDateString(today),
    };
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
const DEFAULT_BIO = {
  gender: 'male',
  age: 20,
  heightCm: 168,
  weightKg: 60,
  activityLevel: 1.375,
  strategyMode: 'auto',
};

const NAV_TABS = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'workout', label: 'Olahraga', icon: Dumbbell },
  { id: 'meals', label: 'Makanan', icon: UtensilsCrossed },
];

export default function HealthAppPage() {
  return (
    <ToastProvider position="top-center">
      <HealthEngine />
    </ToastProvider>
  );
}

function HealthEngine() {
  const reduce = useReducedMotion();
  const { toast } = useToast();

  // Core state
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [workoutSubTab, setWorkoutSubTab] = useState('muscle'); // 'muscle' | 'martial'
  const [skipFruit, setSkipFruit] = useState(false);
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [ownedEquipment, setOwnedEquipment] = useState(['bodyweight']);
  const [completedDates, setCompletedDates] = useState([]);
  const [swappedSlots, setSwappedSlots] = useState({});
  const [weightHistory, setWeightHistory] = useState([]);
  const [selectedDayName, setSelectedDayName] = useState(getTodayDayName());
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());
  const [budgetTier, setBudgetTier] = useState('budget');

  // Modal state
  const [showBioModal, setShowBioModal] = useState(false);

  // ==================== PERSISTENCE ====================
  useEffect(() => {
    try {
      const v3Data = localStorage.getItem('healtyapp_v3_state');
      const v2Data = localStorage.getItem('healtyapp_v2_state');
      const savedData = v3Data || v2Data;

      if (savedData) {
        const parsed = JSON.parse(savedData);
        /* eslint-disable react-hooks/set-state-in-effect -- localStorage is only readable after hydration; this sets the persisted snapshot once */
        if (parsed.bio) setBio({ ...DEFAULT_BIO, ...parsed.bio });
        if (parsed.ownedEquipment) setOwnedEquipment(parsed.ownedEquipment);
        if (parsed.completedDates) setCompletedDates(parsed.completedDates);
        if (parsed.swappedSlots) setSwappedSlots(parsed.swappedSlots);
        if (parsed.weightHistory) setWeightHistory(parsed.weightHistory);
        if (parsed.budgetTier) setBudgetTier(parsed.budgetTier);
        if (parsed.skipFruit !== undefined) setSkipFruit(parsed.skipFruit);
        /* eslint-enable react-hooks/set-state-in-effect */
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

  // Keep tab changes predictable on mobile: always start at the top.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, left: 0 });
  }, [activeTab]);

  // Auto-save
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        'healtyapp_v3_state',
        JSON.stringify({
          bio,
          ownedEquipment,
          completedDates,
          swappedSlots,
          weightHistory,
          budgetTier,
          skipFruit,
        })
      );
    } catch (err) {
      console.warn('Gagal menyimpan:', err);
    }
  }, [
    bio,
    ownedEquipment,
    completedDates,
    swappedSlots,
    weightHistory,
    budgetTier,
    skipFruit,
    isLoaded,
  ]);

  // ==================== CALCULATIONS ====================
  const bmi = useMemo(
    () => calculateBMI(bio.weightKg, bio.heightCm),
    [bio.weightKg, bio.heightCm]
  );
  const bmiCategory = useMemo(() => getBMICategory(bmi), [bmi]);
  const weightTarget = useMemo(
    () => getWeightTargetAnalysis(bio.weightKg, bio.heightCm),
    [bio.weightKg, bio.heightCm]
  );
  const bmr = useMemo(
    () => calculateBMR(bio.gender, bio.weightKg, bio.heightCm, bio.age),
    [bio]
  );
  const tdee = useMemo(
    () => calculateTDEE(bmr, bio.activityLevel),
    [bmr, bio.activityLevel]
  );

  const activeGoal = useMemo(() => {
    if (bio.strategyMode !== 'auto') return bio.strategyMode;
    if (bmi < 18.5) return 'bulking';
    if (bmi >= 25.0) return 'cutting';
    return 'maintenance';
  }, [bio.strategyMode, bmi]);

  const strategy = useMemo(
    () => getStrategyDetails(activeGoal, tdee, bio.weightKg),
    [activeGoal, tdee, bio.weightKg]
  );

  const weekDates = useMemo(() => getWeekDates(), []);
  const todayStr = useMemo(() => getLocalDateString(), []);
  const completedSet = useMemo(() => new Set(completedDates), [completedDates]);
  const isSelectedDateCompleted = completedSet.has(selectedDate);
  const streak = useMemo(
    () => calculateWorkoutStreak(completedDates),
    [completedDates]
  );

  // Current day workout
  const currentDayData = useMemo(() => {
    return (
      WORKOUT_SCHEDULE.find((day) => day.day === selectedDayName) ||
      WORKOUT_SCHEDULE[0]
    );
  }, [selectedDayName]);

  // Get active variation for each slot (considering owned equipment and swaps)
  const getActiveVariation = useCallback(
    (dayName, slotIndex, slot) => {
      const swapKey = `${dayName}-${slotIndex}`;
      const swapIndex = swappedSlots[swapKey];

      const available = slot.variations.filter((variation) =>
        ownedEquipment.includes(variation.equipment)
      );
      if (available.length === 0) {
        return {
          variation: slot.variations[0],
          availableCount: slot.variations.length,
          currentIndex: 0,
        };
      }

      const index =
        (swapIndex !== undefined ? swapIndex : 0) % available.length;
      return {
        variation: available[index],
        availableCount: available.length,
        currentIndex: index,
      };
    },
    [ownedEquipment, swappedSlots]
  );

  // Active Fruit data
  const activeFruit = useMemo(() => {
    return DAILY_FRUITS[selectedDayName] || DAILY_FRUITS.Senin;
  }, [selectedDayName]);

  // ==================== HANDLERS ====================
  const handleSelectDate = useCallback((dateKey) => {
    setSelectedDate(dateKey);
    setSelectedDayName(getDayNameFromDateKey(dateKey));
  }, []);

  const handleSelectDayName = useCallback(
    (dayName) => {
      setSelectedDayName(dayName);
      const matchedDate = weekDates.find((entry) => entry.name === dayName);
      if (matchedDate) setSelectedDate(matchedDate.date);
    },
    [weekDates]
  );

  const handleBioSave = (newBio) => {
    setBio(newBio);
    // Upsert weight history
    const today = getLocalDateString();
    setWeightHistory((previous) => {
      const existing = previous.findIndex((entry) => entry.date === today);
      if (existing >= 0) {
        const updated = [...previous];
        updated[existing] = { date: today, weight: newBio.weightKg };
        return updated;
      }
      return [...previous, { date: today, weight: newBio.weightKg }];
    });
    setShowBioModal(false);
  };

  const handleSwapVariation = (dayName, slotIndex, slot) => {
    const swapKey = `${dayName}-${slotIndex}`;
    const available = slot.variations.filter((variation) =>
      ownedEquipment.includes(variation.equipment)
    );
    if (available.length <= 1) return;

    const current = swappedSlots[swapKey] || 0;
    const nextIndex = (current + 1) % available.length;
    const nextVariation = available[nextIndex];

    setSwappedSlots((previous) => ({
      ...previous,
      [swapKey]: nextIndex,
    }));

    toast({
      tone: 'neutral',
      text: 'Variasi gerakan diganti',
      description: `${nextVariation.name} · ${dayName} · ${nextVariation.setsReps}`,
      icon: <RefreshCw size={17} strokeWidth={2.2} />,
    });
  };

  const handleToggleWorkoutComplete = () => {
    const dateKey = selectedDate;
    const wasCompleted = completedSet.has(dateKey);

    if (wasCompleted) {
      setCompletedDates((previous) =>
        previous.filter((date) => date !== dateKey)
      );
      toast({
        tone: 'neutral',
        text: 'Status latihan dibatalkan',
        description: `Agenda ${currentDayData.title} kembali terbuka. Kamu bisa menyelesaikannya lagi kapan saja.`,
        icon: <RefreshCw size={17} strokeWidth={2.2} />,
      });
      return;
    }

    setCompletedDates((previous) =>
      previous.includes(dateKey) ? previous : [...previous, dateKey]
    );

    const nextCompleted = [...completedDates, dateKey];
    const nextStreak = calculateWorkoutStreak(nextCompleted);
    toast({
      tone: 'success',
      text: 'Latihan Selesai! 🔥',
      description: `${currentDayData.title} tercatat selesai. Streak latihanmu sekarang ${nextStreak.streak} hari.`,
      icon: <Trophy size={17} strokeWidth={2.2} />,
      actionLabel: 'Lihat Agenda Beranda',
      onAction: () => setActiveTab('home'),
      duration: 6000,
    });
  };

  const handleToggleEquipment = (equipmentId) => {
    if (equipmentId === 'bodyweight') return; // Always on
    setOwnedEquipment((previous) =>
      previous.includes(equipmentId)
        ? previous.filter((id) => id !== equipmentId)
        : [...previous, equipmentId]
    );
  };

  const handleToggleSkipFruit = () => {
    const nextValue = !skipFruit;
    setSkipFruit(nextValue);

    toast({
      tone: nextValue ? 'warning' : 'success',
      text: nextValue ? 'Buah dilewati hari ini' : 'Buah diaktifkan kembali',
      description: nextValue
        ? `${activeFruit.calories} kkal dan ${activeFruit.carbs}g karbo dari ${activeFruit.name} dialihkan ke jajan.`
        : `Jatah ${activeFruit.name} kembali aktif di menu ${selectedDayName}.`,
      icon: <Sparkles size={17} strokeWidth={2.2} />,
    });
  };

  const handleAgendaItemClick = (item) => {
    if (item.type === 'workout') {
      if (isSelectedDateCompleted) {
        toast({
          tone: 'success',
          text: 'Latihan sudah selesai',
          description: `${currentDayData.title} sudah tercatat untuk tanggal ini. Jaga hidrasi dan asupan proteinmu.`,
          icon: <CalendarCheck2 size={17} strokeWidth={2.2} />,
        });
        return;
      }

      setActiveTab('workout');
      toast({
        tone: 'warning',
        text: 'Selesaikan latihan dulu',
        description: `${currentDayData.title} (${currentDayData.duration}) menunggu. Ketuk notifikasi ini untuk langsung membuka Tab Olahraga.`,
        actionLabel: 'Buka Tab Olahraga',
        onAction: () => setActiveTab('workout'),
        icon: <Dumbbell size={17} strokeWidth={2.2} />,
        duration: 6500,
      });
      return;
    }

    if (item.type === 'nutrition') {
      setActiveTab('meals');
      toast({
        tone: 'neutral',
        text: 'Target nutrisi dibuka',
        description: `${strategy.title} · ${strategy.targetCalories} kkal hari ini. Geser hari atau budget sesuai kebutuhanmu.`,
        actionLabel: 'Lihat Menu Makanan',
        onAction: () => setActiveTab('meals'),
        icon: <UtensilsCrossed size={17} strokeWidth={2.2} />,
      });
      return;
    }

    toast({
      tone: 'success',
      text: 'Hari pemulihan aktif',
      description: 'Tidur 7-8 jam, minum 2L air, dan lakukan peregangan ringan. Streak tetap terjaga.',
      icon: <Moon size={17} strokeWidth={2.2} />,
    });
  };

  // ==================== MEAL SCALING & FRUIT REALLOCATION ====================
  const dayMeals = useMemo(() => {
    const dayData = WEEKLY_MEALS[selectedDayName];
    if (!dayData) return null;
    const tierData = dayData[budgetTier];
    if (!tierData) return null;

    const baseCalories = BASE_DAILY_CALORIES[budgetTier] || 1400;
    const targetCalories = strategy.targetCalories;

    const breakfast = scaleMealToTarget(
      tierData.breakfast,
      targetCalories,
      baseCalories
    );
    const lunch = scaleMealToTarget(tierData.lunch, targetCalories, baseCalories);
    let snack = scaleMealToTarget(tierData.snack, targetCalories, baseCalories);
    const dinner = scaleMealToTarget(
      tierData.dinner,
      targetCalories,
      baseCalories
    );

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

    return { breakfast, lunch, snack, dinner };
  }, [
    selectedDayName,
    budgetTier,
    strategy.targetCalories,
    skipFruit,
    activeFruit,
  ]);

  const dayTotals = useMemo(() => {
    if (!dayMeals) return null;
    return Object.values(dayMeals).reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [dayMeals]);

  const agendaItems = useMemo(() => {
    const dayData =
      WORKOUT_SCHEDULE.find((day) => day.day === selectedDayName) ||
      WORKOUT_SCHEDULE[0];
    const items = [];

    if (dayData.isRestDay) {
      items.push({
        id: `rest-${selectedDate}`,
        type: 'rest',
        title: 'Pemulihan Aktif & Peregangan (Streak Terjaga)',
        description: `${dayData.duration} · Hidrasi 2L dan tidur 7-8 jam agar otot pulih optimal.`,
        completed: true,
      });
    } else {
      items.push({
        id: `workout-${selectedDate}`,
        type: 'workout',
        title: `Wajib Olahraga: ${dayData.title}`,
        description: `${dayData.duration} · ${dayData.slots.length} gerakan · ${
          isSelectedDateCompleted
            ? 'Sudah selesai. Pertahankan asupan proteinmu.'
            : 'Ketuk untuk membuka Tab Olahraga dan menyelesaikan latihan.'
        }`,
        completed: isSelectedDateCompleted,
      });
    }

    items.push({
      id: `nutrition-${selectedDate}`,
      type: 'nutrition',
      title: `Nutrisi Harian: ${strategy.targetCalories} kkal`,
      description: `${strategy.title} · Protein ${strategy.macros.proteinG}g · Karbo ${strategy.macros.carbsG}g · Lemak ${strategy.macros.fatG}g`,
      completed: false,
    });

    return items;
  }, [
    selectedDayName,
    selectedDate,
    isSelectedDateCompleted,
    strategy,
  ]);

  // Prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <Bot size={22} />
          </div>
          <p className="animate-pulse text-sm text-slate-400">
            Memuat HealthEngine V{APP_VERSION}...
          </p>
        </div>
      </div>
    );
  }

  const activeTabLabel =
    NAV_TABS.find((tab) => tab.id === activeTab)?.label ?? 'Beranda';

  // ==================== RENDER ====================
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-slate-950 text-slate-100">
      {/* Aksen cahaya lembut di latar atas — satu sumber cahaya, bukan glow di setiap kartu. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.16),rgba(16,185,129,0.05)_38%,transparent_70%)]"
      />

      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-gradient-to-b from-slate-950/95 to-slate-950/75 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-sm font-bold text-white shadow-lg shadow-blue-950/40">
              ⚡
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">HealthEngine</span>
              <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-emerald-400">
                V{APP_VERSION}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-slate-800/80 bg-slate-900/60 px-2.5 py-1.5 text-slate-300">
            <span className="text-xs font-semibold">
              <MorphingText value={activeTabLabel} />
            </span>
          </div>
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="relative mx-auto max-w-lg px-3 pb-28 pt-3 sm:px-4 sm:pt-4">
        <motion.div
          key={activeTab}
          initial={reduce ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: motionTokens.ease.standard }}
        >
          {/* ==================== TAB 1: BERANDA ==================== */}
          {activeTab === 'home' && (
            <div className="space-y-5">
              <TodoCalendar
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                items={agendaItems}
                onItemClick={handleAgendaItemClick}
                locale="id-ID"
                weekStartsOn={1}
                addTodoAction={
                  <div
                    className="flex min-h-11 shrink-0 items-center gap-1 rounded-full border border-orange-500/25 bg-orange-500/10 px-2 text-orange-400 sm:px-2.5"
                    title={`Streak latihan ${streak.streak} hari`}
                    aria-label={`Streak latihan ${streak.streak} hari`}
                  >
                    <Flame size={14} strokeWidth={2.4} />
                    <span className={`${UNIT_ROW} text-xs font-bold text-orange-300`}>
                      <RollingNumber value={streak.streak} />
                      <span className="text-[11px] font-medium text-orange-300/80">
                        Hari
                      </span>
                    </span>
                    {streak.hasStreakFreeze ? (
                      <span className="text-xs" aria-hidden="true">
                        ❄️
                      </span>
                    ) : null}
                  </div>
                }
              />

              {/* Banner Pasang Aplikasi PWA */}
              <InstallPwaBanner />

              {/* Biometric Profile Card */}
              <div className={`${CARD_SURFACE} p-5 sm:p-6`}>
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                      <UserRound size={15} strokeWidth={2.2} />
                    </span>
                    Profil Biometrik
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowBioModal(true)}
                    className="min-h-11 rounded-xl border border-slate-700/80 bg-slate-950/70 px-3.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800"
                  >
                    Edit Profil
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/50 p-3.5">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Tinggi
                    </span>
                    <span className={`${UNIT_ROW} mt-1 font-mono text-lg font-bold text-white`}>
                      <RollingNumber value={bio.heightCm} />
                      <span className="text-xs font-medium text-slate-400">cm</span>
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/50 p-3.5">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Berat
                    </span>
                    <span className={`${UNIT_ROW} mt-1 font-mono text-lg font-bold text-white`}>
                      <RollingNumber value={bio.weightKg} maximumFractionDigits={1} />
                      <span className="text-xs font-medium text-slate-400">kg</span>
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/50 p-3.5">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Usia
                    </span>
                    <span className={`${UNIT_ROW} mt-1 font-mono text-lg font-bold text-white`}>
                      <RollingNumber value={bio.age} />
                      <span className="text-xs font-medium text-slate-400">tahun</span>
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/50 p-3.5">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      BMI
                    </span>
                    <span className={`${UNIT_ROW} mt-1 font-mono text-lg font-bold text-white`}>
                      <RollingNumber value={bmi} maximumFractionDigits={1} />
                      <span className="text-xs font-medium text-slate-400">kg/m²</span>
                    </span>
                  </div>
                </div>

                {/* BMI Badge */}
                <div
                  className={`mt-4 rounded-xl border px-3.5 py-2.5 text-xs font-medium leading-relaxed ${bmiCategory.badgeClass}`}
                >
                  {bmiCategory.label} — {bmiCategory.advice}
                </div>

                {/* Target & Strategy */}
                <div className="mt-4 grid grid-cols-3 gap-2.5 text-xs">
                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/50 p-3 text-center">
                    <span className="block text-[11px] text-slate-500">Target Berat</span>
                    <span className={`${UNIT_ROW} mt-1 justify-center font-mono text-sm font-bold text-emerald-400`}>
                      <RollingNumber
                        value={weightTarget.targetOptimalKg}
                        maximumFractionDigits={1}
                        prefix="~"
                      />
                      <span className="text-[11px] font-medium text-emerald-500/80">kg</span>
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/50 p-3 text-center">
                    <span className="block text-[11px] text-slate-500">TDEE</span>
                    <span className={`${UNIT_ROW} mt-1 justify-center font-mono text-sm font-bold text-blue-400`}>
                      <RollingNumber value={tdee} />
                      <span className="text-[11px] font-medium text-blue-400/75">kkal</span>
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/50 p-3 text-center">
                    <span className="block text-[11px] text-slate-500">Target Kalori</span>
                    <span className={`${UNIT_ROW} mt-1 justify-center font-mono text-sm font-bold text-emerald-400`}>
                      <RollingNumber value={strategy.targetCalories} />
                      <span className="text-[11px] font-medium text-emerald-500/80">kkal</span>
                    </span>
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
            <div className="space-y-5">
              {/* Sub-tab Switcher: Pembentukan Otot vs Bela Diri Praktis */}
              <div className="relative flex rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-1">
                {[
                  {
                    id: 'muscle',
                    label: 'Pembentukan Otot',
                    icon: '🏋️',
                    activeClass: 'bg-blue-600',
                  },
                  {
                    id: 'martial',
                    label: 'Bela Diri Praktis',
                    icon: '🥊',
                    activeClass: 'bg-rose-600',
                  },
                ].map((subTab) => {
                  const isActive = workoutSubTab === subTab.id;
                  return (
                    <button
                      key={subTab.id}
                      type="button"
                      onClick={() => setWorkoutSubTab(subTab.id)}
                      className={`relative flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="workout-subtab-active"
                          className={`absolute inset-0 rounded-xl shadow-lg ${subTab.activeClass}`}
                          transition={motionTokens.spring.morph}
                        />
                      ) : null}
                      <span className="relative z-10">{subTab.icon}</span>
                      <span className="relative z-10">{subTab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-tab 1: Pembentukan Otot (Gym & Kalistenik) */}
              {workoutSubTab === 'muscle' && (
                <div className="space-y-5">
                  {/* Day Selector */}
                  <div className="grid grid-cols-7 gap-1">
                    {DAY_NAMES.map((day) => {
                      const isRest = day === 'Rabu' || day === 'Minggu';
                      const isSelected = day === selectedDayName;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleSelectDayName(day)}
                          className={`relative flex min-h-11 flex-col items-center justify-center rounded-xl border text-center transition-colors ${
                            isSelected
                              ? 'border-blue-500 text-white'
                              : isRest
                                ? 'border-amber-500/20 bg-amber-950/20 text-amber-400'
                                : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {isSelected ? (
                            <motion.span
                              layoutId="workout-day-active"
                              className="absolute inset-0 rounded-xl bg-blue-600 shadow-lg shadow-blue-950/40"
                              transition={motionTokens.spring.morph}
                            />
                          ) : null}
                          <span className="relative z-10 text-xs font-semibold">
                            {day.slice(0, 3)}
                          </span>
                          <span className="relative z-10 text-xs">
                            {isRest ? '💤' : '💪'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Muscle Focus Header */}
                  <div className={`${CARD_SURFACE} p-5`}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono text-xs font-bold text-blue-400">
                        {currentDayData.day}
                      </span>
                      {currentDayData.isRestDay ? (
                        <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400">
                          Hari Istirahat
                        </span>
                      ) : null}
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      {currentDayData.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                      <span>⏱️ {currentDayData.duration}</span>
                      <span aria-hidden="true">•</span>
                      <span>{currentDayData.slots.length} gerakan</span>
                    </div>

                    {currentDayData.targetMusclesSummary.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {currentDayData.targetMusclesSummary.map((muscle) => (
                          <span
                            key={muscle}
                            className="rounded-md border border-slate-800/80 bg-slate-950/60 px-2 py-0.5 text-xs font-medium text-slate-300"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {/* Equipment Chips (only on training days) */}
                  {!currentDayData.isRestDay && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-400">
                        Alat yang kamu miliki:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {EQUIPMENT_LIST.map((equipment) => {
                          const isOwned = ownedEquipment.includes(equipment.id);
                          const isDefault = equipment.id === 'bodyweight';
                          return (
                            <button
                              key={equipment.id}
                              type="button"
                              onClick={() => handleToggleEquipment(equipment.id)}
                              disabled={isDefault}
                              className={`flex min-h-11 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition ${
                                isOwned
                                  ? 'border-emerald-500/40 bg-emerald-600/15 text-emerald-400'
                                  : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'
                              } ${isDefault ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              <span>{equipment.emoji}</span>
                              <span>{equipment.label}</span>
                              {isOwned ? <span>✓</span> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Exercise Slots — kartu lipat inline, bukan modal */}
                  {!currentDayData.isRestDay &&
                    currentDayData.slots.length > 0 && (
                      <div className="space-y-5">
                        {currentDayData.slots.map((slot, slotIndex) => {
                          const { variation, availableCount, currentIndex } =
                            getActiveVariation(
                              selectedDayName,
                              slotIndex,
                              slot
                            );
                          return (
                            <ExpandableCard
                              key={`${selectedDayName}-${slotIndex}`}
                              defaultExpanded={false}
                              expandLabel={`Buka detail ${variation.name}`}
                              headerAction={
                                availableCount > 1 ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSwapVariation(
                                        selectedDayName,
                                        slotIndex,
                                        slot
                                      )
                                    }
                                    aria-label={`Ganti variasi gerakan, variasi ${currentIndex + 1} dari ${availableCount}`}
                                    className="flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-xl border border-slate-700/80 bg-slate-950/80 px-2.5 font-mono text-xs font-semibold text-blue-400 transition-colors hover:border-blue-500/40 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                                  >
                                    ⟳ {currentIndex + 1}/{availableCount}
                                  </button>
                                ) : null
                              }
                              header={
                                <>
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-[11px] font-bold text-slate-500">
                                          #{String(slotIndex + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                          {slot.slotLabel}
                                        </span>
                                      </div>
                                      <h4 className="mt-1 text-sm font-bold leading-snug text-slate-100">
                                        {variation.name}
                                      </h4>
                                    </div>
                                  </div>

                                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                    <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400">
                                      {EQUIPMENT_LIST.find(
                                        (equipment) =>
                                          equipment.id === variation.equipment
                                      )?.label || variation.equipment}
                                    </span>
                                    {variation.primaryMuscles
                                      .slice(0, 2)
                                      .map((muscle) => (
                                        <span
                                          key={muscle}
                                          className="rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-400"
                                        >
                                          {MUSCLE_LABELS_ID[muscle] || muscle}
                                        </span>
                                      ))}
                                  </div>

                                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
                                    <span className={UNIT_ROW}>
                                      <span className="font-semibold text-emerald-400">
                                        {variation.setsReps}
                                      </span>
                                    </span>
                                    <span className="h-3 w-px bg-slate-700" aria-hidden="true" />
                                    <span className={UNIT_ROW}>
                                      <span className="text-slate-500">Rest</span>
                                      <span className="font-semibold text-amber-400">
                                        {variation.rest}
                                      </span>
                                    </span>
                                  </div>
                                </>
                              }
                            >
                              <ExerciseDetailPanel exercise={variation} />
                            </ExpandableCard>
                          );
                        })}
                      </div>
                    )}

                  {/* Rest Day Message */}
                  {currentDayData.isRestDay && (
                    <div className={`${CARD_SURFACE} space-y-3 p-6 text-center`}>
                      <span className="text-4xl">😴</span>
                      <h3 className="text-lg font-bold text-slate-100">
                        Hari Pemulihan
                      </h3>
                      <p className="mx-auto max-w-xs text-xs leading-relaxed text-slate-400">
                        Otot tumbuh saat kamu istirahat, bukan saat latihan. Tidur
                        7-8 jam, minum 2L air, dan pastikan asupan protein tetap
                        tercukupi.
                      </p>
                    </div>
                  )}

                  {/* Completion Card */}
                  {!currentDayData.isRestDay && (
                    <div className={`${CARD_SURFACE} space-y-3 p-5`}>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs text-slate-500">
                            Status latihan tanggal ini
                          </p>
                          <p
                            className={`text-sm font-bold ${
                              isSelectedDateCompleted
                                ? 'text-emerald-400'
                                : 'text-slate-200'
                            }`}
                          >
                            {isSelectedDateCompleted
                              ? 'Selesai & tercatat'
                              : 'Belum selesai'}
                          </p>
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            isSelectedDateCompleted
                              ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
                              : 'border-slate-700 bg-slate-950 text-slate-400'
                          }`}
                        >
                          {isSelectedDateCompleted ? '✓ Tuntas' : 'Menunggu'}
                        </span>
                      </div>

                      <motion.button
                        type="button"
                        onClick={handleToggleWorkoutComplete}
                        whileTap={reduce ? undefined : { scale: 0.98 }}
                        transition={motionTokens.spring.smooth}
                        className={`min-h-11 w-full rounded-xl text-sm font-bold transition ${
                          isSelectedDateCompleted
                            ? 'border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/15'
                            : 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/30 hover:bg-emerald-500'
                        }`}
                      >
                        {isSelectedDateCompleted
                          ? 'Batalkan Status Selesai'
                          : selectedDate === todayStr
                            ? 'Selesaikan Latihan Hari Ini'
                            : 'Tandai Latihan Selesai'}
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 2: Modul Bela Diri Praktis */}
              {workoutSubTab === 'martial' && <MartialArtsSection />}
            </div>
          )}

          {/* ==================== TAB 3: MAKANAN ==================== */}
          {activeTab === 'meals' && (
            <div className="space-y-5">
              {/* Day Selector */}
              <div className="grid grid-cols-7 gap-1">
                {DAY_NAMES.map((day) => {
                  const isSelected = day === selectedDayName;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDayName(day)}
                      className={`relative min-h-11 rounded-xl border text-center text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'border-blue-500 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isSelected ? (
                        <motion.span
                          layoutId="meal-day-active"
                          className="absolute inset-0 rounded-xl bg-blue-600 shadow-lg shadow-blue-950/40"
                          transition={motionTokens.spring.morph}
                        />
                      ) : null}
                      <span className="relative z-10">{day.slice(0, 3)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Budget Filter */}
              <div className="relative flex rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-1">
                {[
                  {
                    id: 'budget',
                    label: '💰 Anak Kos',
                    activeClass: 'bg-emerald-600',
                  },
                  {
                    id: 'standard',
                    label: '🍱 Standar',
                    activeClass: 'bg-blue-600',
                  },
                ].map((tier) => {
                  const isActive = budgetTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setBudgetTier(tier.id)}
                      className={`relative min-h-11 flex-1 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="meal-budget-active"
                          className={`absolute inset-0 rounded-xl shadow-lg ${tier.activeClass}`}
                          transition={motionTokens.spring.morph}
                        />
                      ) : null}
                      <span className="relative z-10">{tier.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Nutrition Target Banner */}
              <div className={`${CARD_SURFACE} space-y-3 p-5 sm:p-6`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-300">
                    Target Nutrisi Harian
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-bold ${
                      activeGoal === 'bulking'
                        ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                        : activeGoal === 'cutting'
                          ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                          : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {strategy.title}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5">
                    <span className="block text-slate-500">Kalori</span>
                    <span className={`${UNIT_ROW} mt-1 justify-center text-white`}>
                      <span className="font-mono text-sm font-bold">
                        <RollingNumber value={strategy.targetCalories} />
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">kkal</span>
                    </span>
                  </div>
                  <div className="rounded-xl border border-blue-500/20 bg-slate-950/60 p-2.5">
                    <span className="block text-blue-400">Protein</span>
                    <span className={`${UNIT_ROW} mt-1 justify-center font-mono text-blue-400`}>
                      <span className="text-sm font-bold">
                        <RollingNumber value={strategy.macros.proteinG} />
                      </span>
                      <span className="text-[11px] font-medium text-blue-400/75">g</span>
                    </span>
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-slate-950/60 p-2.5">
                    <span className="block text-emerald-400">Karbo</span>
                    <span className={`${UNIT_ROW} mt-1 justify-center font-mono text-emerald-400`}>
                      <span className="text-sm font-bold">
                        <RollingNumber value={strategy.macros.carbsG} />
                      </span>
                      <span className="text-[11px] font-medium text-emerald-400/75">g</span>
                    </span>
                  </div>
                  <div className="rounded-xl border border-amber-500/20 bg-slate-950/60 p-2.5">
                    <span className="block text-amber-400">Lemak</span>
                    <span className={`${UNIT_ROW} mt-1 justify-center font-mono text-amber-400`}>
                      <span className="text-sm font-bold">
                        <RollingNumber value={strategy.macros.fatG} />
                      </span>
                      <span className="text-[11px] font-medium text-amber-400/75">g</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Kartu Buah Harian & Tombol Pengalihan Kalori */}
              {activeFruit && (
                <div className={`${CARD_SURFACE} space-y-4 p-5`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{activeFruit.emoji}</span>
                      <div>
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Buah Harian ({selectedDayName})
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {activeFruit.name}
                        </h4>
                      </div>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                        skipFruit
                          ? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                          : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {skipFruit ? 'Kalori Dialihkan' : 'Jatah Aktif'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                      <span className="block text-slate-500">Takaran URT</span>
                      <span className="mt-1 block font-semibold text-slate-200">
                        {activeFruit.householdPortion}
                      </span>
                    </div>
                    <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                      <span className="block text-slate-500">Nilai Kalori</span>
                      <span className={`${UNIT_ROW} mt-1 font-mono text-emerald-400`}>
                        <span className="text-sm font-bold">
                          <RollingNumber value={activeFruit.calories} />
                        </span>
                        <span className="text-[11px] font-medium text-emerald-400/75">kkal</span>
                      </span>
                      <span className={`${UNIT_ROW} mt-1 text-[11px] text-slate-400`}>
                        <span className="font-mono">{activeFruit.carbs}</span>
                        <span>g karbo</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs leading-snug text-slate-400">
                    💡 {activeFruit.benefits}
                  </p>

                  {/* Tombol Toggle Skip Fruit */}
                  <button
                    type="button"
                    onClick={handleToggleSkipFruit}
                    className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border text-xs font-bold transition-colors ${
                      skipFruit
                        ? 'border-emerald-500/40 bg-slate-950/70 text-emerald-400 hover:bg-slate-800'
                        : 'border-amber-500/40 bg-slate-950/70 text-amber-400 hover:bg-slate-800'
                    }`}
                  >
                    {skipFruit ? (
                      <>
                        <RefreshCw size={15} strokeWidth={2.3} />
                        <span>Aktifkan Kembali Buah</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} strokeWidth={2.3} />
                        <span>Lewati Buah &amp; Alihkan Kalori ke Jajan</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* 4 Meal Cards — lipatan inline, bukan pop-up */}
              {dayMeals && (
                <div className="space-y-5">
                  {[
                    { key: 'breakfast', label: '🌅 Sarapan', meal: dayMeals.breakfast },
                    { key: 'lunch', label: '☀️ Makan Siang', meal: dayMeals.lunch },
                    { key: 'snack', label: '🥟 Jajan', meal: dayMeals.snack },
                    { key: 'dinner', label: '🌙 Makan Malam', meal: dayMeals.dinner },
                  ].map(({ key, label, meal }) => (
                    <ExpandableCard
                      key={key}
                      defaultExpanded={false}
                      expandLabel={`Buka detail menu ${meal.name}`}
                      header={
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-400">
                                {label}
                              </span>
                              <h4 className="mt-1 text-sm font-bold leading-snug text-slate-100">
                                {meal.name}
                              </h4>
                            </div>
                            <span aria-hidden="true" className="shrink-0 text-xl">
                              {meal.emoji}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs text-slate-400">
                            <span className={UNIT_ROW}>
                              <strong className="text-sm font-bold text-white">
                                <RollingNumber value={meal.calories} />
                              </strong>
                              <span className="text-[11px] font-medium text-slate-500">
                                kkal
                              </span>
                            </span>
                            <span className={UNIT_ROW}>
                              <span className="text-slate-500">P</span>
                              <strong className="text-blue-400">{meal.protein}</strong>
                              <span className="text-[11px] font-medium text-slate-500">g</span>
                            </span>
                            <span className={UNIT_ROW}>
                              <span className="text-slate-500">K</span>
                              <strong className="text-emerald-400">{meal.carbs}</strong>
                              <span className="text-[11px] font-medium text-slate-500">g</span>
                            </span>
                            <span className={UNIT_ROW}>
                              <span className="text-slate-500">L</span>
                              <strong className="text-amber-400">{meal.fat}</strong>
                              <span className="text-[11px] font-medium text-slate-500">g</span>
                            </span>
                          </div>
                        </>
                      }
                    >
                      <div className="space-y-5 pt-1">
                        <p className="text-xs leading-relaxed text-slate-400">
                          {meal.shortDesc}
                        </p>

                        <div className="grid grid-cols-2 gap-2.5 text-xs">
                          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                            <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                              Estimasi Harga
                            </span>
                            <span className="mt-1 block font-mono text-base font-bold text-emerald-400">
                              Rp {meal.priceEstimateIdr?.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5">
                            <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                              Waktu Olah
                            </span>
                            <span className="mt-1 block text-sm font-semibold text-slate-200">
                              {meal.prepTime || '15 menit'}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                          <h5 className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            🥄 Takaran Ukuran Rumah Tangga
                          </h5>
                          <p className="text-xs font-medium leading-relaxed text-slate-200">
                            {meal.scaledHouseholdPortion ||
                              meal.householdPortion ||
                              '1 porsi standar (sesuai bahan)'}
                          </p>
                          {meal.portionNote &&
                            meal.portionNote !==
                              'Porsi standar (sesuai resep asli)' && (
                              <p className="mt-2 inline-block rounded border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-400">
                                📏 {meal.portionNote}
                              </p>
                            )}
                        </div>

                        {key === 'snack' && skipFruit ? (
                          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-400">
                            <span aria-hidden="true">✨</span>
                            <span>
                              +Kalori dialihkan dari jatah buah (+
                              {activeFruit.calories} kkal)
                            </span>
                          </div>
                        ) : null}

                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                          <h5 className="mb-1.5 text-xs font-bold text-slate-300">
                            Bahan &amp; Komposisi
                          </h5>
                          <p className="text-xs leading-relaxed text-slate-300">
                            {meal.ingredients}
                          </p>
                        </div>

                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-4">
                          <h5 className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            💡 Tips Pengolahan Sehat
                          </h5>
                          <p className="text-xs leading-relaxed text-slate-300">
                            {meal.cookTip}
                          </p>
                        </div>

                        {meal.benefits ? (
                          <div className="rounded-xl border border-sky-500/20 bg-sky-950/15 p-4">
                            <h5 className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-sky-400">
                              🛡️ Manfaat untuk Tubuh
                            </h5>
                            <p className="text-xs leading-relaxed text-slate-300">
                              {meal.benefits}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </ExpandableCard>
                  ))}
                </div>
              )}

              {/* Daily Total */}
              {dayTotals && (
                <div className={`${CARD_SURFACE} p-4 text-center`}>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Total Hari Ini
                  </span>
                  <div className="mt-2 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 font-mono text-xs">
                    <span className={UNIT_ROW}>
                      <strong className="text-base font-bold text-white">
                        <RollingNumber value={dayTotals.calories} />
                      </strong>
                      <span className="text-[11px] font-medium text-slate-500">kkal</span>
                    </span>
                    <span className="h-3 w-px bg-slate-700" aria-hidden="true" />
                    <span className={`${UNIT_ROW} text-blue-400`}>
                      <span className="text-slate-500">P</span>
                      <strong>
                        <RollingNumber value={dayTotals.protein} />
                      </strong>
                      <span className="text-[11px] font-medium text-blue-400/75">g</span>
                    </span>
                    <span className="h-3 w-px bg-slate-700" aria-hidden="true" />
                    <span className={`${UNIT_ROW} text-emerald-400`}>
                      <span className="text-slate-500">K</span>
                      <strong>
                        <RollingNumber value={dayTotals.carbs} />
                      </strong>
                      <span className="text-[11px] font-medium text-emerald-400/75">g</span>
                    </span>
                    <span className="h-3 w-px bg-slate-700" aria-hidden="true" />
                    <span className={`${UNIT_ROW} text-amber-400`}>
                      <span className="text-slate-500">L</span>
                      <strong>
                        <RollingNumber value={dayTotals.fat} />
                      </strong>
                      <span className="text-[11px] font-medium text-amber-400/75">g</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* ==================== BOTTOM NAVIGATION ==================== */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800/80 bg-slate-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex min-h-14 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive
                    ? 'text-blue-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute inset-x-2 inset-y-1.5 rounded-2xl border border-blue-500/25 bg-blue-600/15"
                    transition={motionTokens.spring.morph}
                  />
                ) : null}
                <Icon
                  size={19}
                  strokeWidth={2.2}
                  className="relative z-10"
                />
                <span className="relative z-10 text-xs font-semibold">
                  {tab.label}
                </span>
              </button>
            );
          })}
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
    </div>
  );
}
