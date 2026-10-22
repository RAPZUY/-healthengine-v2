'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  BellRing,
  Coffee,
  Dumbbell,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { RollingNumber } from '@/components/ui/motion-primitives';
import { useToast } from '@/components/ui/ToastProvider';

/** "Rest 60 detik" / "45 detik" / "1 menit" -> seconds. */
export function extractSeconds(value) {
  if (!value) return null;
  const match = String(value).match(/(\d+(?:[.,]\d+)?)\s*(detik|menit)/i);
  if (!match) return null;
  const amount = Number(match[1].replace(',', '.'));
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * (match[2].toLowerCase() === 'menit' ? 60 : 1));
}

export function parseExerciseTimers(exercise) {
  return {
    rest: extractSeconds(exercise?.rest),
    work: extractSeconds(exercise?.setsReps),
  };
}

function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return { minutes, seconds, text: `${minutes}:${String(seconds).padStart(2, '0')}` };
}

function beepPattern(context) {
  const now = context.currentTime;
  [880, 1046, 1318].forEach((frequency, index) => {
    const offset = index * 0.16;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.09, now + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.14);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now + offset);
    oscillator.stop(now + offset + 0.16);
  });
}

/**
 * Timestamp-driven workout / rest timer. It stores the end wall-clock time, so
 * a dimmed or throttled phone still returns to the correct remaining seconds.
 * The completion cue is a synthesised WebAudio beep, no audio asset needed.
 */
