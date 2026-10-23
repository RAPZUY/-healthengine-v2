'use client';

import React, { useId, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Flame,
  Footprints,
  Gauge,
  Minus,
  Timer,
  TrendingUp,
} from 'lucide-react';
import NumberInput from '@/components/ui/NumberInput';
import { RollingNumber } from '@/components/ui/motion-primitives';
import { useToast } from '@/components/ui/ToastProvider';

const CHART_WIDTH = 320;
const CHART_HEIGHT = 168;
const PAD = { top: 16, right: 12, bottom: 26, left: 40 };

export function formatPace(totalSeconds) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function getRunCategory(paceSeconds) {
  if (paceSeconds < 270) {
    return {
      id: 'elite',
      label: 'Elit / Sangat Kencang',
      description:
        'Pace di bawah 4:30 /km. Jaga teknik langkah, sepatu, dan pemulihan agar tidak overtraining.',
      chip: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400',
      bar: 'bg-emerald-500',
    };
  }
  if (paceSeconds < 330) {
    return {
      id: 'athletic',
      label: 'Sangat Baik (Atletis)',
      description:
        'Pace 4:30 sampai 5:30 /km. Basis aerobikmu kuat, tambahkan variasi interval ringan.',
      chip: 'border-sky-500/25 bg-sky-500/10 text-sky-400',
      bar: 'bg-sky-500',
    };
  }
  if (paceSeconds < 390) {
    return {
      id: 'fit',
      label: 'Baik (Bugar & Konsisten)',
      description:
        'Pace 5:30 sampai 6:30 /km. Ini zona nyaman untuk membangun konsistensi mingguan.',
      chip: 'border-blue-500/25 bg-blue-500/10 text-blue-400',
      bar: 'bg-blue-500',
    };
  }
  if (paceSeconds <= 480) {
    return {
      id: 'active',
      label: 'Cukup (Pemula Aktif)',
      description:
        'Pace 6:30 sampai 8:00 /km. Fokus pada durasi dan napas, bukan mengejar kecepatan.',
      chip: 'border-amber-500/25 bg-amber-500/10 text-amber-400',
      bar: 'bg-amber-500',
    };
  }
  return {
    id: 'easy',
    label: 'Jogging Santai / Pemanasan',
    description:
      'Pace di atas 8:00 /km. Tetap bergerak, lalu tingkatkan perlahan 5 sampai 10 detik per sesi.',
    chip: 'border-slate-600 bg-slate-800/60 text-slate-300',
    bar: 'bg-slate-500',
  };
}

function smoothPath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const middle = (current.x + next.x) / 2;
    path += ` C ${middle} ${current.y}, ${middle} ${next.y}, ${next.x} ${next.y}`;
  }
  return path;
}

