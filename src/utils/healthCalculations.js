/**
 * healthCalculations.js
 * Kumpulan formula medis & antropometri untuk kalkulator kesehatan Indonesia
 */

// 1. Perhitungan BMI (Body Mass Index)
export function calculateBMI(weightKg, heightCm) {
  if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

// 2. Kategori BMI berdasarkan Kemenkes RI & WHO untuk Populasi Asia Pasifik
export function getBMICategory(bmi) {
  if (bmi <= 0) {
    return {
      label: 'Belum Ada Data',
      tag: 'invalid',
      color: 'slate',
      badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      advice: 'Masukkan tinggi dan berat badanmu untuk melihat analisis.',
    };
  }
  if (bmi < 18.5) {
    return {
      label: 'Kekurangan Berat Badan (Underweight)',
      tag: 'underweight',
      color: 'amber',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      advice: 'Tubuhmu butuh lebih banyak asupan nutrisi berkualitas dan surplus kalori santai untuk menambah massa otot.',
    };
  }
  if (bmi < 23.0) {
    return {
      label: 'Berat Badan Ideal & Normal',
      tag: 'normal',
      color: 'emerald',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      advice: 'Proporsi tubuhmu mantap dan seimbang! Fokus utamanya menjaga stamina dan kebugaran fungsional.',
    };
  }
  if (bmi < 25.0) {
    return {
      label: 'Batas Normal Atas / Waspada',
      tag: 'warning',
      color: 'yellow',
      badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      advice: 'Masih dalam batas toleransi, tapi disarankan jaga pola makan agar tidak terus naik ke kategori overweight.',
    };
  }
  if (bmi < 30.0) {
    return {
      label: 'Kelebihan Berat Badan (Overweight)',
      tag: 'overweight',
      color: 'orange',
      badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      advice: 'Ada kelebihan lemak yang membebani sendi. Defisit kalori teratur dan olahraga rutin akan sangat membantu.',
    };
  }
  return {
    label: 'Kategori Obesitas',
    tag: 'obese',
    color: 'rose',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    advice: 'Sangat disarankan mulai defisit kalori terstruktur secara bertahap dan konsultasi dokter/nutrisionis.',
  };
}

// 3. Target Berat Badan Ideal Riil (Konkret dengan Selisih kg)
export function getWeightTargetAnalysis(weightKg, heightCm) {
  if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) {
    return {
      minIdealKg: 0,
      maxIdealKg: 0,
      targetOptimalKg: 0,
      diffKg: 0,
      statusMessage: '-',
      actionType: 'none',
    };
  }

  const heightM = heightCm / 100;
  const heightSq = heightM * heightM;

  // Rentang normal Asia Pasifik: 18.5 - 22.9 (atau WHO 18.5 - 24.9)
  // Untuk target yang sangat realistis bagi orang Indonesia, rentang 18.5 - 23.9
  const minIdealKg = Number((18.5 * heightSq).toFixed(1));
  const maxIdealKg = Number((23.9 * heightSq).toFixed(1));
  const targetOptimalKg = Number((21.5 * heightSq).toFixed(1)); // Titik seimbang optimal

  const diffKg = Number((weightKg - targetOptimalKg).toFixed(1));

  let statusMessage = '';
  let actionType = 'maintain'; // 'gain', 'lose', 'maintain'

  if (diffKg > 1.5) {
    actionType = 'lose';
    statusMessage = `Berat badan idealmu berada di rentang ${minIdealKg} kg – ${maxIdealKg} kg. Untuk mencapai titik ideal seimbang (BMI 21.5), target beratmu adalah sekitar ${targetOptimalKg} kg (kamu butuh menurunkan ~${Math.abs(diffKg)} kg).`;
  } else if (diffKg < -1.5) {
    actionType = 'gain';
    statusMessage = `Berat badan idealmu berada di rentang ${minIdealKg} kg – ${maxIdealKg} kg. Untuk mencapai titik ideal seimbang (BMI 21.5), target beratmu adalah sekitar ${targetOptimalKg} kg (kamu butuh menaikkan ~${Math.abs(diffKg)} kg).`;
  } else {
    actionType = 'maintain';
    statusMessage = `Selamat! Berat badanmu sudah berada di rentang ideal yang sangat seimbang (${minIdealKg} kg – ${maxIdealKg} kg). Targetmu adalah menjaga berat di sekitar ${targetOptimalKg} kg sambil memadatkan massa otot.`;
  }

  return {
    minIdealKg,
    maxIdealKg,
    targetOptimalKg,
    diffKg,
    statusMessage,
    actionType,
  };
}