export default function ExerciseTimer({ exercise, className = '' }) {
  const { rest, work } = parseExerciseTimers(exercise);
  const initialMode = work ? 'work' : 'rest';
  const initialDuration = work ?? rest ?? 0;

  const { toast } = useToast();
  const reduce = useReducedMotion();
  const [mode, setMode] = useState(initialMode);
  const [remaining, setRemaining] = useState(initialDuration);
  const [running, setRunning] = useState(false);
  const endAtRef = useRef(0);
  const notifiedRef = useRef(false);
  const audioRef = useRef(null);

  const duration = mode === 'work' ? work ?? 0 : rest ?? 0;
  const hasBoth = Boolean(work) && Boolean(rest);
  const clock = formatClock(remaining);
  const progress =
    duration > 0
      ? Math.min(100, Math.max(0, (remaining / duration) * 100))
      : 0;

  const ensureAudio = () => {
    if (typeof window === 'undefined') return;
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioRef.current) audioRef.current = new AudioContextClass();
    if (audioRef.current.state === 'suspended') {
      audioRef.current.resume().catch(() => {});
    }
  };

  // Count down against a timestamp, never against an accumulated tick count.
  useEffect(() => {
    if (!running) return undefined;

    const tick = () => {
      const next = Math.max(
        0,
        Math.ceil((endAtRef.current - Date.now()) / 1000)
      );
      setRemaining(next);

      if (next <= 0) {
        setRunning(false);
        if (!notifiedRef.current) {
          notifiedRef.current = true;
          if (audioRef.current) {
            if (audioRef.current.state === 'suspended') {
              audioRef.current.resume().catch(() => {});
            }
            beepPattern(audioRef.current);
          }
          toast({
            tone: 'success',
            text:
              mode === 'work'
                ? 'Waktu latihan selesai!'
                : 'Waktu istirahat selesai!',
            description:
              mode === 'work'
                ? 'Istirahat sejenak, lalu lanjutkan set berikutnya.'
                : 'Siap untuk set berikutnya.',
            icon: <BellRing size={17} strokeWidth={2.2} />,
            duration: 6000,
          });
        }
      }
    };

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [running, mode, toast]);

  useEffect(
    () => () => {
      if (audioRef.current) {
        audioRef.current.close().catch(() => {});
        audioRef.current = null;
      }
    },
    []
  );

  const handleStart = () => {
    const base = remaining > 0 ? remaining : duration;
    if (base <= 0) return;
    ensureAudio();
    notifiedRef.current = false;
    endAtRef.current = Date.now() + base * 1000;
    setRemaining(base);
    setRunning(true);
  };

  const handlePause = () => {
    const next = Math.max(
      0,
      Math.ceil((endAtRef.current - Date.now()) / 1000)
    );
    setRemaining(next);
    setRunning(false);
  };

  const handleReset = () => {
    setRunning(false);
    notifiedRef.current = false;
    endAtRef.current = 0;
    setRemaining(duration);
  };

  const handleAddTime = () => {
    const next = (remaining > 0 ? remaining : duration) + 15;
    setRemaining(next);
    if (running) endAtRef.current += 15000;
  };

  const handleMode = (nextMode) => {
    if (nextMode === mode) return;
    const nextDuration = nextMode === 'work' ? work ?? 0 : rest ?? 0;
    setRunning(false);
    notifiedRef.current = false;
    endAtRef.current = 0;
    setMode(nextMode);
    setRemaining(nextDuration);
  };

  if (!rest && !work) {
    return (
      <div
        className={`surface-inset rounded-2xl p-4 text-xs leading-relaxed text-slate-500 ${className}`}
      >
        Gerakan ini berbasis repetisi. Gunakan hitungan manual atau atur napas
        di antara set.
      </div>
    );
  }

  return (
    <section
      className={`surface-inset rounded-2xl p-4 ${className}`}
      aria-label={`Timer ${exercise?.name ?? 'gerakan'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          <Coffee size={13} strokeWidth={2.4} aria-hidden="true" />
          Timer bawaan
        </span>

        {hasBoth ? (
          <div
            role="group"
            aria-label="Jenis timer"
            className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/50 p-1"
          >
            <button
              type="button"
              onClick={() => handleMode('work')}
              aria-pressed={mode === 'work'}
              className={`flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-bold transition-colors ${
                mode === 'work'
                  ? 'accent-pill'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Dumbbell size={13} strokeWidth={2.4} aria-hidden="true" />
              Latihan
            </button>
            <button
              type="button"
              onClick={() => handleMode('rest')}
              aria-pressed={mode === 'rest'}
              className={`flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-bold transition-colors ${
                mode === 'rest'
                  ? 'accent-pill'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Coffee size={13} strokeWidth={2.4} aria-hidden="true" />
              Istirahat
            </button>
          </div>
        ) : (
          <span className="accent-pill rounded-lg px-2.5 py-1 text-[11px] font-bold">
            {mode === 'work' ? 'Latihan' : 'Istirahat'}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <div
            className="flex items-baseline gap-0.5 font-mono text-3xl font-bold leading-none text-slate-100"
            aria-hidden="true"
          >
            <RollingNumber value={clock.minutes} />
            <span className="px-0.5 text-slate-500">:</span>
            {clock.seconds < 10 ? (
              <span className="text-slate-500">0</span>
            ) : null}
            <RollingNumber value={clock.seconds} />
          </div>
          <span className="sr-only" role="timer" aria-live="polite">
            {clock.text} tersisa
          </span>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            {running
              ? 'Berjalan, layar boleh meredup'
              : remaining === 0
                ? 'Selesai, siap set berikutnya'
                : mode === 'work'
                  ? 'Durasi kerja per set'
                  : 'Durasi istirahat antar set'}
          </p>
        </div>
        <span className="font-mono text-[11px] font-semibold text-slate-500">
          {duration > 0 ? `${Math.round(duration)}d total` : ''}
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
        <motion.div
          aria-hidden="true"
          className={`h-full rounded-full ${
            remaining === 0 ? 'bg-emerald-500' : ''
          }`}
          style={{
            backgroundColor:
              remaining === 0 ? undefined : 'var(--accent-color)',
          }}
          animate={{ width: `${progress}%` }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.25, ease: 'linear' }
          }
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={running ? handlePause : handleStart}
          className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-bold transition ${
            running
              ? 'border border-amber-500/30 bg-amber-500/10 text-amber-400'
              : 'accent-solid'
          }`}
        >
          {running ? (
            <Pause size={15} strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <Play size={15} strokeWidth={2.5} aria-hidden="true" />
          )}
          <span>{running ? 'Jeda' : 'Mulai'}</span>
        </button>

        <button
          type="button"
          onClick={handleAddTime}
          className="surface-chip flex min-h-11 items-center justify-center gap-1 rounded-xl px-2 text-xs font-bold text-slate-300 transition hover:border-slate-700 hover:text-slate-100"
          aria-label="Tambah 15 detik"
        >
          <Plus size={14} strokeWidth={2.6} aria-hidden="true" />
          <span>15d</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="surface-chip flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-bold text-slate-300 transition hover:border-slate-700 hover:text-slate-100"
        >
          <RotateCcw size={14} strokeWidth={2.4} aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>
    </section>
  );
}