function RunChart({ history, metric }) {
  const reduce = useReducedMotion();
  const gradientId = useId().replace(/:/g, '');

  const chart = useMemo(() => {
    const entries = [...history]
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(-12);

    if (entries.length === 0) return null;

    const values = entries.map((entry) =>
      metric === 'pace' ? entry.paceSec : entry.distanceKm
    );
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const padding =
      metric === 'pace'
        ? Math.max(15, (maxValue - minValue) * 0.18)
        : Math.max(0.4, (maxValue - minValue) * 0.2);
    const lower = Math.max(metric === 'pace' ? 120 : 0, minValue - padding);
    const upper = maxValue + padding;
    const span = upper - lower || 1;

    const innerWidth = CHART_WIDTH - PAD.left - PAD.right;
    const innerHeight = CHART_HEIGHT - PAD.top - PAD.bottom;

    const points = entries.map((entry, index) => {
      const value = metric === 'pace' ? entry.paceSec : entry.distanceKm;
      const x =
        PAD.left +
        (entries.length === 1 ? innerWidth / 2 : (index / (entries.length - 1)) * innerWidth);
      const y = PAD.top + (1 - (value - lower) / span) * innerHeight;
      return {
        x,
        y,
        value,
        date: entry.createdAt,
      };
    });

    return {
      entries,
      points,
      path: smoothPath(points),
      area: `${smoothPath(points)} L ${points[points.length - 1].x} ${
        CHART_HEIGHT - PAD.bottom
      } L ${points[0].x} ${CHART_HEIGHT - PAD.bottom} Z`,
      lower,
      upper,
    };
  }, [history, metric]);

  if (!chart) return null;

  const labelFor = (value) =>
    metric === 'pace' ? formatPace(value) : value.toFixed(1);
  const first = chart.points[0];
  const last = chart.points[chart.points.length - 1];
  const dateLabel = (timestamp) =>
    new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
    });

  return (
    <div className="surface-inset mt-3 rounded-xl p-2.5">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Grafik perkembangan ${metric === 'pace' ? 'pace' : 'jarak'} lari`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              style={{ stopColor: 'var(--accent-strong)', stopOpacity: 0.28 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: 'var(--accent-strong)', stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((ratio) => {
          const y = PAD.top + ratio * (CHART_HEIGHT - PAD.top - PAD.bottom);
          return (
            <line
              key={ratio}
              x1={PAD.left}
              y1={y}
              x2={CHART_WIDTH - PAD.right}
              y2={y}
              stroke="var(--chart-grid)"
              strokeWidth="1"
              strokeDasharray={ratio === 1 ? '0' : '3 4'}
            />
          );
        })}

        <text
          x={PAD.left - 6}
          y={PAD.top + 3}
          textAnchor="end"
          fill="var(--color-slate-500)"
          fontSize="8"
          fontFamily="var(--font-geist-mono), monospace"
        >
          {labelFor(chart.upper)}
        </text>
        <text
          x={PAD.left - 6}
          y={CHART_HEIGHT - PAD.bottom + 2}
          textAnchor="end"
          fill="var(--color-slate-500)"
          fontSize="8"
          fontFamily="var(--font-geist-mono), monospace"
        >
          {labelFor(chart.lower)}
        </text>

        <path d={chart.area} fill={`url(#${gradientId})`} />
        <motion.path
          d={chart.path}
          fill="none"
          stroke="var(--accent-strong)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0.4 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
        />

        {chart.points.map((point) => (
          <circle
            key={point.date}
            cx={point.x}
            cy={point.y}
            r="3.2"
            fill="var(--accent-strong)"
            stroke="var(--app-card-bg)"
            strokeWidth="1.6"
          >
            <title>
              {dateLabel(point.date)}: {labelFor(point.value)}
              {metric === 'pace' ? ' /km' : ' km'}
            </title>
          </circle>
        ))}

        <text
          x={first.x}
          y={CHART_HEIGHT - 7}
          textAnchor={chart.points.length === 1 ? 'middle' : 'start'}
          fill="var(--color-slate-500)"
          fontSize="8"
          fontFamily="var(--font-geist-sans), sans-serif"
        >
          {dateLabel(first.date)}
        </text>
        {chart.points.length > 1 ? (
          <text
            x={last.x}
            y={CHART_HEIGHT - 7}
            textAnchor="end"
            fill="var(--color-slate-500)"
            fontSize="8"
            fontFamily="var(--font-geist-sans), sans-serif"
          >
            {dateLabel(last.date)}
          </text>
        ) : null}

        <text
          x={last.x}
          y={Math.max(10, last.y - 8)}
          textAnchor={last.x > CHART_WIDTH - 60 ? 'end' : 'middle'}
          fill="var(--accent-soft-text)"
          fontSize="9"
          fontWeight="700"
          fontFamily="var(--font-geist-mono), monospace"
        >
          {labelFor(last.value)}
        </text>
      </svg>
    </div>
  );
}

