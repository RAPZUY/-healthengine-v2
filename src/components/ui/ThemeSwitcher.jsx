'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, MoonStar, Palette, Sun, X } from 'lucide-react';
import { motionTokens } from '@/components/ui/motion-primitives';

export const THEME_STORAGE_KEY = 'healtyapp_v4_state';

/**
 * Pastel accents are bright by design. Each entry therefore carries its own
 * contrast ink (near-black for pastels) plus a darker "soft text" tone per
 * theme, so chips stay readable instead of dissolving into the background.
 */
export const ACCENTS = [
  {
    id: 'engine',
    label: 'Engine Blue',
    value: '#2563eb',
    contrast: '#ffffff',
    softDark: '#93c5fd',
    softLight: '#1d4ed8',
    strongDark: '#60a5fa',
    strongLight: '#2563eb',
    isDefault: true,
  },
  {
    id: 'sky',
    label: 'Sky Pastel',
    value: '#a2d2ff',
    contrast: '#020617',
    softDark: '#a2d2ff',
    softLight: '#1e40af',
    strongDark: '#a2d2ff',
    strongLight: '#3b7fb8',
  },
  {
    id: 'baby',
    label: 'Baby Blue',
    value: '#bde0fe',
    contrast: '#020617',
    softDark: '#bde0fe',
    softLight: '#1e40af',
    strongDark: '#bde0fe',
    strongLight: '#3b7fb8',
  },
  {
    id: 'sakura',
    label: 'Sakura Pink',
    value: '#ffb3c6',
    contrast: '#020617',
    softDark: '#ffb3c6',
    softLight: '#9d174d',
    strongDark: '#ffb3c6',
    strongLight: '#be185d',
  },
  {
    id: 'mint',
    label: 'Soft Mint',
    value: '#a5ffd6',
    contrast: '#020617',
    softDark: '#a5ffd6',
    softLight: '#047857',
    strongDark: '#a5ffd6',
    strongLight: '#059669',
  },
  {
    id: 'teal',
    label: 'Pastel Teal',
    value: '#84dcc6',
    contrast: '#020617',
    softDark: '#84dcc6',
    softLight: '#0f766e',
    strongDark: '#84dcc6',
    strongLight: '#0d9488',
  },
];

export const DEFAULT_ACCENT_ID = 'engine';

export function getAccent(id) {
  return ACCENTS.find((accent) => accent.id === id) ?? ACCENTS[0];
}

export function applyThemeToDocument(themeMode, accentId) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const accent = getAccent(accentId);

  root.dataset.theme = themeMode === 'light' ? 'light' : 'dark';
  root.dataset.accent = accent.id;
  root.style.colorScheme = themeMode === 'light' ? 'light' : 'dark';
  root.style.setProperty('--accent-color', accent.value);
  root.style.setProperty('--accent-contrast', accent.contrast);
  root.style.setProperty('--accent-soft-dark', accent.softDark);
  root.style.setProperty('--accent-soft-light', accent.softLight);
  root.style.setProperty('--accent-strong-dark', accent.strongDark);
  root.style.setProperty('--accent-strong-light', accent.strongLight);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute(
      'content',
      themeMode === 'light' ? '#f4f6fb' : '#020617'
    );
  }
}

export default function ThemeSwitcher({
  themeMode = 'dark',
  accentId = DEFAULT_ACCENT_ID,
  onThemeModeChange,
  onAccentChange,
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const wrapperRef = useRef(null);
  const panelId = useId();
  const activeAccent = getAccent(accentId);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    // pointerdown closes for mouse/touch; click covers keyboard activation of
    // another control while the popover is open.
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('click', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('click', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Atur tema dan warna aksen"
        className="relative flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 text-slate-300 transition-colors hover:border-slate-700 hover:text-slate-100 active:scale-95"
      >
        <Palette size={18} strokeWidth={2.2} aria-hidden="true" />
        <span
          aria-hidden="true"
          className="absolute bottom-2 right-2 h-2 w-2 rounded-full ring-2 ring-slate-900"
          style={{ backgroundColor: activeAccent.value }}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Pengaturan tema"
            initial={
              reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.96 }
            }
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            transition={motionTokens.spring.morph}
            style={{ transformOrigin: 'top right' }}
            className="surface-card absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-1rem))] rounded-3xl p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Tampilan
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-100">
                  Suasana HealthEngine
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup pengaturan tema"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 transition-colors hover:text-slate-100"
              >
                <X size={16} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </div>

            {/* Bagian 1: mode gelap / terang */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-slate-400">
                Mode tampilan
              </p>
              <div
                role="group"
                aria-label="Mode tampilan"
                className="grid grid-cols-2 gap-1.5 rounded-2xl border border-slate-800 bg-slate-950/60 p-1.5"
              >
                {[
                  { id: 'dark', label: 'Gelap', icon: MoonStar },
                  { id: 'light', label: 'Terang', icon: Sun },
                ].map((mode) => {
                  const isActive = themeMode === mode.id;
                  const ModeIcon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => onThemeModeChange?.(mode.id)}
                      aria-pressed={isActive}
                      className={`flex min-h-11 items-center justify-center gap-2 rounded-xl text-xs font-bold transition-colors ${
                        isActive
                          ? 'accent-solid'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                      }`}
                    >
                      <ModeIcon size={16} strokeWidth={2.3} aria-hidden="true" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bagian 2: lima pastel + satu default */}
            <div className="surface-inset mt-3 rounded-2xl p-3.5">
              <div className="mb-2.5 flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold text-slate-400">
                  Warna aksen pastel
                </p>
                <span
                  className="truncate text-[11px] font-semibold accent-text"
                  aria-live="polite"
                >
                  {activeAccent.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 min-[360px]:grid-cols-6">
                {ACCENTS.map((accent) => {
                  const isActive = accent.id === accentId;
                  return (
                    <button
                      key={accent.id}
                      type="button"
                      onClick={() => onAccentChange?.(accent.id)}
                      aria-pressed={isActive}
                      aria-label={`Pilih ${accent.label}`}
                      title={accent.label}
                      className={`flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 transition-transform active:scale-95 ${
                        isActive
                          ? 'border-slate-100 shadow-md'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{
                        background: accent.isDefault
                          ? 'linear-gradient(135deg, #2563eb, #10b981)'
                          : accent.value,
                      }}
                    >
                      {isActive ? (
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: accent.isDefault
                              ? '#ffffff'
                              : '#020617',
                            color: accent.isDefault ? '#2563eb' : accent.value,
                          }}
                        >
                          <Check size={12} strokeWidth={3.2} aria-hidden="true" />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                Teks pada tombol pastel otomatis memakai tinta gelap agar tetap
                tajam di kedua mode.
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
