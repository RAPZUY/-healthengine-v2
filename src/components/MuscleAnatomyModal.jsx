'use client';

import React, { useEffect } from 'react';
import {
  ANTERIOR_MUSCLES,
  POSTERIOR_MUSCLES,
  EQUIPMENT_LABELS_ID,
  BodySVG,
} from '@/components/ui/MuscleMap';
import { AnimatedExerciseCanvas, getExercisePose } from '@/components/ui/ExerciseVector';

const CATEGORY_LABELS = {
  vertical_push: 'Vertical Push',
  squat_lunge: 'Squat & Lunge',
  pull_motion: 'Pull Motion',
  core_floor: 'Core Floor',
  cardio_blast: 'Cardio Blast',
  horizontal_push: 'Horizontal Push',
};

const CATEGORY_MISTAKES = {
  vertical_push: ['Jaga siku menyerong, bukan melebar.', 'Pertahankan core agar punggung tidak melengkung.'],
  squat_lunge: ['Pastikan lutut mengikuti arah jari kaki.', 'Jaga tumit tetap menapak saat turun.'],
  pull_motion: ['Hindari mengayunkan tubuh untuk mencari momentum.', 'Mulai tarikan dari belikat, bukan hanya lengan.'],
  core_floor: ['Pertahankan panggul netral.', 'Bernapas pendek dan teratur selama menahan posisi.'],
  cardio_blast: ['Redam pendaratan dengan lutut lentur.', 'Atur napas agar ritme tetap konsisten.'],
  horizontal_push: ['Jaga garis tubuh tetap lurus.', 'Siku bergerak menyerong, bukan melebar 90 derajat.'],
};

function BiomechanicalVectorViewer({ exercise }) {
  const category = exercise.vectorPoseCategory || 'horizontal_push';
  const pose = getExercisePose(exercise.name, category);
  const mistakes = CATEGORY_MISTAKES[category] || CATEGORY_MISTAKES.horizontal_push;

  return (
    <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{CATEGORY_LABELS[category]}</p>
          <h4 className="mt-1 text-sm font-bold text-slate-100">Kanvas Biomekanika</h4>
        </div>
        <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 font-mono text-[11px] font-semibold text-emerald-300">{pose.label}</span>
      </div>
      <AnimatedExerciseCanvas pose={pose.pose} />
      <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
        <p className="text-xs font-bold text-rose-300">Kesalahan postur yang perlu dihindari</p>
        <ul className="mt-2 space-y-1 text-xs leading-relaxed text-slate-300">
          {mistakes.map((mistake) => <li key={mistake} className="flex gap-2"><span className="text-rose-400" aria-hidden="true">×</span><span>{mistake}</span></li>)}
        </ul>
      </div>
    </section>
  );
}

export default function MuscleAnatomyModal({ exercise, onClose }) {
  useEffect(() => {
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!exercise) return null;

  const {
    name,
    equipment,
    setsReps,
    rest,
    tempo,
    difficulty,
    postureTip,
    primaryMuscles = [],
    secondaryMuscles = [],
    muscleExplanation,
  } = exercise;
  const anteriorPrimary = primaryMuscles.filter((muscle) => ANTERIOR_MUSCLES[muscle]);
  const anteriorSecondary = secondaryMuscles.filter((muscle) => ANTERIOR_MUSCLES[muscle]);
  const posteriorPrimary = primaryMuscles.filter((muscle) => POSTERIOR_MUSCLES[muscle]);
  const posteriorSecondary = secondaryMuscles.filter((muscle) => POSTERIOR_MUSCLES[muscle]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/95 p-4 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-bold leading-snug text-slate-100">{name}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-300">{EQUIPMENT_LABELS_ID[equipment] || equipment}</span>
                <span className="rounded border border-slate-800 bg-slate-950 px-2 py-0.5 text-xs text-slate-300">{difficulty}</span>
              </div>
            </div>
            <button type="button" onClick={onClose} className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400" aria-label="Tutup">×</button>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 p-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5"><span className="block text-xs text-slate-500">Set × Rep</span><span className="font-mono text-sm font-bold text-emerald-400">{setsReps}</span></div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5"><span className="block text-xs text-slate-500">Istirahat</span><span className="font-mono text-sm font-bold text-amber-400">{rest}</span></div>
          <div className="col-span-2 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-2.5"><span className="block text-xs font-semibold text-emerald-400">Tempo gerakan</span><span className="text-sm font-bold text-emerald-300">{tempo}</span></div>
        </div>

        <div className="px-4 pb-3"><div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-3"><p className="mb-1 text-xs font-semibold text-blue-300">Tips postur dan keamanan</p><p className="text-xs leading-relaxed text-slate-300">{postureTip}</p></div></div>
        <div className="px-4 pb-3"><BiomechanicalVectorViewer exercise={exercise} /></div>

        <div className="px-4 pb-3">
          <section className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
            <p className="mb-3 text-center text-xs font-bold text-slate-300">Peta anatomi otot aktif</p>
            <div className="flex gap-2"><BodySVG title="Tampak Depan" muscles={ANTERIOR_MUSCLES} primaryMuscles={anteriorPrimary} secondaryMuscles={anteriorSecondary} view="anterior" /><BodySVG title="Tampak Belakang" muscles={POSTERIOR_MUSCLES} primaryMuscles={posteriorPrimary} secondaryMuscles={posteriorSecondary} view="posterior" /></div>
            <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-300"><span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-rose-400 bg-rose-500" />Otot utama</span><span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-amber-300 bg-amber-400" />Otot pendukung</span></div>
          </section>
        </div>

        {muscleExplanation ? <div className="px-4 pb-4"><div className="rounded-lg border border-slate-800 bg-slate-950 p-3"><p className="mb-1 text-xs font-semibold text-slate-300">Cara kerja otot</p><p className="text-xs leading-relaxed text-slate-400">{muscleExplanation}</p></div></div> : null}
        <footer className="border-t border-slate-800 p-4"><button type="button" onClick={onClose} className="w-full min-h-11 rounded-xl border border-slate-800 bg-slate-950 text-sm font-medium text-slate-300 transition-colors hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">Tutup</button></footer>
      </div>
    </div>
  );
}