function TrendIcon({ direction }) {
  if (direction > 0) {
    return <ArrowUpRight size={15} strokeWidth={2.6} aria-hidden="true" />;
  }
  if (direction < 0) {
    return <ArrowDownRight size={15} strokeWidth={2.6} aria-hidden="true" />;
  }
  return <Minus size={15} strokeWidth={2.6} aria-hidden="true" />;
}

export default function RunningTrackerSection({
  weightKg = 60,
  runningHistory = [],
  onSaveRun,
}) {
  const { toast } = useToast();
  const [distanceKm, setDistanceKm] = useState(5);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [chartMetric, setChartMetric] = useState('pace');

  const totalSeconds = Math.max(0, minutes * 60 + seconds);
  const hasInput = distanceKm > 0 && totalSeconds > 0;
  const previewPace = hasInput ? totalSeconds / distanceKm : 0;
  const previewSpeed = hasInput ? distanceKm / (totalSeconds / 3600) : 0;
  const previewCalories = hasInput
    ? Math.round(distanceKm * Number(weightKg || 60) * 1.036)
    : 0;
  const previewCategory = hasInput ? getRunCategory(previewPace) : null;

  const latest = runningHistory[0] ?? null;
  const previous = runningHistory[1] ?? null;
  const latestCategory = latest ? getRunCategory(latest.paceSec) : null;

  const feedback = useMemo(() => {
    if (!latest) {
      return {
        direction: 0,
        text: 'Simpan sesi lari pertamamu untuk mulai melihat tren pace dan jarak.',
      };
    }
    if (!previous) {
      return {
        direction: 0,
        text: 'Sesi pertama tercatat. Sesi berikutnya akan dibandingkan otomatis di sini.',
      };
    }

    const paceDelta = previous.paceSec - latest.paceSec;
    if (paceDelta >= 2) {
      return {
        direction: 1,
        text: `Pace larimu makin tajam ${Math.round(paceDelta)} detik/km dibanding sesi sebelumnya. Pertahankan ritme ini.`,
      };
    }
    if (paceDelta <= -2) {
      return {
        direction: -1,
        text: `Pace sesi ini ${Math.abs(Math.round(paceDelta))} detik/km lebih lambat. Cek istirahat, hidrasi, dan suhu tubuhmu.`,
      };
    }

    const distanceDelta = latest.distanceKm - previous.distanceKm;
    if (distanceDelta >= 0.5) {
      return {
        direction: 1,
        text: `Pace stabil dan jarak bertambah ${distanceDelta.toFixed(1)} km. Daya tahanmu sedang naik.`,
      };
    }
    return {
      direction: 0,
      text: 'Pace dan jarakmu stabil. Konsistensi seperti ini yang membangun fondasi aerobik.',
    };
  }, [latest, previous]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!hasInput) {
      toast({
        tone: 'warning',
        text: 'Lengkapi jarak dan waktu lari',
        description:
          'Jarak minimal 0.5 km dan waktu tempuh harus lebih dari 0 detik.',
        icon: <Footprints size={17} strokeWidth={2.2} />,
      });
      return;
    }

    const category = getRunCategory(previewPace);
    const entry = {
      id: `run-${Date.now()}`,
      createdAt: Date.now(),
      dateKey: new Date().toISOString().slice(0, 10),
      distanceKm: Number(distanceKm.toFixed(1)),
      durationSec: totalSeconds,
      paceSec: Math.round(previewPace),
      speedKmh: Number(previewSpeed.toFixed(1)),
      calories: previewCalories,
      categoryId: category.id,
      categoryLabel: category.label,
    };

    onSaveRun?.(entry);
    toast({
      tone: 'success',
      text: `Lari ${entry.distanceKm.toFixed(1)} km tersimpan`,
      description: `Pace ${formatPace(entry.paceSec)} /km, ${entry.speedKmh.toFixed(
        1
      )} km/jam, sekitar ${entry.calories} kkal.`,
      icon: <TrendingUp size={17} strokeWidth={2.2} />,
      duration: 6000,
    });
  };

  return (
    <div className="space-y-5">
      <div className="surface-card rounded-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Modul lari
            </p>
            <h2 className="mt-1 text-lg font-bold leading-tight text-slate-100">
              Catat Lari &amp; Baca Pace
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Masukkan jarak dan waktu tempuh. Pace, kecepatan, kalori, dan
              kategori performa dihitung otomatis.
            </p>
          </div>
          <span className="surface-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-slate-400">
            <Footprints size={20} strokeWidth={2.2} aria-hidden="true" />
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <NumberInput
            label="Jarak lari"
            value={distanceKm}
            onChange={setDistanceKm}
            min={0.5}
            max={100}
            step={0.5}
            unit="km"
            minError="Jarak minimal 0.5 km"
          />

          <div className="grid gap-4">
            <NumberInput
              label="Waktu tempuh, menit"
              value={minutes}
              onChange={setMinutes}
              min={1}
              max={600}
              step={1}
              unit="menit"
            />
            <NumberInput
              label="Waktu tempuh, detik"
              value={seconds}
              onChange={setSeconds}
              min={0}
              max={59}
              step={1}
              unit="detik"
            />
          </div>

          <div className="surface-inset grid grid-cols-3 gap-2 rounded-2xl p-3.5">
            <div className="min-w-0 text-center">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Pace
              </span>
              <span className="mt-1 block font-mono text-sm font-bold text-slate-100">
                {hasInput ? `${formatPace(previewPace)}` : '--:--'}
              </span>
              <span className="text-[10px] text-slate-500">/km</span>
            </div>
            <div className="min-w-0 text-center">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Kecepatan
              </span>
              <span className="mt-1 block font-mono text-sm font-bold text-slate-100">
                {hasInput ? previewSpeed.toFixed(1) : '0.0'}
              </span>
              <span className="text-[10px] text-slate-500">km/jam</span>
            </div>
            <div className="min-w-0 text-center">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Kalori
              </span>
              <span className="mt-1 block font-mono text-sm font-bold text-slate-100">
                {hasInput ? previewCalories : 0}
              </span>
              <span className="text-[10px] text-slate-500">kkal</span>
            </div>
          </div>

          {previewCategory ? (
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${previewCategory.chip}`}
              >
                {previewCategory.label}
              </span>
              <span className="text-[11px] leading-snug text-slate-500">
                Estimasi dari {weightKg} kg berat badan.
              </span>
            </div>
          ) : null}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.985 }}
            className="accent-solid flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold"
          >
            <TrendingUp size={17} strokeWidth={2.4} aria-hidden="true" />
            Simpan &amp; Analisis Lari
          </motion.button>
        </form>
      </div>

      {latest ? (
        <div className="surface-card space-y-4 rounded-2xl p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Sesi terakhir
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-mono text-2xl font-bold text-slate-100">
                  {latest.distanceKm.toFixed(1)}
                </span>
                <span className="text-xs font-semibold text-slate-400">km</span>
                <span className="text-slate-600" aria-hidden="true">
                  •
                </span>
                <span className="font-mono text-sm font-bold text-slate-300">
                  {formatPace(latest.paceSec)} /km
                </span>
              </div>
            </div>
            {latestCategory ? (
              <span
                className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${latestCategory.chip}`}
              >
                {latestCategory.label}
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="surface-inset min-w-0 rounded-xl p-3 text-center">
              <Gauge
                size={14}
                className="mx-auto text-slate-500"
                aria-hidden="true"
              />
              <span className="mt-1.5 block font-mono text-sm font-bold text-slate-100">
                {latest.speedKmh.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500">km/jam</span>
            </div>
            <div className="surface-inset min-w-0 rounded-xl p-3 text-center">
              <Timer
                size={14}
                className="mx-auto text-slate-500"
                aria-hidden="true"
              />
              <span className="mt-1.5 block font-mono text-sm font-bold text-slate-100">
                {Math.floor(latest.durationSec / 60)}:
                {String(latest.durationSec % 60).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-500">durasi</span>
            </div>
            <div className="surface-inset min-w-0 rounded-xl p-3 text-center">
              <Flame
                size={14}
                className="mx-auto text-slate-500"
                aria-hidden="true"
              />
              <span className="mt-1.5 block font-mono text-sm font-bold text-slate-100">
                {latest.calories}
              </span>
              <span className="text-[10px] text-slate-500">kkal</span>
            </div>
          </div>

          <div className="surface-inset flex items-start gap-2 rounded-xl p-3.5">
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                feedback.direction > 0
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : feedback.direction < 0
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'surface-chip text-slate-400'
              }`}
            >
              <TrendIcon direction={feedback.direction} />
            </span>
            <p className="text-xs leading-relaxed text-slate-300">
              {feedback.text}
            </p>
          </div>

          {latestCategory ? (
            <p className="text-xs leading-relaxed text-slate-500">
              {latestCategory.description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="surface-card rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-100">
              <TrendingUp
                size={15}
                className="text-[var(--accent-soft-text)]"
                aria-hidden="true"
              />
              Perkembangan Lari
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {runningHistory.length} sesi tercatat
            </p>
          </div>

          <div
            role="group"
            aria-label="Metrik grafik lari"
            className="surface-inset flex items-center gap-1 rounded-xl p-1"
          >
            {[
              { id: 'pace', label: 'Pace' },
              { id: 'distance', label: 'Jarak' },
            ].map((option) => {
              const isActive = chartMetric === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setChartMetric(option.id)}
                  aria-pressed={isActive}
                  className={`flex min-h-11 items-center rounded-lg px-3 text-[11px] font-bold transition-colors ${
                    isActive
                      ? 'accent-pill'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {runningHistory.length === 0 ? (
          <div className="surface-inset mt-4 rounded-2xl border-dashed p-6 text-center">
            <Footprints
              size={22}
              className="mx-auto text-slate-500"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm font-semibold text-slate-300">
              Belum ada sesi lari
            </p>
            <p className="mx-auto mt-1 max-w-[16rem] text-xs leading-relaxed text-slate-500">
              Setelah kamu menyimpan sesi pertama, grafik pace dan jarak akan
              muncul di sini.
            </p>
          </div>
        ) : (
          <>
            <RunChart history={runningHistory} metric={chartMetric} />

            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Riwayat terbaru
              </p>
              <ul className="space-y-2">
                {runningHistory.slice(0, 6).map((entry) => {
                  const category = getRunCategory(entry.paceSec);
                  return (
                    <li
                      key={entry.id}
                      className="surface-inset rounded-xl p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="min-w-0 truncate text-xs font-semibold text-slate-300">
                          {new Date(entry.createdAt).toLocaleDateString(
                            'id-ID',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </span>
                        <span
                          className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold ${category.chip}`}
                        >
                          {category.label}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs text-slate-400">
                        <span className="inline-flex items-baseline gap-1">
                          <strong className="text-sm font-bold text-slate-100">
                            <RollingNumber
                              value={entry.distanceKm}
                              maximumFractionDigits={1}
                            />
                          </strong>
                          <span className="text-[10px] text-slate-500">km</span>
                        </span>
                        <span className="inline-flex items-baseline gap-1">
                          <strong className="font-bold text-slate-200">
                            {formatPace(entry.paceSec)}
                          </strong>
                          <span className="text-[10px] text-slate-500">/km</span>
                        </span>
                        <span className="inline-flex items-baseline gap-1">
                          <strong className="font-bold text-slate-200">
                            {entry.speedKmh.toFixed(1)}
                          </strong>
                          <span className="text-[10px] text-slate-500">
                            km/jam
                          </span>
                        </span>
                        <span className="ml-auto text-[10px] text-slate-500">
                          {entry.calories} kkal
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