// 4. Analisis Komparatif Usia vs Pertumbuhan (Standar Antropometri Indonesia / Riskesdas & WHO)
export function getAnthropometryAnalysis(age, gender, heightCm, weightKg) {
  let heightCategory = 'Rata-rata';
  let heightDetail = '';
  let weightCategory = 'Normal';
  let weightDetail = '';

  const isMale = gender === 'male';

  if (isMale) {
    if (age <= 16) {
      if (heightCm < 158) {
        heightCategory = 'Cenderung Pendek';
        heightDetail = 'Di bawah rata-rata remaja seusiamu. Lempeng pertumbuhan masih terbuka, optimalkan tidur dan nutrisi kalsium/protein!';
      } else if (heightCm <= 170) {
        heightCategory = 'Rata-rata Normal';
        heightDetail = 'Tinggi badanmu pas dengan rata-rata remaja Indonesia usia 15-16 tahun.';
      } else {
        heightCategory = 'Tinggi / Di Atas Rata-rata';
        heightDetail = 'Posturmu lebih tinggi dibandingkan kebanyakan teman seusiamu di Indonesia!';
      }
    } else {
      if (heightCm < 163) {
        heightCategory = 'Cenderung Pendek';
        heightDetail = 'Sedikit di bawah rata-rata pria dewasa Indonesia (~168 cm). Fokus perbaiki postur tubuh & core agar tampak tegap maksimal.';
      } else if (heightCm <= 174) {
        heightCategory = 'Rata-rata Nasional';
        heightDetail = 'Tinggi badanmu sangat khas dan proporsional untuk rata-rata pria dewasa Indonesia (164–174 cm).';
      } else {
        heightCategory = 'Tinggi / Di Atas Rata-rata';
        heightDetail = 'Posturmu termasuk jangkung untuk standar pria di Indonesia (>174 cm).';
      }
    }
  } else {
    // Wanita
    if (age <= 16) {
      if (heightCm < 148) {
        heightCategory = 'Cenderung Pendek';
        heightDetail = 'Di bawah rata-rata remaja putri seusiamu. Masih dalam masa pertumbuhan, perbanyak gerak aktif & makanan bergizi!';
      } else if (heightCm <= 160) {
        heightCategory = 'Rata-rata Normal';
        heightDetail = 'Tinggi badanmu sangat pas dengan rata-rata remaja putri seusiamu di Indonesia.';
      } else {
        heightCategory = 'Tinggi / Di Atas Rata-rata';
        heightDetail = 'Kamu tergolong tinggi untuk standar remaja putri di Indonesia!';
      }
    } else {
      if (heightCm < 151) {
        heightCategory = 'Cenderung Pendek';
        heightDetail = 'Sedikit di bawah rata-rata wanita dewasa Indonesia (~155 cm). Postur mungil & kompak.';
      } else if (heightCm <= 162) {
        heightCategory = 'Rata-rata Nasional';
        heightDetail = 'Tinggi badanmu ideal dan selaras dengan rata-rata wanita dewasa di Indonesia (151–162 cm).';
      } else {
        heightCategory = 'Tinggi / Di Atas Rata-rata';
        heightDetail = 'Posturmu di atas rata-rata wanita Indonesia (>162 cm), terlihat jenjang dan proporsional.';
      }
    }
  }

  // Analisis Berat Badan terhadap Tinggi & Usia
  const currentBMI = calculateBMI(weightKg, heightCm);
  if (currentBMI < 18.5) {
    weightCategory = 'Ringan / Kurus';
    weightDetail = 'Berat badanmu tergolong ringan untuk tinggi dan usiamu. Perlu tabungan kalori dan massa otot lebih padat.';
  } else if (currentBMI <= 23.9) {
    weightCategory = 'Normal & Seimbang';
    weightDetail = 'Bobot tubuhmu sangat pas dan proporsional dengan tinggi badan serta kelompok usiamu.';
  } else if (currentBMI <= 27.9) {
    weightCategory = 'Agak Berisi / Berat';
    weightDetail = 'Bobotmu lebih tinggi dari proporsi optimal. Bisa jadi campuran massa otot atau cadangan lemak yang berlebih.';
  } else {
    weightCategory = 'Terlalu Berat / Berlebih';
    weightDetail = 'Bobot tubuhmu jauh melampaui batas normal untuk usiamu. Disarankan mulai mengatur asupan dan aktivitas harian.';
  }

  return {
    heightCategory,
    heightDetail,
    weightCategory,
    weightDetail,
  };
}

