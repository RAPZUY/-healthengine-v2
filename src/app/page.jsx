'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Bot,
  CalendarCheck2,
  CheckCircle2,
  Dumbbell,
  Flame,
  Home,
  LockKeyhole,
  Moon,
  ReceiptText,
  RefreshCw,
  Sparkles,
  Timer,
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
  sumMealPriceEstimate,
  formatRupiah,
} from '@/utils/healthCalculations';
import { WEEKLY_MEALS, BASE_DAILY_CALORIES, DAILY_FRUITS } from '@/data/nutritionData';
import { WORKOUT_SCHEDULE, EQUIPMENT_LIST } from '@/data/workoutData';
import BiometricModal from '@/components/BiometricModal';
import MartialArtsSection from '@/components/MartialArtsSection';
import RunningTrackerSection from '@/components/RunningTrackerSection';
import WeightProgressCard from '@/components/WeightProgressCard';
import InstallPwaBanner from '@/components/InstallPwaBanner';
import UpdateBannerV42 from '@/components/UpdateBannerV42';
import TodoCalendar from '@/components/ui/TodoCalendar';
import ExpandableCard from '@/components/ui/ExpandableCard';
import {
  ExerciseVectorPanel,
  ExercisePosturePanel,
  ExerciseMuscleMapPanel,
} from '@/components/ExerciseDetailPanel';
import ThemeSwitcher, {
  ACCENTS,
  DEFAULT_ACCENT_ID,
  applyThemeToDocument,
} from '@/components/ui/ThemeSwitcher';
import SwipeToVerify from '@/components/ui/SwipeToVerify';
import ExerciseTimer from '@/components/ui/ExerciseTimer';
import { ToastProvider, useToast } from '@/components/ui/ToastProvider';
import {
  motionTokens,
  MorphingText,
  RollingNumber,
} from '@/components/ui/motion-primitives';

// Versi rilis tampilan — samakan dengan CACHE_NAME di public/sw.js.
const APP_VERSION = '4.2';

