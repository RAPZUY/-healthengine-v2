'use client';

import React from 'react';
import { Timer, ShieldCheck, AlertTriangle } from 'lucide-react';
import {
  ANTERIOR_MUSCLES,
  POSTERIOR_MUSCLES,
  BodySVG,
  MUSCLE_LABELS,
} from '@/components/ui/MuscleMap';
import { PhaseVector, getExercisePose } from '@/components/ui/ExerciseVector';

function getPanelData(exercise) {
  const {
    name,
    tempo,
    postureTip,
    primaryMuscles = [],
    secondaryMuscles = [],
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
    primaryMuscles,
    secondaryMuscles,
    anteriorPrimary,
    anteriorSecondary,
    posteriorPrimary,
    posteriorSecondary,
  };
}

/**
 * Kanvas biomekanika tunggal. Pose dan koreografi dipilih dari nama gerakan,
 * lalu dianimasikan hanya ketika kartu terlihat oleh pengguna.
 */
export function ExerciseVectorPanel({ exercise, className = '' }) {
  const { pose } = getPanelData(exercise);

  return (
    <section className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
          Kanvas Biomekanika Interaktif
        </h5>
        <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
          {pose.label}
        </span>
      </div>

      <PhaseVector pose={pose.pose} variant={pose.variant} />
    </section>
  );
}

/**
 * Langkah 3: peta anatomi otot aktif (tampak depan dan belakang).
 */
export function ExerciseMuscleMapPanel({ exercise, className = '' }) {
  const {
    primaryMuscles,
    secondaryMuscles,
    anteriorPrimary,
    anteriorSecondary,
    posteriorPrimary,
    posteriorSecondary,
  } = getPanelData(exercise);

  return (
    <section
      className={`surface-inset space-y-3 rounded-xl p-4 ${className}`}
    >
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
  );
}

/**
 * Langkah 2: kesalahan postur lebih dulu (paling dekat dengan vektor gerakan),
 * lalu tempo dan tips keamanan sebagai catatan pendukung.
 */
export function ExercisePosturePanel({ exercise, className = '' }) {
  const { pose, tempo, postureTip } = getPanelData(exercise);

  return (
    <section
      className={`surface-inset space-y-4 rounded-xl p-4 ${className}`}
    >
      <div>
        <h5 className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-rose-400">
          <AlertTriangle size={13} strokeWidth={2.4} aria-hidden="true" />
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
      </div>

      <div className="grid gap-3 border-t border-[var(--app-card-border)] pt-3 sm:grid-cols-2">
        <div>
          <h6 className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-400">
            <Timer size={12} strokeWidth={2.4} aria-hidden="true" />
            Tempo Gerakan
          </h6>
          <p className="text-xs leading-relaxed text-slate-300">{tempo}</p>
        </div>

        <div>
          <h6 className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-sky-400">
            <ShieldCheck size={12} strokeWidth={2.4} aria-hidden="true" />
            Tips Postur &amp; Keamanan
          </h6>
          <p className="text-xs leading-relaxed text-slate-300">{postureTip}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * Kompatibilitas lama: satu panel anatomi penuh (vektor + peta otot).
 */
export function ExerciseAnatomyPanel({ exercise, className = '' }) {
  return (
    <div className={`space-y-5 ${className}`}>
      <ExerciseVectorPanel exercise={exercise} />
      <ExerciseMuscleMapPanel exercise={exercise} />
    </div>
  );
}

/**
 * Tetap mendukung pemakaian lama (satu panel penuh) sekaligus menerima
 * `section="vector" | "posture" | "muscle-map" | "anatomy"`.
 */
export default function ExerciseDetailPanel({
  exercise,
  section = 'all',
  className = '',
}) {
  if (section === 'vector') {
    return <ExerciseVectorPanel exercise={exercise} className={className} />;
  }

  if (section === 'posture') {
    return <ExercisePosturePanel exercise={exercise} className={className} />;
  }

  if (section === 'muscle-map') {
    return (
      <ExerciseMuscleMapPanel exercise={exercise} className={className} />
    );
  }

  if (section === 'anatomy') {
    return <ExerciseAnatomyPanel exercise={exercise} className={className} />;
  }

  return (
    <div className={`space-y-5 ${className}`}>
      <ExerciseVectorPanel exercise={exercise} />
      <ExercisePosturePanel exercise={exercise} />
      <ExerciseMuscleMapPanel exercise={exercise} />
    </div>
  );
}