// 5. Rumus BMR (Mifflin-St Jeor)
export function calculateBMR(gender, weightKg, heightCm, age) {
  if (!weightKg || !heightCm || !age) return 0;
  if (gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
}

// 6. Rumus TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(bmr, activityMultiplier) {
  return Math.round(bmr * activityMultiplier);
}

// 7. Strategi Kalori & Alokasi Makronutrien (Bulking / Cutting / Maintenance)
export function getStrategyDetails(selectedGoal, tdee, weightKg) {
  // Goal: 'bulking' | 'maintenance' | 'cutting'
  let targetCalories = tdee;
  let delta = 0;
  let title = '';
  let subtitle = '';
  let analogy = '';
  let badgeColor = '';

  if (selectedGoal === 'bulking') {
    delta = 350;
    targetCalories = tdee + delta;
    title = 'Bulking Sehat Terukur';
    subtitle = 'Surplus Kalori Bersih (+350 kkal/hari)';
    analogy = 'Ibarat nabung material bata untuk bangun rumah. Tubuh diberi sedikit surplus energi agar bisa membentuk jaringan otot baru tanpa menimbun lemak berlebih.';
    badgeColor = 'amber';
  } else if (selectedGoal === 'cutting') {
    delta = -450;
    targetCalories = Math.max(1200, tdee + delta);
    title = 'Cutting Aman & Efektif';
    subtitle = 'Defisit Kalori Terkendali (-450 kkal/hari)';
    analogy = 'Ibarat menghabiskan stok tabungan di kulkas. Tubuh dipaksa membakar cadangan lemak sebagai bahan bakar utama, tapi tetap diberi protein cukup agar otot tidak menyusut.';
    badgeColor = 'rose';
  } else {
    // maintenance
    delta = 0;
    targetCalories = tdee;
    title = 'Maintenance & Body Recomp';
    subtitle = 'Keseimbangan Kalori Stabil (0 kkal)';
    analogy = 'Ibarat menjaga mobil tetap prima sambil merapikan jok dan catnya. Berat timbangan dijaga stabil, namun komposisi lemak berkurang dan otot menjadi lebih kencang.';
    badgeColor = 'emerald';
  }

  // Alokasi Makronutrien yang ramah orang Indonesia (protein cukup, karbohidrat realistis, lemak sehat)
  let proteinG = 0;
  let fatG = 0;
  let carbsG = 0;

  if (selectedGoal === 'bulking') {
    proteinG = Math.round(weightKg * 1.8);
    const fatCalories = targetCalories * 0.25;
    fatG = Math.round(fatCalories / 9);
    const remainingCal = targetCalories - (proteinG * 4) - fatCalories;
    carbsG = Math.max(50, Math.round(remainingCal / 4));
  } else if (selectedGoal === 'cutting') {
    proteinG = Math.round(weightKg * 2.0); // protein tinggi untuk pertahankan otot saat defisit
    const fatCalories = targetCalories * 0.22;
    fatG = Math.round(fatCalories / 9);
    const remainingCal = targetCalories - (proteinG * 4) - fatCalories;
    carbsG = Math.max(50, Math.round(remainingCal / 4));
  } else {
    proteinG = Math.round(weightKg * 1.6);
    const fatCalories = targetCalories * 0.25;
    fatG = Math.round(fatCalories / 9);
    const remainingCal = targetCalories - (proteinG * 4) - fatCalories;
    carbsG = Math.max(50, Math.round(remainingCal / 4));
  }

  const proteinPct = Math.round(((proteinG * 4) / targetCalories) * 100);
  const fatPct = Math.round(((fatG * 9) / targetCalories) * 100);
  const carbsPct = Math.max(0, 100 - proteinPct - fatPct);

  return {
    targetCalories,
    delta,
    title,
    subtitle,
    analogy,
    badgeColor,
    macros: {
      proteinG,
      proteinPct,
      carbsG,
      carbsPct,
      fatG,
      fatPct,
    },
  };
}

