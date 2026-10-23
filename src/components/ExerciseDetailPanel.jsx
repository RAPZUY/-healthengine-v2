'use client';

import React from 'react';
import { Timer, ShieldCheck } from 'lucide-react';
import {
  ANTERIOR_MUSCLES,
  POSTERIOR_MUSCLES,
  BodySVG,
  MUSCLE_LABELS,
} from '@/components/ui/MuscleMap';
import {
  PhaseVector,
  getExercisePose,
} from '@/components/ui/ExerciseVector';

const PHASE_STYLES = [
  {
    label: 'Fase 1 · Eksentrik',
    badge: 'border-sky-500/25 bg-sky-500/10 text-sky-300',
    index: 1,
  },
  {
    label: 'Fase 2 · Konsentrik',
    badge: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    index: 2,
  },
];

function getPanelData(exercise) {
  const {
    name,
    tempo,
    postureTip,
    primaryMuscles = [],
    secondaryMuscles = [],
    muscleExplanation,
    vectorPoseCategory,
  } = exercise;

  const pose = getExercisePose(name, vectorPoseCategory);
  const anteriorPrimary = primaryMuscles.filter(
    (muscle) => ANTERIOR_MUSCLES[muscle]
  );
  const anteriorSecondary = secondaryMuscles.filter(
    (muscle) => ANTERIOR_MUSCLES[muscle]
  );
  const posteriorPrimary = primaryMuscles.filter(
    (muscle) => POSTERIOR_MUSCLES[muscle]
  );
  const posteriorSecondary = secondaryMuscles.filter(
    (muscle) => POSTERIOR_MUSCLES[muscle]
  );

  return {
    pose,
    tempo,
    postureTip,
    muscleExplanation,
    primaryMuscles,
    secondaryMuscles,
    anteriorPrimary,
    anteriorSecondary,
    posteriorPrimary,
    posteriorSecondary,
  };
}

/**
 * Bagian 1: vektor biomekanika + peta anatomi. Dipisah agar kartu latihan bisa
 * menyusun ulang alur baca: anatomi dulu, baru postur, lalu timer dan swipe.
 */
export function ExerciseAnatomyPanel({ exercise, className = '' }) {
  const {
    pose,
    primaryMuscles,
    secondaryMuscles,
    anteriorPrimary,
    anteriorSecondary,
    posteriorPrimary,
    posteriorSecondary,
  } = getPanelData(exercise);

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Vektor biomekanika 2 fase */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Vektor Biomekanika 2 Fase
          </h5>
          <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
            {pose.label}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {PHASE_STYLES.map((style) => (
            <article
              key={style.index}
              className="surface-inset flex flex-col justify-between gap-3 rounded-xl p-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-200">
                    {style.label}
                  </span>
                  <span
                    className={`rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold ${style.badge}`}
                  >
                    {style.index === 1 ? 'Turun' : 'Naik'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">
                  {style.index === 1 ? pose.c1 : pose.c2}
                </p>
              </div>

              <div className="surface-chip rounded-lg p-2">
                <PhaseVector
                  pose={pose.pose}
                  variant={pose.variant}
                  phase={style.index}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Peta anatomi otot */}
      <section className="surface-inset space-y-3 rounded-xl p-4">
        <div className="flex items-center justify-between gap-2">
          <h5 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Peta Anatomi Otot Aktif
          </h5>
          <span className="text-[11px] font-medium text-slate-500">
            {primaryMuscles.length} otot utama
          </span>
        </div>

        <div className="flex gap-2">
          <BodySVG
            title="Tampak Depan"
            muscles={ANTERIOR_MUSCLES}
            primaryMuscles={anteriorPrimary}
            secondaryMuscles={anteriorSecondary}
            view="anterior"
          />
          <BodySVG
            title="Tampak Belakang"
            muscles={POSTERIOR_MUSCLES}
            primaryMuscles={posteriorPrimary}
            secondaryMuscles={posteriorSecondary}
            view="posterior"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-[var(--app-card-border)] pt-3 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full bg-rose-500"
              aria-hidden="true"
            />
            Otot utama
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full bg-amber-400"
              aria-hidden="true"
            />
            Otot pendukung
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {primaryMuscles.map((muscle) => (
            <span
              key={`primary-${muscle}`}
              className="rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-300"
            >
              {MUSCLE_LABELS[muscle] ?? muscle}
            </span>
          ))}
          {secondaryMuscles.map((muscle) => (
            <span
              key={`secondary-${muscle}`}
              className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300"
            >
              {MUSCLE_LABELS[muscle] ?? muscle}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Bagian 2: tempo, tips postur, kesalahan umum, dan penjelasan kerja otot.
 */
export function ExercisePosturePanel({ exercise, className = '' }) {
  const { pose, tempo, postureTip, muscleExplanation } =
    getPanelData(exercise);

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        <section className="surface-inset rounded-xl p-4">
          <h5 className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Timer size={13} strokeWidth={2.4} aria-hidden="true" />
            Tempo Gerakan
          </h5>
          <p className="text-xs leading-relaxed text-slate-300">{tempo}</p>
        </section>

        <section className="surface-inset rounded-xl p-4">
          <h5 className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-sky-400">
            <ShieldCheck size={13} strokeWidth={2.4} aria-hidden="true" />
            Tips Postur &amp; Keamanan
          </h5>
          <p className="text-xs leading-relaxed text-slate-300">{postureTip}</p>
        </section>
      </div>

      <section className="surface-inset rounded-xl p-4">
        <h5 className="mb-2 text-xs font-bold text-rose-400">
          Kesalahan Postur yang Wajib Dihindari
        </h5>
        <ul className="space-y-1.5">
          {pose.mistakes.map((mistake) => (
            <li
              key={mistake}
              className="flex items-start gap-2 text-xs leading-relaxed text-slate-300"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 font-bold text-rose-400"
              >
                ✕
              </span>
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </section>

      {muscleExplanation ? (
        <section className="surface-inset rounded-xl p-4">
          <h5 className="mb-1.5 text-xs font-bold text-slate-300">
            Cara Kerja Otot
          </h5>
          <p className="text-xs leading-relaxed text-slate-400">
            {muscleExplanation}
          </p>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Tetap mendukung pemakaian lama (satu panel penuh) sekaligus menerima
 * `section="anatomy" | "posture"` untuk komposisi baru.
 */
export default function ExerciseDetailPanel({
  exercise,
  section = 'all',
  className = '',
}) {
  if (section === 'anatomy') {
    return <ExerciseAnatomyPanel exercise={exercise} className={className} />;
  }

  if (section === 'posture') {
    return <ExercisePosturePanel exercise={exercise} className={className} />;
  }

  return (
    <div className={`space-y-5 ${className}`}>
      <ExerciseAnatomyPanel exercise={exercise} />
      <ExercisePosturePanel exercise={exercise} />
    </div>
  );
}
