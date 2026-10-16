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
  const [age, setAge] = useState(biometrics.age || 20);
  const [heightCm, setHeightCm] = useState(biometrics.heightCm || 168);
  const [weightKg, setWeightKg] = useState(biometrics.weightKg || 60);
  const [activityLevel, setActivityLevel] = useState(biometrics.activityLevel || 1.375);
  const [strategyMode, setStrategyMode] = useState(biometrics.strategyMode || 'auto');

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSave = () => {
    onSave({ gender, age, heightCm, weightKg: Number(weightKg), activityLevel, strategyMode });
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
                className={`min-h-11 rounded-lg text-sm font-semibold transition ${
                  gender === 'male' ? 'bg-blue-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ♂️ Pria
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`min-h-11 rounded-lg text-sm font-semibold transition ${
                  gender === 'female' ? 'bg-pink-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ♀️ Wanita
              </button>
            </div>
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Usia (tahun)</label>
            <input
              type="number"
              min="14"
              max="80"
              value={age}
              onChange={(e) => setAge(Math.max(14, Math.min(80, Number(e.target.value))))}
              className="w-full min-h-11 px-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Tinggi Badan (cm)</label>
            <input
              type="number"
              min="120"
              max="220"
              value={heightCm}
              onChange={(e) => setHeightCm(Math.max(120, Math.min(220, Number(e.target.value))))}
              className="w-full min-h-11 px-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Berat Badan (kg)</label>
            <input
              type="number"
              min="30"
              max="180"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(Math.max(30, Math.min(180, Number(e.target.value))))}
              className="w-full min-h-11 px-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-blue-500"
            />
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
                  className={`w-full min-h-11 text-left px-3 py-2.5 rounded-lg border text-xs transition ${
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
                { id: 'auto', label: 'Otomatis', color: 'blue' },
                { id: 'bulking', label: 'Bulking', color: 'amber' },
                { id: 'maintenance', label: 'Maintenance', color: 'emerald' },
                { id: 'cutting', label: 'Cutting', color: 'rose' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStrategyMode(s.id)}
                  className={`min-h-11 rounded-lg text-xs font-semibold transition ${
                    strategyMode === s.id
                      ? `bg-${s.color}-600 text-white`
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
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
