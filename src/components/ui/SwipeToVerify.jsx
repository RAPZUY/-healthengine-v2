'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { Check, ChevronsRight, RotateCcw } from 'lucide-react';

const KNOB_SIZE = 48;
const TRACK_PADDING = 4;
const TRAVEL_INSET = KNOB_SIZE + TRACK_PADDING * 2;

/**
 * Swipe-to-verify slider. The knob is a real draggable motion value; the
 * verification only commits past 80% of the track, otherwise the spring pulls
 * it home. Keyboard and tap users get an equivalent action on the knob itself.
 */
export default function SwipeToVerify({
  verified = false,
  onVerifiedChange,
  label = 'gerakan ini',
  className = '',
}) {
  const trackRef = useRef(null);
  const maxXRef = useRef(0);
  const [maxX, setMaxX] = useState(0);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const progress = useMotionValue(verified ? 1 : 0);
  const fillWidth = useTransform(progress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(x, 'change', (latest) => {
    const limit = maxXRef.current;
    progress.set(limit > 0 ? Math.min(1, Math.max(0, latest / limit)) : 0);
  });

  // Measure the rail; the knob travel is the rail width minus its own size.
  useEffect(() => {
    const element = trackRef.current;
    if (!element) return undefined;

    const measure = () => {
      const next = Math.max(0, element.clientWidth - TRAVEL_INSET);
      maxXRef.current = next;
      setMaxX(next);
      if (verified) x.set(next);
    };

    measure();

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure);
      observer.observe(element);
    }
    window.addEventListener('resize', measure);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [verified, x]);

  // Snap to either end whenever the controlled value changes.
  useEffect(() => {
    const target = verified ? maxX : 0;
    if (reduce) {
      x.set(target);
      progress.set(verified ? 1 : 0);
      return undefined;
    }

    progress.set(verified ? 1 : 0);
    const controls = animate(x, target, {
      type: 'spring',
      stiffness: 460,
      damping: 38,
      mass: 0.8,
    });
    return () => controls.stop();
  }, [verified, maxX, reduce, x, progress]);

  const settle = () => {
    const limit = maxXRef.current;
    const threshold = limit * 0.8;

    if (limit > 0 && x.get() >= threshold) {
      onVerifiedChange?.(true);
      return;
    }

    if (reduce) {
      x.set(0);
      progress.set(0);
      return;
    }

    progress.set(0);
    animate(x, 0, {
      type: 'spring',
      stiffness: 500,
      damping: 40,
      mass: 0.8,
    });
  };

  return (
    <div className={`min-w-0 ${className}`}>
      <div
        ref={trackRef}
        className={`relative flex min-h-12 w-full select-none items-center overflow-hidden rounded-full border text-xs transition-colors ${
          verified
            ? 'border-emerald-500/40 bg-emerald-500/10'
            : 'surface-inset border-slate-800'
        } touch-pan-y`}
        style={{ height: '3.5rem' }}
      >
        {!verified ? (
          <motion.div
            aria-hidden="true"
            className="accent-pill absolute inset-y-1 left-1 rounded-full"
            style={{ width: fillWidth }}
          />
        ) : null}

        {verified ? (
          <>
            <span className="pointer-events-none relative z-10 flex min-w-0 flex-1 items-center gap-2 pl-4 pr-16 text-emerald-400">
              <Check size={16} strokeWidth={3} aria-hidden="true" />
              <span className="truncate font-bold">
                Gerakan Selesai Dilakukan
              </span>
            </span>
            <span
              aria-hidden="true"
              className="absolute right-1 top-1 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/25"
            >
              <Check size={20} strokeWidth={3} />
            </span>
          </>
        ) : (
          <>
            <span className="pointer-events-none relative z-10 flex min-w-0 flex-1 items-center gap-1.5 pl-16 pr-4 text-slate-400">
              <span className="truncate font-semibold">
                Geser ke kanan untuk verifikasi
              </span>
              <ChevronsRight
                size={15}
                strokeWidth={2.6}
                aria-hidden="true"
                className="shrink-0 text-slate-500"
              />
            </span>

            <motion.button
              type="button"
              drag={reduce ? false : 'x'}
              dragConstraints={{ left: 0, right: maxX }}
              dragElastic={0.04}
              dragMomentum={false}
              style={{ x }}
              onDragEnd={settle}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onVerifiedChange?.(true);
                }
              }}
              aria-label={`Geser ke kanan atau tekan Enter untuk memverifikasi ${label}`}
              className="accent-solid absolute left-1 top-1 z-20 flex h-12 w-12 cursor-grab touch-pan-y items-center justify-center rounded-full shadow-lg shadow-black/25 active:cursor-grabbing"
            >
              <ChevronsRight size={22} strokeWidth={2.8} aria-hidden="true" />
            </motion.button>
          </>
        )}
      </div>

      {verified ? (
        <div className="mt-1 flex justify-end">
          <button
            type="button"
            onClick={() => onVerifiedChange?.(false)}
            className="flex min-h-11 items-center gap-1.5 rounded-xl px-2.5 text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-200"
          >
            <RotateCcw size={13} strokeWidth={2.4} aria-hidden="true" />
            Batalkan verifikasi
          </button>
        </div>
      ) : (
        <p className="mt-1.5 pl-1 text-[11px] font-medium text-slate-500">
          Verifikasi manual sebelum menyelesaikan latihan.
        </p>
      )}
    </div>
  );
}
