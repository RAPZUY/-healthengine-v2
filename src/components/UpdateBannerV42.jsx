'use client';

import React, { useCallback, useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BellRing, CalendarX2, Palette, ReceiptText, Timer, UserRound, X } from 'lucide-react';
import { motionTokens } from '@/components/ui/motion-primitives';

const STORAGE_KEY = 'healthengine_banner_v4_2_1';
const DISMISSED = 'dismissed';

const HIGHLIGHTS = [
  { icon: UserRound, label: 'Sapaan nama panggilan' },
  { icon: BellRing, label: 'Dynamic Island bisa diklik' },
  { icon: Palette, label: 'Tema pastel penuh' },
  { icon: CalendarX2, label: 'Evaluasi hari terlewat' },
  { icon: Timer, label: 'Proteksi timer tunggal' },
  { icon: ReceiptText, label: 'Total pengeluaran makan' },
];

// Store kecil di atas localStorage: dibaca lewat useSyncExternalStore supaya
// server merender "tersembunyi" dan klien menyusul tanpa mismatch hidrasi.
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readDismissed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === DISMISSED;
  } catch {
    return false;
  }
}

/**
 * Pengumuman rilis V4.2.1. Muncul sekali per perangkat; tombol tutup menulis
 * flag ke localStorage sehingga banner tidak kembali pada kunjungan berikutnya.
 */
export default function UpdateBannerV42() {
  const reduce = useReducedMotion();
  const dismissed = useSyncExternalStore(
    subscribe,
    readDismissed,
    () => true
  );

  const handleDismiss = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, DISMISSED);
    } catch {
      // Penyimpanan diblokir: banner tetap tertutup untuk sesi ini.
    }
    listeners.forEach((listener) => listener());
  }, []);

  if (dismissed) return null;

  return (
    <motion.section
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={motionTokens.spring.smooth}
      aria-labelledby="update-banner-title"
      className="surface-card relative overflow-hidden rounded-2xl p-4"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-base"
        >
          🚀
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="accent-pill rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold">
              V4.2.1
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Baru di perangkat ini
            </span>
          </div>

          <h2
            id="update-banner-title"
            className="mt-1.5 text-sm font-bold leading-snug text-slate-100"
          >
            🚀 Minor Update HealthEngine V4.2.1
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Sapaan nama panggilan, Dynamic Island yang bisa dibuka, dan ruang
            kosong di bawah Tab Olahraga sudah rapi.
          </p>

          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="surface-inset inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-300"
              >
                <Icon
                  size={12}
                  strokeWidth={2.4}
                  aria-hidden="true"
                  className="shrink-0 text-slate-400"
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Tutup pengumuman pembaruan V4.2.1"
          className="surface-chip flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          <X size={16} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
    </motion.section>
  );
}
