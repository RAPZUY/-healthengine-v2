'use client';

import React, { useEffect } from 'react';

export default function MealDetailModal({ food, onClose }) {
  // Tutup dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!food) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#111827] border border-white/10 shadow-2xl shadow-black/80 text-slate-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Visual Banner */}
        <div className={`p-6 bg-gradient-to-r ${food.iconGradient || 'from-emerald-500/20 to-blue-500/20'} border-b border-white/10 flex items-start justify-between`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center text-3xl shadow-inner select-none">
              {food.emoji || '🍽️'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-900/80 text-blue-400 border border-white/10">
                  {food.category === 'breakfast' && 'Sarapan Pagi'}
                  {food.category === 'lunch' && 'Makan Siang'}
                  {food.category === 'snack' && 'Kudapan Sehat'}
                  {food.category === 'dinner' && 'Makan Malam'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${food.tier === 'budget' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                  {food.tier === 'budget' ? '🏷️ Ramah Kantong' : '✨ Menu Pilihan'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                {food.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-center text-sm"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Deskripsi & Estimasi Biaya */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.08]">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Estimasi Harga Porsi Pasar</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                Rp {food.priceEstimateIdr?.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Estimasi Waktu Olah</span>
              <div className="text-sm font-medium text-slate-200">
                ⏱️ {food.prepTime || '15 menit'}
              </div>
            </div>
          </div>

          {/* Rincian Makronutrien Matrix */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>📊</span> Rincian Makronutrien per Porsi
            </h4>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block font-medium">Kalori</span>
                <span className="text-base font-bold font-mono text-white tabular-nums">{food.calories}</span>
                <span className="text-[9px] text-slate-500 block">kkal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-blue-500/20">
                <span className="text-[10px] text-blue-400 block font-medium">Protein</span>
                <span className="text-base font-bold font-mono text-blue-400 tabular-nums">{food.protein}g</span>
                <span className="text-[9px] text-slate-500 block">pembangun</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-400 block font-medium">Karbo</span>
                <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">{food.carbs}g</span>
                <span className="text-[9px] text-slate-500 block">energi</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/20">
                <span className="text-[10px] text-amber-400 block font-medium">Lemak</span>
                <span className="text-base font-bold font-mono text-amber-400 tabular-nums">{food.fat}g</span>
                <span className="text-[9px] text-slate-500 block">hormon</span>
              </div>
            </div>
          </div>

          {/* Bahan & Takaran */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/[0.06] space-y-1.5">
            <h5 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Bahan & Komposisi Takaran:
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed pl-3.5">
              {food.ingredients}
            </p>
          </div>

          {/* Tips Pengolahan Sehat */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
            <h5 className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
              <span>💡</span>
              Tips Pengolahan Sehat & Praktis:
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              {food.cookTip}
            </p>
          </div>

          {/* Manfaat Kesehatan Tubuh */}
          {food.benefits && (
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-1.5">
              <h5 className="text-xs font-semibold text-blue-400 flex items-center gap-2">
                <span>🛡️</span>
                Manfaat untuk Tubuh:
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {food.benefits}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