// ===================== V2 NEW FUNCTIONS =====================

// 8. Mendapatkan string tanggal lokal YYYY-MM-DD
export function getLocalDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// 9. Menghitung streak latihan berturut-turut (dengan Streak Freeze di hari istirahat)
export function calculateWorkoutStreak(completedDates = [], restDayNumbers = [0, 3]) {
  const today = new Date();
  const todayStr = getLocalDateString(today);
  const todayDayNum = today.getDay(); // 0=Minggu, 3=Rabu
  const isRestDayToday = restDayNumbers.includes(todayDayNum);

  const completedSet = new Set(completedDates);
  let streak = 0;
  let cursor = new Date(today);

  // Mulai dari hari ini, mundur ke belakang
  for (let i = 0; i < 365; i++) {
    const cursorStr = getLocalDateString(cursor);
    const cursorDayNum = cursor.getDay();
    const isRestDay = restDayNumbers.includes(cursorDayNum);

    if (isRestDay) {
      // Hari istirahat: streak tidak bertambah tapi tidak putus (Streak Freeze)
      // Lanjut ke hari sebelumnya
    } else {
      // Hari latihan: harus ada di completedDates
      if (completedSet.has(cursorStr)) {
        streak++;
      } else {
        // Jika ini hari ini dan belum check-in, jangan langsung putus
        if (i === 0) {
          // Hari ini belum selesai, periksa kemarin
        } else {
          break; // Streak putus
        }
      }
    }

    // Mundur 1 hari
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    streak,
    hasStreakFreeze: isRestDayToday,
  };
}

// 10. Mengalikan makronutrien makanan sesuai target kalori pengguna
export function scaleMealToTarget(meal, dailyTargetCalories, baseDailyCalories) {
  if (!baseDailyCalories || baseDailyCalories <= 0) {
    return { ...meal, portionNote: 'Porsi standar (sesuai resep asli)' };
  }

  const ratio = dailyTargetCalories / baseDailyCalories;

  let portionNote = '';
  if (ratio > 1.05) {
    portionNote = `Porsi ${ratio.toFixed(1)}x (+${Math.round((ratio - 1) * 100)}% takaran nasi & protein)`;
  } else if (ratio < 0.95) {
    portionNote = `Porsi ${ratio.toFixed(2)}x (Kurangi sedikit porsi karbohidrat)`;
  } else {
    portionNote = 'Porsi standar (sesuai resep asli)';
  }

  return {
    ...meal,
    calories: Math.round(meal.calories * ratio),
    protein: Math.round(meal.protein * ratio),
    carbs: Math.round(meal.carbs * ratio),
    fat: Math.round(meal.fat * ratio),
    portionNote,
  };
}
