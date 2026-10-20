'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { RollingNumber, TextReveal } from './motion-primitives';

const minimumValidationDelay = 1000;

function countDecimals(number) {
  const text = String(number);
  if (text.includes('e-')) {
    const [, exponent] = text.split('e-');
    return Number(exponent);
  }
  return (text.split('.')[1] ?? '').length;
}

function parseDraft(rawValue) {
  if (typeof rawValue !== 'string') return Number.NaN;
  const normalized = rawValue.replace(',', '.').trim();
  if (!normalized) return Number.NaN;
  if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) return Number.NaN;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

/**
 * Numeric field with a rolling odometer readout and deliberate, delay-gated
 * validation. Clicking minus / plus never opens the keyboard on mobile: the
 * number simply rolls to its next value.
 */
export default function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  minError,
  maxError,
  decimals,
  className = '',
}) {
  const decimalPlaces = decimals ?? Math.max(countDecimals(step), 0);
  const normalizedValue = Number.isFinite(Number(value)) ? Number(value) : min;

  const [draftValue, setDraftValue] = useState(String(normalizedValue));
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const lastEditAtRef = useRef(0);
  const errorTimerRef = useRef(null);

  const normalizedDraft = draftValue.replace(',', '.');
  const isNumericDraft =
    normalizedDraft.trim() !== '' && /^-?\d+(?:\.\d+)?$/.test(normalizedDraft);
  const isPartialNumber =
    draftValue.trim() === '' || /^-?\d*[.,]?$/.test(draftValue);
  const draftNumber = isNumericDraft ? Number(normalizedDraft) : Number.NaN;

  const resolvedMinError =
    minError ?? `Minimal ${min}${unit ? ` ${unit}` : ''}`;
  const resolvedMaxError =
    maxError ?? `Maksimal ${max}${unit ? ` ${unit}` : ''}`;

  useEffect(() => {
    if (!isEditing) return undefined;

    if (!isNumericDraft) {
      if (isPartialNumber) return undefined;

      const remaining = Math.max(
        0,
        minimumValidationDelay - (Date.now() - lastEditAtRef.current)
      );
      const timer = setTimeout(
        () => setError('Masukkan angka yang valid.'),
        remaining
      );
      return () => clearTimeout(timer);
    }

    if (draftNumber < min || draftNumber > max) {
      const remaining = Math.max(
        0,
        minimumValidationDelay - (Date.now() - lastEditAtRef.current)
      );
      const timer = setTimeout(() => {
        setError(draftNumber < min ? resolvedMinError : resolvedMaxError);
      }, remaining);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [
    draftValue,
    draftNumber,
    isEditing,
    isNumericDraft,
    isPartialNumber,
    max,
    min,
    resolvedMaxError,
    resolvedMinError,
  ]);

  useEffect(() => {
    if (!isEditing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  useEffect(
    () => () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    },
    []
  );

  const clamp = (number) =>
    Math.min(max, Math.max(min, Number(number.toFixed(decimalPlaces))));

  const handleStep = (direction) => {
    const base = isNumericDraft ? draftNumber : normalizedValue;
    const nextValue = clamp(base + direction * step);
    setDraftValue(String(nextValue));
    setError(null);
    if (nextValue !== normalizedValue) onChange?.(nextValue);
  };

  const handleChange = (event) => {
    const raw = event.target.value
      .replace(/[^\d,.-]/g, '')
      .replace(/(?!^)-/g, '');
    lastEditAtRef.current = Date.now();
    setDraftValue(raw);
    setError(null);
  };

  const handleBlur = () => {
    const parsed = isNumericDraft ? draftNumber : Number.NaN;

    // Empty, `null`, zero and non-numeric drafts must never be committed.
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setDraftValue(String(normalizedValue));
      setError(null);
      setIsEditing(false);
      return;
    }

    const clamped = clamp(parsed);
    if (clamped !== parsed) {
      setError(parsed < min ? resolvedMinError : resolvedMaxError);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setError(null), 2800);
    } else {
      setError(null);
    }

    setDraftValue(String(clamped));
    setIsEditing(false);
    if (clamped !== normalizedValue) onChange?.(clamped);
  };

  const startEditing = () => {
    lastEditAtRef.current = Date.now();
    setDraftValue(String(normalizedValue));
    setIsEditing(true);
  };

  const displayValue = isNumericDraft ? draftNumber : normalizedValue;
  const atMin = displayValue <= min;
  const atMax = displayValue >= max;
  const stepButtonClass =
    'flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-200 transition hover:border-slate-700 hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35';

  return (
    <div className={`min-w-0 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-300">{label}</label>
        <span className="shrink-0 font-mono text-xs text-slate-500">
          {min} – {max}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleStep(-1)}
          disabled={atMin}
          className={stepButtonClass}
          aria-label={`Kurangi ${label}`}
        >
          <Minus size={18} strokeWidth={2.4} />
        </button>

        <div className="relative min-w-0 flex-1">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              inputMode={decimalPlaces > 0 ? 'decimal' : 'numeric'}
              enterKeyHint="done"
              autoComplete="off"
              value={draftValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur();
              }}
              aria-label={label}
              aria-invalid={Boolean(error)}
              className="min-h-11 w-full min-w-0 rounded-xl border border-blue-500/60 bg-slate-900 px-2 text-center text-base font-mono tabular-nums text-slate-100 outline-none ring-2 ring-blue-500/10 transition focus:border-blue-500 focus:ring-blue-500/20"
            />
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className="flex min-h-11 w-full min-w-0 items-center justify-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-2 text-lg font-bold text-slate-100 transition hover:border-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              aria-label={`Ubah ${label}. Nilai saat ini ${normalizedValue}${unit ? ` ${unit}` : ''}`}
            >
              <RollingNumber
                value={normalizedValue}
                maximumFractionDigits={decimalPlaces}
                className="font-mono text-lg font-bold text-slate-100"
              />
              {unit ? (
                <span className="text-xs font-medium text-slate-500">{unit}</span>
              ) : null}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleStep(1)}
          disabled={atMax}
          className={stepButtonClass}
          aria-label={`Tambah ${label}`}
        >
          <Plus size={18} strokeWidth={2.4} />
        </button>
      </div>

      <TextReveal
        text={error}
        className="mt-1.5"
        lineClassName="text-xs font-medium leading-relaxed text-rose-400"
      />
    </div>
  );
}