// Permukaan kartu V4: token semantik, bukan warna gelap hard-coded.
const CARD_SURFACE = 'surface-card rounded-2xl';
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
  const [workoutSubTab, setWorkoutSubTab] = useState('muscle'); // 'muscle' | 'martial' | 'running'
  const [activeExerciseSlot, setActiveExerciseSlot] = useState(null);
  const [activeMealIndex, setActiveMealIndex] = useState(null);
  const [themeMode, setThemeMode] = useState('dark');
  const [accentId, setAccentId] = useState(DEFAULT_ACCENT_ID);
  const [skipFruit, setSkipFruit] = useState(false);
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [ownedEquipment, setOwnedEquipment] = useState(['bodyweight']);
  const [completedDates, setCompletedDates] = useState([]);
  const [swappedSlots, setSwappedSlots] = useState({});
  const [weightHistory, setWeightHistory] = useState([]);
  const [verifiedExercises, setVerifiedExercises] = useState({});
  const [runningHistory, setRunningHistory] = useState([]);
  const [selectedDayName, setSelectedDayName] = useState(getTodayDayName());
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());
  const [budgetTier, setBudgetTier] = useState('budget');
  // Satu timer saja yang boleh menyala dalam satu waktu, di level induk.
  const [activeTimer, setActiveTimer] = useState(null);

  // Modal state
  const [showBioModal, setShowBioModal] = useState(false);

  // ==================== PERSISTENCE ====================
  useEffect(() => {
    try {
      const v4Data = localStorage.getItem('healtyapp_v4_state');
      const v3Data = localStorage.getItem('healtyapp_v3_state');
      const v2Data = localStorage.getItem('healtyapp_v2_state');
      const savedData = v4Data || v3Data || v2Data;

      if (savedData) {
        const parsed = JSON.parse(savedData);
        const nextTheme = parsed.themeMode === 'light' ? 'light' : 'dark';
        const nextAccent = ACCENTS.some(
          (accent) => accent.id === parsed.accentId
        )
          ? parsed.accentId
          : DEFAULT_ACCENT_ID;

        /* eslint-disable react-hooks/set-state-in-effect -- localStorage is only readable after hydration; this sets the persisted snapshot once */
        setThemeMode(nextTheme);
        setAccentId(nextAccent);
        applyThemeToDocument(nextTheme, nextAccent);
        if (parsed.bio) setBio({ ...DEFAULT_BIO, ...parsed.bio });
        if (parsed.ownedEquipment) setOwnedEquipment(parsed.ownedEquipment);
        if (parsed.completedDates) setCompletedDates(parsed.completedDates);
        if (parsed.swappedSlots) setSwappedSlots(parsed.swappedSlots);
        if (parsed.weightHistory) setWeightHistory(parsed.weightHistory);
        if (parsed.budgetTier) setBudgetTier(parsed.budgetTier);
        if (parsed.skipFruit !== undefined) setSkipFruit(parsed.skipFruit);
        if (
          parsed.verifiedExercises &&
          typeof parsed.verifiedExercises === 'object'
        ) {
          setVerifiedExercises(parsed.verifiedExercises);
        }
        if (Array.isArray(parsed.runningHistory)) {
          setRunningHistory(parsed.runningHistory);
        }
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

  // Timer yang ditinggal bersama kartunya tidak boleh mengunci gerakan lain.
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- the guard must not outlive the card that owns it */
    setActiveTimer(null);
  }, [selectedDate, selectedDayName, workoutSubTab, activeTab]);

  // Apply the selected theme + accent to the document root.
  useEffect(() => {
    if (!isLoaded) return;
    applyThemeToDocument(themeMode, accentId);
  }, [themeMode, accentId, isLoaded]);

  // Auto-save (V4 snapshot; V3 remains readable for migration).
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        'healtyapp_v4_state',
        JSON.stringify({
          themeMode,
          accentId,
          bio,
          ownedEquipment,
          completedDates,
          swappedSlots,
          weightHistory,
          verifiedExercises,
          runningHistory,
          budgetTier,
          skipFruit,
        })
      );
    } catch (err) {
      console.warn('Gagal menyimpan:', err);
    }
  }, [
    themeMode,
    accentId,
    bio,
    ownedEquipment,
    completedDates,
    swappedSlots,
    weightHistory,
    verifiedExercises,
    runningHistory,
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

  // Verification progress for the selected date, keyed per workout slot.
  const verifiedForDate = verifiedExercises[selectedDate] ?? [];
  const totalExercises = currentDayData.isRestDay
    ? 0
    : currentDayData.slots.length;
  const verifiedCount = currentDayData.isRestDay
    ? 0
    : currentDayData.slots.reduce(
        (count, _slot, index) =>
          count + (verifiedForDate.includes(index) ? 1 : 0),
        0
      );
  const allExercisesVerified =
    totalExercises === 0 || verifiedCount === totalExercises;

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
    setActiveExerciseSlot(null);
    setActiveMealIndex(null);
  }, []);

  const handleSelectDayName = useCallback(
    (dayName) => {
      setSelectedDayName(dayName);
      setActiveExerciseSlot(null);
      setActiveMealIndex(null);
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

    // A swapped movement is a different movement: require a fresh swipe.
    setVerifiedExercises((previous) => {
      const current = previous[selectedDate] ?? [];
      if (!current.includes(slotIndex)) return previous;
      return {
        ...previous,
        [selectedDate]: current.filter((index) => index !== slotIndex),
      };
    });

    toast({
      tone: 'neutral',
      text: 'Variasi gerakan diganti',
      description: `${nextVariation.name} · ${dayName} · ${nextVariation.setsReps}. Verifikasi ulang gerakan ini.`,
      icon: <RefreshCw size={17} strokeWidth={2.2} />,
    });
  };

  const handleVerifyExercise = (slotIndex, nextVerified) => {
    const dateKey = selectedDate;
    setVerifiedExercises((previous) => {
      const current = new Set(previous[dateKey] ?? []);
      if (nextVerified) current.add(slotIndex);
      else current.delete(slotIndex);
      return {
        ...previous,
        [dateKey]: [...current].sort((a, b) => a - b),
      };
    });

    if (nextVerified) {
      const nextCount = new Set([...verifiedForDate, slotIndex]).size;
      if (nextCount >= totalExercises) {
        toast({
          tone: 'success',
          text: 'Semua gerakan terverifikasi',
          description:
            'Kamu bisa menekan "Selesaikan Latihan Hari Ini" untuk mengunci streak.',
          icon: <Trophy size={17} strokeWidth={2.2} />,
        });
      }
    }
  };

  const handleSaveRun = (entry) => {
    setRunningHistory((previous) => [entry, ...previous].slice(0, 30));
  };

  // ==================== SINGLE-TIMER GUARD ====================
  // Hanya satu timer yang boleh berjalan. Timer kedua ditolak, lalu pengguna
  // diberi tahu timer mana yang masih menyala beserta sisa waktunya.
  const handleTimerStart = useCallback(
    ({ exerciseId, exerciseName, mode, duration, endAt }) => {
      const now = Date.now();

      if (activeTimer) {
        const stillRunning = activeTimer.endTime > now;
        if (stillRunning) {
          const elapsedSeconds = Math.max(
            0,
            Math.floor((now - activeTimer.startedAt) / 1000)
          );
          const remainingSeconds = Math.max(
            0,
            Math.ceil((activeTimer.endTime - now) / 1000)
          );

          toast({
            tone: 'warning',
            text: `Timer ${activeTimer.exerciseName} sedang berjalan`,
            description: `(${elapsedSeconds} detik telah berjalan, sisa ${remainingSeconds} detik). Selesaikan atau reset timer tersebut dulu!`,
            icon: <Timer size={17} strokeWidth={2.2} />,
            duration: 6500,
          });
          return false;
        }
      }

      setActiveTimer({
        exerciseId,
        exerciseName,
        mode,
        duration,
        startedAt: now,
        endTime: endAt,
        running: true,
      });
      return true;
    },
    [activeTimer, toast]
  );

  const handleTimerStop = useCallback((exerciseId) => {
    setActiveTimer((previous) =>
      previous && previous.exerciseId === exerciseId ? null : previous
    );
  }, []);

  const handleTimerReset = useCallback((exerciseId) => {
    setActiveTimer((previous) =>
      previous && previous.exerciseId === exerciseId ? null : previous
    );
  }, []);

  const handleTimerExtend = useCallback((exerciseId, endTime) => {
    setActiveTimer((previous) =>
      previous && previous.exerciseId === exerciseId
        ? { ...previous, endTime }
        : previous
    );
  }, []);

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

    if (!allExercisesVerified) {
      const missingExercises = currentDayData.slots
        .map((slot, index) => ({
          index,
          variation: getActiveVariation(selectedDayName, index, slot).variation,
        }))
        .filter(({ index }) => !verifiedForDate.includes(index))
        .map(({ variation }) => variation.name);

      toast({
        tone: 'warning',
        text: `Verifikasi semua gerakan dulu (${verifiedCount}/${totalExercises} selesai)`,
        description: `Belum digeser: ${missingExercises.join(', ')}.`,
        icon: <LockKeyhole size={17} strokeWidth={2.2} />,
        duration: 7000,
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
      description: `${currentDayData.title} tercatat selesai dengan ${verifiedCount} gerakan terverifikasi. Streak latihanmu sekarang ${nextStreak.streak} hari.`,
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

  // Total harga dihitung dari angka yang sama yang dicetak di tiap kartu.
  const dayTotalCost = useMemo(
    () => sumMealPriceEstimate(dayMeals),
    [dayMeals]
  );

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
      title: `Target Nutrisi Harian: ${strategy.targetCalories} kkal`,
      calories: strategy.targetCalories,
      protein: strategy.macros.proteinG,
      carbs: strategy.macros.carbsG,
      fat: strategy.macros.fatG,
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
        className="app-aurora pointer-events-none absolute inset-x-0 top-0 h-72"
      />

      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-gradient-to-b from-slate-950/95 to-slate-950/75 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-2 px-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-lg shadow-black/25"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, var(--accent-color), var(--accent-strong))',
                color: 'var(--accent-contrast)',
              }}
            >
              ⚡
            </div>
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-sm font-bold text-slate-100">
                HealthEngine
              </span>
              <span className="accent-pill shrink-0 rounded-md px-1.5 py-0.5 font-mono text-xs font-semibold">
                V{APP_VERSION}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <div className="hidden min-[360px]:flex items-center rounded-full border border-slate-800/80 bg-slate-900/60 px-2.5 py-1.5 text-slate-300">
              <span className="text-xs font-semibold">
                <MorphingText value={activeTabLabel} />
              </span>
            </div>
            <ThemeSwitcher
              themeMode={themeMode}
              accentId={accentId}
              onThemeModeChange={setThemeMode}
              onAccentChange={setAccentId}
            />
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
              {/* Banner pengumuman rilis V4.2 — paling atas Beranda */}
              <UpdateBannerV42 />

              <TodoCalendar
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                items={agendaItems}
                onItemClick={handleAgendaItemClick}
                locale="id-ID"
                weekStartsOn={1}
                addTodoAction={
                  <div
                    className="contrast-chip flex min-h-11 shrink-0 items-center gap-1 rounded-full px-2 font-bold shadow-sm sm:px-2.5"
                    title={`Streak latihan ${streak.streak} hari`}
                    aria-label={`Streak latihan ${streak.streak} hari`}
                  >
                    <Flame
                      size={14}
                      strokeWidth={2.4}
                      aria-hidden="true"
                      className="text-amber-400"
                    />
                    <span className={`${UNIT_ROW} text-xs font-bold text-amber-400`}>
                      <RollingNumber value={streak.streak} />
                      <span className="text-[11px] font-medium text-amber-400/80">
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
                    className="surface-chip min-h-11 rounded-xl px-3.5 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600"
                  >
                    Edit Profil
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="surface-inset rounded-xl p-3.5">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Tinggi
                    </span>
                    <span className={`${UNIT_ROW} mt-1 font-mono text-lg font-bold text-slate-100`}>
                      <RollingNumber value={bio.heightCm} />
                      <span className="text-xs font-medium text-slate-400">cm</span>
                    </span>
                  </div>
                  <div className="surface-inset rounded-xl p-3.5">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Berat
                    </span>
                    <span className={`${UNIT_ROW} mt-1 font-mono text-lg font-bold text-slate-100`}>
                      <RollingNumber value={bio.weightKg} maximumFractionDigits={1} />
                      <span className="text-xs font-medium text-slate-400">kg</span>
                    </span>
                  </div>
                  <div className="surface-inset rounded-xl p-3.5">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      Usia
                    </span>
                    <span className={`${UNIT_ROW} mt-1 font-mono text-lg font-bold text-slate-100`}>
                      <RollingNumber value={bio.age} />
                      <span className="text-xs font-medium text-slate-400">tahun</span>
                    </span>
                  </div>
                  <div className="surface-inset rounded-xl p-3.5">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      BMI
                    </span>
                    <span className={`${UNIT_ROW} mt-1 font-mono text-lg font-bold text-slate-100`}>
                      <RollingNumber value={bmi} maximumFractionDigits={1} />
                      <span className="text-xs font-medium text-slate-400">kg/m²</span>
                    </span>
                  </div>
                </div>

                {/* BMI Badge */}
                <div
                  className={`surface-inset mt-4 rounded-xl border px-3.5 py-2.5 text-xs font-medium leading-relaxed ${bmiCategory.badgeClass}`}
                >
                  {bmiCategory.label} — {bmiCategory.advice}
                </div>

                {/* Target & Strategy */}
                <div className="mt-4 grid grid-cols-3 gap-2.5 text-xs">
                  <div className="surface-inset rounded-xl p-3 text-center">
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
                  <div className="surface-inset rounded-xl p-3 text-center">
                    <span className="block text-[11px] text-slate-500">TDEE</span>
                    <span className={`${UNIT_ROW} mt-1 justify-center font-mono text-sm font-bold text-blue-400`}>
                      <RollingNumber value={tdee} />
                      <span className="text-[11px] font-medium text-blue-400/75">kkal</span>
                    </span>
                  </div>
                  <div className="surface-inset rounded-xl p-3 text-center">
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
              {/* Sub-navigasi 3 modul: dua di atas, lari di tengah bawah */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'muscle', label: 'Pembentukan Otot', icon: '🏋️' },
                    { id: 'martial', label: 'Bela Diri Praktis', icon: '🥊' },
                  ].map((subTab) => {
                    const isActive = workoutSubTab === subTab.id;
                    return (
                      <button
                        key={subTab.id}
                        type="button"
                        onClick={() => setWorkoutSubTab(subTab.id)}
                        aria-pressed={isActive}
                        className={`flex min-h-14 items-center justify-center gap-1.5 rounded-2xl border px-2.5 text-[11px] font-bold leading-tight transition-colors ${
                          isActive
                            ? 'accent-solid'
                            : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-slate-100'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-base"
                        >
                          {subTab.icon}
                        </span>
                        <span className="min-w-0 text-center">{subTab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setWorkoutSubTab('running')}
                    aria-pressed={workoutSubTab === 'running'}
                    className={`flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-6 text-xs font-bold transition-colors ${
                      workoutSubTab === 'running'
                        ? 'accent-solid'
                        : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-slate-100'
                    }`}
                  >
                    <span aria-hidden="true" className="text-base">
                      🏃
                    </span>
                    <span>Latihan Lari &amp; Pace</span>
                  </button>
                </div>
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
                              ? 'border-transparent text-[var(--accent-contrast)]'
                              : isRest
                                ? 'border-amber-500/25 bg-amber-500/10 text-amber-400'
                                : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {isSelected ? (
                            <motion.span
                              layoutId="workout-day-active"
                              className="accent-solid absolute inset-0 rounded-xl shadow-lg"
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
                    <h2 className="text-lg font-bold text-slate-100">
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
                            className="surface-chip rounded-md px-2 py-0.5 text-xs font-medium text-slate-300"
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
                              key={`${selectedDate}-${slotIndex}`}
                              expanded={activeExerciseSlot === slotIndex}
                              onToggle={() =>
                                setActiveExerciseSlot((previous) =>
                                  previous === slotIndex ? null : slotIndex
                                )
                              }
                              expandLabel={`Buka detail ${variation.name}`}
                              collapseLabel={`Tutup detail ${variation.name}`}
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
                                    className="surface-chip flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-xl px-2.5 font-mono text-xs font-semibold text-blue-400 transition-colors hover:border-blue-500/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
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

                                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs">
                                    <span className={UNIT_ROW}>
                                      <span className="font-semibold text-emerald-400">
                                        {variation.setsReps}
                                      </span>
                                    </span>
                                    <span
                                      className="h-3 w-px bg-slate-700"
                                      aria-hidden="true"
                                    />
                                    <span className={UNIT_ROW}>
                                      <span className="text-slate-500">Rest</span>
                                      <span className="font-semibold text-amber-400">
                                        {variation.rest}
                                      </span>
                                    </span>
                                    {verifiedForDate.includes(slotIndex) ? (
                                      <span className="surface-chip inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-[10px] font-bold text-emerald-400">
                                        <CheckCircle2
                                          size={12}
                                          strokeWidth={2.6}
                                          aria-hidden="true"
                                        />
                                        Terverifikasi
                                      </span>
                                    ) : null}
                                  </div>
                                </>
                              }
                            >
                              <div className="space-y-5 pt-1">
                                {/* 1. Vektor biomekanika 2 fase */}
                                <ExerciseVectorPanel exercise={variation} />
                                {/* 2. Kesalahan postur, tepat di bawah vektor */}
                                <ExercisePosturePanel exercise={variation} />
                                {/* 3. Peta anatomi otot aktif */}
                                <ExerciseMuscleMapPanel exercise={variation} />
                                {/* 4. Timer latihan & istirahat */}
                                <ExerciseTimer
                                  key={variation.id}
                                  exercise={variation}
                                  timerState={activeTimer}
                                  onTimerStart={handleTimerStart}
                                  onTimerStop={handleTimerStop}
                                  onTimerReset={handleTimerReset}
                                  onTimerExtend={handleTimerExtend}
                                />
                                {/* 5. Slider verifikasi */}
                                <SwipeToVerify
                                  verified={verifiedForDate.includes(
                                    slotIndex
                                  )}
                                  onVerifiedChange={(nextVerified) =>
                                    handleVerifyExercise(
                                      slotIndex,
                                      nextVerified
                                    )
                                  }
                                  label={variation.name}
                                />
                              </div>
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
                    <div className={`${CARD_SURFACE} space-y-4 p-5 sm:p-6`}>
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
                              : allExercisesVerified
                                ? 'Siap diselesaikan'
                                : 'Menunggu verifikasi'}
                          </p>
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            isSelectedDateCompleted
                              ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
                              : allExercisesVerified
                                ? 'accent-pill'
                                : 'surface-chip text-slate-400'
                          }`}
                        >
                          {isSelectedDateCompleted
                            ? '✓ Tuntas'
                            : `${verifiedCount}/${totalExercises} gerakan`}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <span className="font-semibold text-slate-400">
                            Gerakan terverifikasi
                          </span>
                          <span className="accent-text font-mono font-bold">
                            {verifiedCount}/{totalExercises}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: 'var(--app-selected-bg)' }}
                            animate={{
                              width: `${
                                totalExercises > 0
                                  ? (verifiedCount / totalExercises) * 100
                                  : 0
                              }%`,
                            }}
                            transition={motionTokens.spring.smooth}
                          />
                        </div>
                      </div>

                      <motion.button
                        type="button"
                        onClick={handleToggleWorkoutComplete}
                        whileTap={reduce ? undefined : { scale: 0.98 }}
                        transition={motionTokens.spring.smooth}
                        aria-disabled={
                          !isSelectedDateCompleted && !allExercisesVerified
                        }
                        className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-center text-sm font-bold transition ${
                          isSelectedDateCompleted
                            ? 'border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/15'
                            : allExercisesVerified
                              ? 'accent-solid shadow-lg shadow-black/20'
                              : 'surface-chip text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {isSelectedDateCompleted ? (
                          'Batalkan Status Selesai'
                        ) : allExercisesVerified ? (
                          selectedDate === todayStr ? (
                            'Selesaikan Latihan Hari Ini'
                          ) : (
                            'Tandai Latihan Selesai'
                          )
                        ) : (
                          <>
                            <LockKeyhole
                              size={15}
                              strokeWidth={2.4}
                              aria-hidden="true"
                            />
                            <span className="flex flex-col items-center leading-tight">
                              <span>Verifikasi Semua Gerakan Dulu</span>
                              <span className="font-mono text-[11px] font-semibold opacity-80">
                                ({verifiedCount}/{totalExercises} Selesai)
                              </span>
                            </span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 2: Modul Bela Diri Praktis */}
              {workoutSubTab === 'martial' && <MartialArtsSection />}

              {/* Sub-tab 3: Latihan Lari & Pace */}
              {workoutSubTab === 'running' && (
                <RunningTrackerSection
                  weightKg={bio.weightKg}
                  runningHistory={runningHistory}
                  onSaveRun={handleSaveRun}
                />
              )}
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
                          ? 'border-transparent text-[var(--accent-contrast)]'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isSelected ? (
                        <motion.span
                          layoutId="meal-day-active"
                          className="accent-solid absolute inset-0 rounded-xl shadow-lg"
                          transition={motionTokens.spring.morph}
                        />
                      ) : null}
                      <span className="relative z-10">{day.slice(0, 3)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Budget Filter */}
              <div className="surface-card relative flex rounded-2xl p-1">
                {[
                  { id: 'budget', label: '💰 Anak Kos' },
                  { id: 'standard', label: '🍱 Standar' },
                ].map((tier) => {
                  const isActive = budgetTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setBudgetTier(tier.id)}
                      className={`relative min-h-11 flex-1 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'text-[var(--app-selected-fg)]'
                          : 'text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="meal-budget-active"
                          className="accent-solid absolute inset-0 rounded-xl shadow-lg"
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
                    className={`surface-chip rounded-md px-2 py-0.5 text-xs font-bold ${
                      activeGoal === 'bulking'
                        ? 'text-amber-400'
                        : activeGoal === 'cutting'
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                    }`}
                  >
                    {strategy.title}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="surface-inset rounded-xl p-2.5">
                    <span className="block text-slate-500">Kalori</span>
                    <span className={`${UNIT_ROW} mt-1 justify-center text-slate-100`}>
                      <span className="font-mono text-sm font-bold">
                        <RollingNumber value={strategy.targetCalories} />
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">kkal</span>
                    </span>
                  </div>
                  <div className="surface-inset rounded-xl p-2.5">
                    <span className="block text-blue-400">Protein</span>
                    <span className={`${UNIT_ROW} mt-1 justify-center font-mono text-blue-400`}>
                      <span className="text-sm font-bold">
                        <RollingNumber value={strategy.macros.proteinG} />
                      </span>
                      <span className="text-[11px] font-medium text-blue-400/75">g</span>
                    </span>
                  </div>
                  <div className="surface-inset rounded-xl p-2.5">
                    <span className="block text-emerald-400">Karbo</span>
                    <span className={`${UNIT_ROW} mt-1 justify-center font-mono text-emerald-400`}>
                      <span className="text-sm font-bold">
                        <RollingNumber value={strategy.macros.carbsG} />
                      </span>
                      <span className="text-[11px] font-medium text-emerald-400/75">g</span>
                    </span>
                  </div>
                  <div className="surface-inset rounded-xl p-2.5">
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
                        <h4 className="text-sm font-bold text-slate-100">
                          {activeFruit.name}
                        </h4>
                      </div>
                    </div>
                    <span
                      className={`surface-chip rounded-md px-2 py-0.5 text-xs font-semibold ${
                        skipFruit ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {skipFruit ? 'Kalori Dialihkan' : 'Jatah Aktif'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="surface-inset rounded-xl p-3">
                      <span className="block text-slate-500">Takaran URT</span>
                      <span className="mt-1 block font-semibold text-slate-200">
                        {activeFruit.householdPortion}
                      </span>
                    </div>
                    <div className="surface-inset rounded-xl p-3">
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
                        ? 'surface-chip text-emerald-400'
                        : 'surface-chip text-amber-400'
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
                  ].map(({ key, label, meal }, mealIndex) => (
                    <ExpandableCard
                      key={key}
                      expanded={activeMealIndex === mealIndex}
                      onToggle={() =>
                        setActiveMealIndex((previous) =>
                          previous === mealIndex ? null : mealIndex
                        )
                      }
                      expandLabel={`Buka detail menu ${meal.name}`}
                      collapseLabel={`Tutup detail menu ${meal.name}`}
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
                              <strong className="text-sm font-bold text-slate-100">
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
                          <div className="surface-inset rounded-xl p-3.5">
                            <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                              Estimasi Harga
                            </span>
                            <span className="mt-1 block font-mono text-base font-bold text-emerald-400">
                              {formatRupiah(meal.priceEstimateIdr)}
                            </span>
                          </div>
                          <div className="surface-inset rounded-xl p-3.5">
                            <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                              Waktu Olah
                            </span>
                            <span className="mt-1 block text-sm font-semibold text-slate-200">
                              {meal.prepTime || '15 menit'}
                            </span>
                          </div>
                        </div>

                        <div className="surface-inset rounded-xl p-4">
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
                              <p className="surface-chip mt-2 inline-block rounded px-2 py-1 text-[11px] font-semibold text-amber-400">
                                📏 {meal.portionNote}
                              </p>
                            )}
                        </div>

                        {key === 'snack' && skipFruit ? (
                          <div className="surface-inset flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-amber-400">
                            <span aria-hidden="true">✨</span>
                            <span>
                              +Kalori dialihkan dari jatah buah (+
                              {activeFruit.calories} kkal)
                            </span>
                          </div>
                        ) : null}

                        <div className="surface-inset rounded-xl p-4">
                          <h5 className="mb-1.5 text-xs font-bold text-slate-300">
                            Bahan &amp; Komposisi
                          </h5>
                          <p className="text-xs leading-relaxed text-slate-300">
                            {meal.ingredients}
                          </p>
                        </div>

                        <div className="surface-inset rounded-xl p-4">
                          <h5 className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            💡 Tips Pengolahan Sehat
                          </h5>
                          <p className="text-xs leading-relaxed text-slate-300">
                            {meal.cookTip}
                          </p>
                        </div>

                        {meal.benefits ? (
                          <div className="surface-inset rounded-xl p-4">
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
                <div className={`${CARD_SURFACE} p-4`}>
                  <div className="text-center">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Total Hari Ini
                    </span>
                    <div className="mt-2 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 font-mono text-xs">
                      <span className={UNIT_ROW}>
                        <strong className="text-base font-bold text-slate-100">
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

                  <div className="mt-3 flex items-start justify-between gap-3 border-t border-[var(--app-card-border)] pt-3">
                    <span className="inline-flex min-w-0 items-start gap-1.5 text-[11px] font-semibold leading-snug text-slate-400">
                      <ReceiptText
                        size={13}
                        strokeWidth={2.4}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0"
                      />
                      Total Estimasi Pengeluaran Hari Ini
                    </span>
                    <span className="shrink-0 font-mono text-sm font-bold text-emerald-400">
                      {formatRupiah(dayTotalCost)}
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
                    ? 'accent-text'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="accent-pill absolute inset-x-2 inset-y-1.5 rounded-2xl"
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
