'use client';

import React, { useState, useEffect } from 'react';

const ACTIVITY_OPTIONS = [
  { multiplier: 1.2, title: 'Hampir Nggak Pernah Olahraga', desc: 'Rebahan / duduk seharian' },
  { multiplier: 1.375, title: 'Gerak Ringan Santai', desc: 'Jalan kaki harian, olahraga 1-2x seminggu' },
  { multiplier: 1.55, title: 'Aktif Sedang', desc: 'Olahraga 3-4x seminggu' },
  { multiplier: 1.725, title: 'Sangat Aktif / Atlet', desc: 'Latihan 5-6 hari seminggu' },
];

export default function BiometricModal({ biometrics, onSave, onClose }) {
  const [gender, setGender] = useState(biometrics.gender || 'male');
  const [rawAge, setRawAge] = useState(String(biometrics.age ?? 20));
  const [rawHeight, setRawHeight] = useState(String(biometrics.heightCm ?? 168));
  const [rawWeight, setRawWeight] = useState(String(biometrics.weightKg ?? 60));
  const [activityLevel, setActivityLevel] = useState(biometrics.activityLevel || 1.375);
  const [strategyMode, setStrategyMode] = useState(biometrics.strategyMode || 'auto');

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Step button handlers
  const handleStepAge = (step) => {
    const current = Number(rawAge) || biometrics.age || 20;
    const next = Math.max(14, Math.min(80, Math.round(current + step)));
    setRawAge(String(next));
  };

  const handleStepHeight = (step) => {
    const current = Number(rawHeight) || biometrics.heightCm || 168;
    const next = Math.max(120, Math.min(220, Math.round(current + step)));
    setRawHeight(String(next));
  };

  const handleStepWeight = (step) => {
    const current = parseFloat(rawWeight) || biometrics.weightKg || 60;
    const next = Math.max(30, Math.min(180, Number((current + step).toFixed(1))));
    setRawWeight(String(next));
  };

  // Blur validators with clamping
  const handleBlurAge = () => {
    const val = Number(rawAge);
    if (!rawAge.trim() || isNaN(val) || val <= 0) {
      setRawAge(String(biometrics.age || 20));
    } else {
      setRawAge(String(Math.max(14, Math.min(80, Math.round(val)))));
    }
  };

  const handleBlurHeight = () => {
    const val = Number(rawHeight);
    if (!rawHeight.trim() || isNaN(val) || val <= 0) {
      setRawHeight(String(biometrics.heightCm || 168));
    } else {
      setRawHeight(String(Math.max(120, Math.min(220, Math.round(val)))));
    }
  };

  const handleBlurWeight = () => {
    const val = parseFloat(rawWeight);
    if (!rawWeight.trim() || isNaN(val) || val <= 0) {
      setRawWeight(String(biometrics.weightKg || 60));
    } else {
      setRawWeight(String(Math.max(30, Math.min(180, Number(val.toFixed(1))))));
    }
  };

  const handleSave = () => {
    // Validasi final sebelum simpan
    const numAge = Number(rawAge);
    const finalAge = (!rawAge.trim() || isNaN(numAge) || numAge <= 0)
      ? (biometrics.age || 20)
      : Math.max(14, Math.min(80, Math.round(numAge)));

    const numHeight = Number(rawHeight);
    const finalHeight = (!rawHeight.trim() || isNaN(numHeight) || numHeight <= 0)
      ? (biometrics.heightCm || 168)
      : Math.max(120, Math.min(220, Math.round(numHeight)));

    const numWeight = parseFloat(rawWeight);
    const finalWeight = (!rawWeight.trim() || isNaN(numWeight) || numWeight <= 0)
      ? (biometrics.weightKg || 60)
      : Math.max(30, Math.min(180, Number(numWeight.toFixed(1))));

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100">Edit Profil Biometrik</h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-center"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Jenis Kelamin</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`min-h-11 rounded-xl text-sm font-semibold transition ${
                  gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ♂️ Pria
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`min-h-11 rounded-xl text-sm font-semibold transition ${
                  gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ♀️ Wanita
              </button>
            </div>
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">Usia (tahun)</label>
              <span className="text-slate-500 font-mono">14 – 80 th</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStepAge(-1)}
                className="min-h-11 min-w-11 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 text-base font-bold transition active:scale-95"
                aria-label="Kurangi Usia"
              >
                –
              </button>
              <input
                type="number"
                value={rawAge}
                onChange={(e) => setRawAge(e.target.value)}
                onBlur={handleBlurAge}
                onFocus={(e) => e.target.select()}
                className="flex-1 min-h-11 px-3 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleStepAge(1)}
                className="min-h-11 min-w-11 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 text-base font-bold transition active:scale-95"
                aria-label="Tambah Usia"
              >
                +
              </button>
            </div>
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">Tinggi Badan (cm)</label>
              <span className="text-slate-500 font-mono">120 – 220 cm</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStepHeight(-1)}
                className="min-h-11 min-w-11 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 text-base font-bold transition active:scale-95"
                aria-label="Kurangi Tinggi Badan"
              >
                –
              </button>
              <input
                type="number"
                value={rawHeight}
                onChange={(e) => setRawHeight(e.target.value)}
                onBlur={handleBlurHeight}
                onFocus={(e) => e.target.select()}
                className="flex-1 min-h-11 px-3 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleStepHeight(1)}
                className="min-h-11 min-w-11 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 text-base font-bold transition active:scale-95"
                aria-label="Tambah Tinggi Badan"
              >
                +
              </button>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300">Berat Badan (kg)</label>
              <span className="text-slate-500 font-mono">30 – 180 kg</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStepWeight(-0.5)}
                className="min-h-11 min-w-11 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 text-base font-bold transition active:scale-95"
                aria-label="Kurangi Berat Badan"
              >
                –
              </button>
              <input
                type="text"
                inputMode="decimal"
                value={rawWeight}
                onChange={(e) => setRawWeight(e.target.value.replace(',', '.'))}
                onBlur={handleBlurWeight}
                onFocus={(e) => e.target.select()}
                className="flex-1 min-h-11 px-3 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleStepWeight(0.5)}
                className="min-h-11 min-w-11 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 text-base font-bold transition active:scale-95"
                aria-label="Tambah Berat Badan"
              >
                +
              </button>
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Aktivitas Fisik</label>
            <div className="space-y-1.5">
              {ACTIVITY_OPTIONS.map((opt) => (
                <button
                  key={opt.multiplier}
                  type="button"
                  onClick={() => setActivityLevel(opt.multiplier)}
                  className={`w-full min-h-11 text-left px-3 py-2.5 rounded-xl border text-xs transition ${
                    activityLevel === opt.multiplier
                      ? 'bg-blue-600/15 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-semibold">{opt.title}</span>
                  <span className="text-slate-500 ml-2">×{opt.multiplier}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Strategy Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Mode Strategi</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'auto', label: 'Otomatis' },
                { id: 'bulking', label: 'Bulking' },
                { id: 'maintenance', label: 'Maintenance' },
                { id: 'cutting', label: 'Cutting' },
              ].map((s) => {
                const isSelected = strategyMode === s.id;
                let activeClass = 'bg-blue-600 text-white';
                if (s.id === 'bulking') activeClass = 'bg-amber-600 text-white';
                if (s.id === 'maintenance') activeClass = 'bg-emerald-600 text-white';
                if (s.id === 'cutting') activeClass = 'bg-rose-600 text-white';

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStrategyMode(s.id)}
                    className={`min-h-11 rounded-xl text-xs font-semibold transition ${
                      isSelected ? activeClass : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full min-h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition active:scale-95"
          >
            Simpan & Catat Perkembangan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-11 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-sm font-medium transition"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
