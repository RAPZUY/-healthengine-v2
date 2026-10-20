'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Activity, Ruler, Scale, Target, UserRound, X } from 'lucide-react';
import NumberInput from '@/components/ui/NumberInput';
import { motionTokens } from '@/components/ui/motion-primitives';
import { useToast } from '@/components/ui/ToastProvider';

const ACTIVITY_OPTIONS = [
  { multiplier: 1.2, title: 'Hampir Nggak Pernah Olahraga', desc: 'Rebahan / duduk seharian' },
  { multiplier: 1.375, title: 'Gerak Ringan Santai', desc: 'Jalan kaki harian, olahraga 1-2x seminggu' },
  { multiplier: 1.55, title: 'Aktif Sedang', desc: 'Olahraga 3-4x seminggu' },
  { multiplier: 1.725, title: 'Sangat Aktif / Atlet', desc: 'Latihan 5-6 hari seminggu' },
];

const STRATEGY_OPTIONS = [
  { id: 'auto', label: 'Otomatis', activeClass: 'bg-blue-600 text-white' },
  { id: 'bulking', label: 'Bulking', activeClass: 'bg-amber-600 text-white' },
  { id: 'maintenance', label: 'Maintenance', activeClass: 'bg-emerald-600 text-white' },
  { id: 'cutting', label: 'Cutting', activeClass: 'bg-rose-600 text-white' },
];

export default function BiometricModal({ biometrics, onSave, onClose }) {
  const reduce = useReducedMotion();
  const { toast } = useToast();

  const [gender, setGender] = useState(biometrics.gender || 'male');
  const [age, setAge] = useState(Number(biometrics.age) || 20);
  const [heightCm, setHeightCm] = useState(Number(biometrics.heightCm) || 168);
  const [weightKg, setWeightKg] = useState(Number(biometrics.weightKg) || 60);
  const [activityLevel, setActivityLevel] = useState(
    biometrics.activityLevel || 1.375
  );
  const [strategyMode, setStrategyMode] = useState(
    biometrics.strategyMode || 'auto'
  );

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSave = () => {
    const finalAge = Math.max(14, Math.min(80, Math.round(Number(age) || 20)));
    const finalHeight = Math.max(
      120,
      Math.min(220, Math.round(Number(heightCm) || 168))
    );
    const finalWeight = Math.max(
      30,
      Math.min(180, Number((Number(weightKg) || 60).toFixed(1)))
    );

    toast({
      tone: 'success',
      text: 'Profil Biometrik Disimpan!',
      description: `Usia ${finalAge} th · Tinggi ${finalHeight} cm · Berat ${finalWeight} kg. Riwayat perkembangan sudah diperbarui.`,
      duration: 5600,
    });

    onSave({
      gender,
      age: finalAge,
      heightCm: finalHeight,
      weightKg: finalWeight,
      activityLevel,
      strategyMode,
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      initial={reduce ? { opacity: 0 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionTokens.duration.fast }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        transition={motionTokens.spring.morph}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/95 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <UserRound size={18} strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Edit Profil Biometrik
              </h2>
              <p className="text-xs text-slate-500">
                Data ini dipakai untuk BMI, TDEE, dan target kalori.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Tutup"
          >
            <X size={18} strokeWidth={2.3} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-4">
          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Jenis Kelamin
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`min-h-11 rounded-xl text-sm font-semibold transition ${
                  gender === 'male'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30'
                    : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                ♂ Pria
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`min-h-11 rounded-xl text-sm font-semibold transition ${
                  gender === 'female'
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-950/30'
                    : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                ♀ Wanita
              </button>
            </div>
          </div>

          {/* Numeric fields */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Ruler size={14} className="text-blue-400" />
              Antropometri
            </div>

            <NumberInput
              label="Usia"
              value={age}
              onChange={setAge}
              min={14}
              max={80}
              step={1}
              unit="tahun"
              minError="Usia minimal 14 tahun agar perhitungan tetap relevan."
              maxError="Usia maksimal 80 tahun untuk kalkulator ini."
            />

            <NumberInput
              label="Tinggi Badan"
              value={heightCm}
              onChange={setHeightCm}
              min={120}
              max={220}
              step={1}
              unit="cm"
              minError="Tinggi minimal 120 cm."
              maxError="Tinggi maksimal 220 cm."
            />

            <NumberInput
              label="Berat Badan"
              value={weightKg}
              onChange={setWeightKg}
              min={30}
              max={180}
              step={0.5}
              unit="kg"
              minError="Berat minimal 30 kg."
              maxError="Berat maksimal 180 kg."
            />
          </div>

          {/* Activity Level */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Activity size={14} className="text-emerald-400" />
              Aktivitas Fisik
            </div>
            <div className="space-y-1.5">
              {ACTIVITY_OPTIONS.map((option) => (
                <button
                  key={option.multiplier}
                  type="button"
                  onClick={() => setActivityLevel(option.multiplier)}
                  className={`w-full min-h-11 rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                    activityLevel === option.multiplier
                      ? 'border-blue-500/60 bg-blue-600/15 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold">{option.title}</span>
                  <span className="ml-2 text-slate-500">
                    ×{option.multiplier}
                  </span>
                  <span className="mt-0.5 block text-slate-500">
                    {option.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Strategy Mode */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Target size={14} className="text-amber-400" />
              Mode Strategi
            </div>
            <div className="grid grid-cols-2 gap-2">
              {STRATEGY_OPTIONS.map((strategy) => {
                const isSelected = strategyMode === strategy.id;
                return (
                  <button
                    key={strategy.id}
                    type="button"
                    onClick={() => setStrategyMode(strategy.id)}
                    className={`min-h-11 rounded-xl text-xs font-semibold transition ${
                      isSelected
                        ? strategy.activeClass
                        : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {strategy.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-xs leading-relaxed text-slate-400">
            <Scale size={15} className="mt-0.5 shrink-0 text-slate-500" />
            <p>
              Berat badan akan otomatis dicatat ke riwayat perkembangan hari ini
              saat kamu menyimpan profil.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-2 border-t border-slate-800 p-4">
          <motion.button
            type="button"
            onClick={handleSave}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            transition={motionTokens.spring.smooth}
            className="min-h-11 w-full rounded-xl bg-emerald-600 text-sm font-bold text-white transition hover:bg-emerald-500"
          >
            Simpan &amp; Catat Perkembangan
          </motion.button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 w-full rounded-xl border border-slate-800 bg-slate-950 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
