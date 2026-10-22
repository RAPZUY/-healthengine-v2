'use client';

import React, { useId, useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { RollingNumber } from '@/components/ui/motion-primitives';

const GOAL_LABELS = {
  bulking: 'Bulking',
  cutting: 'Cutting',
  maintenance: 'Maintenance',
};

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

function buildEvaluation({ deltaKg, activeGoal, hasPrevious }) {
  if (!hasPrevious) {
    return {
      tone: 'neutral',
      title: 'Catatan pertama tersimpan',
      body: 'Timbang badan di waktu yang sama setiap minggu agar grafiknya mencerminkan tren, bukan fluktuasi harian.',
      direction: 0,
    };
  }

  const abs = Math.abs(deltaKg).toFixed(1);
  const goal = GOAL_LABELS[activeGoal] ?? 'Maintenance';

  if (activeGoal === 'bulking') {
    if (deltaKg > 0.2) {
      return {
        tone: 'positive',
        title: `Naik +${abs} kg, sesuai arah bulking`,
        body: `Wah, kamu naik +${abs} kg dari catatan sebelumnya! Ayo lanjutkan bulking sehat dengan protein cukup dan surplus ringan, bukan makan berlebih.`,
        direction: 1,
      };
    }
    if (deltaKg < -0.2) {
      return {
        tone: 'warning',
        title: `Turun ${abs} kg, belum sesuai target`,
        body: `Beratmu turun ${abs} kg dari catatan sebelumnya. Tambah porsi protein dan surplus 200 sampai 300 kkal, lalu cek kualitas tidurmu.`,
        direction: -1,
      };
    }
    return {
      tone: 'neutral',
      title: 'Berat stabil di fase bulking',
      body: 'Beratmu stabil. Untuk membangun otot, pastikan surplus kalori kecil tetap konsisten dan latihan beban progresif.',
      direction: 0,
    };
  }

  if (activeGoal === 'cutting') {
    if (deltaKg < -0.2) {
      return {
        tone: 'positive',
        title: `Turun ${abs} kg, tepat di jalur`,
        body: `Mantap! Beratmu turun ${abs} kg dari catatan sebelumnya. Pertahankan defisit kalori terukurmu dan jaga asupan protein agar otot tetap utuh.`,
        direction: -1,
      };
    }
    if (deltaKg > 0.2) {
      return {
        tone: 'warning',
        title: `Naik +${abs} kg, perlu evaluasi`,
        body: `Beratmu naik +${abs} kg dari catatan sebelumnya. Periksa kalori tersembunyi, kurangi camilan manis, dan tambah 20 menit jalan cepat.`,
        direction: 1,
      };
    }
    return {
      tone: 'neutral',
      title: 'Belum ada penurunan berarti',
      body: 'Beratmu stabil. Defisit kecil tetap valid asalkan lingkar pinggang dan performa latihan membaik. Jangan memotong kalori terlalu dalam.',
      direction: 0,
    };
  }

  if (Math.abs(deltaKg) < 0.5) {
    return {
      tone: 'positive',
      title: 'Berat stabil dan terkendali',
      body: 'Beratmu stabil dalam rentang sehat. Jaga pola makan seimbang, serat, dan aktivitas harian seperti sekarang.',
      direction: 0,
    };
  }

  return {
    tone: 'neutral',
    title: `Fluktuasi ${deltaKg > 0 ? '+' : ''}${abs} kg`,
    body:
      deltaKg > 0
        ? `Naik +${abs} kg dari catatan sebelumnya. Fluktuasi ini normal, tetapi pantau tren dua sampai tiga minggu ke depan.`
        : `Turun ${abs} kg dari catatan sebelumnya. Pastikan penurunan ini disengaja dan asupan protein tetap tercukupi.`,
    direction: deltaKg > 0 ? 1 : -1,
  };
}

export default function WeightProgressCard({
  weightHistory = [],
  weightTarget,
  activeGoal = 'maintenance',
}) {
  const gradientId = useId().replace(/:/g, '');

  const sortedHistory = useMemo(
    () => [...weightHistory].sort((a, b) => b.date.localeCompare(a.date)),
    [weightHistory]
  );

  const recentEntries = sortedHistory.slice(0, 7);
  const chartData = useMemo(
    () =>
      [...weightHistory]
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14),
    [weightHistory]
  );

  const latest = chartData[chartData.length - 1];
  const previous = chartData[chartData.length - 2];
  const deltaKg = previous
    ? Number((latest.weight - previous.weight).toFixed(1))
    : 0;

  const evaluation = useMemo(
    () =>
      buildEvaluation({
        deltaKg,
        activeGoal,
        hasPrevious: Boolean(previous),
      }),
    [deltaKg, activeGoal, previous]
  );

  const targetWeight = weightTarget?.targetOptimalKg ?? null;

  const chart = useMemo(() => {
    if (chartData.length === 0) return null;

    const weights = chartData.map((entry) => entry.weight);
    const targetInRange =
      targetWeight &&
      targetWeight > Math.min(...weights) - 2 &&
      targetWeight < Math.max(...weights) + 2;
    const values = targetInRange ? [...weights, targetWeight] : weights;
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const padding = Math.max(0.8, (rawMax - rawMin) * 0.24);
    const minWeight = rawMin - padding;
    const maxWeight = rawMax + padding;

    const width = 320;
    const height = 152;
    const pad = { top: 20, right: 12, bottom: 24, left: 34 };
    const innerWidth = width - pad.left - pad.right;
    const innerHeight = height - pad.top - pad.bottom;

    const points = chartData.map((entry, index) => {
      const x =
        pad.left +
        (chartData.length === 1
          ? innerWidth / 2
          : (index / (chartData.length - 1)) * innerWidth);
      const y =
        pad.top +
        (1 - (entry.weight - minWeight) / (maxWeight - minWeight)) *
          innerHeight;
      return { x, y, weight: entry.weight, date: entry.date };
    });

    const path = smoothPath(points);
    const area = `${path} L ${points[points.length - 1].x} ${
      height - pad.bottom
    } L ${points[0].x} ${height - pad.bottom} Z`;

    const targetY =
      targetInRange && targetWeight
        ? pad.top +
          (1 - (targetWeight - minWeight) / (maxWeight - minWeight)) *
            innerHeight
        : null;

    return {
      width,
      height,
      pad,
      points,
      path,
      area,
      minWeight,
      maxWeight,
      targetY,
    };
  }, [chartData, targetWeight]);

  if (weightHistory.length === 0) {
    return (
      <div className="surface-card rounded-2xl p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400">
            📈
          </span>
          <h3 className="text-sm font-bold text-slate-100">
            Perkembangan Berat Badan
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-slate-400">
          Belum ada catatan. Buka &quot;Edit Profil&quot; dan simpan berat
          badanmu untuk memulai grafik. Catatan berikutnya akan dibandingkan
          otomatis.
        </p>
      </div>
    );
  }

  const changeInfo = previous
    ? (() => {
        const diff = Number((latest.weight - previous.weight).toFixed(1));
        const abs = Math.abs(diff).toFixed(1);
        if (diff > 0) {
          return { badge: `+${abs} kg`, direction: 1 };
        }
        if (diff < 0) {
          return { badge: `-${abs} kg`, direction: -1 };
        }
        return { badge: '0.0 kg', direction: 0 };
      })()
    : null;

  const toneClass =
    evaluation.tone === 'positive'
      ? 'border-emerald-500/25 bg-emerald-500/10'
      : evaluation.tone === 'warning'
        ? 'border-amber-500/25 bg-amber-500/10'
        : 'surface-inset';

  const iconClass =
    evaluation.tone === 'positive'
      ? 'bg-emerald-500/15 text-emerald-400'
      : evaluation.tone === 'warning'
        ? 'bg-amber-500/15 text-amber-400'
        : 'bg-slate-800 text-slate-400';

  const ChartIcon =
    evaluation.direction > 0
      ? ArrowUpRight
      : evaluation.direction < 0
        ? ArrowDownRight
        : Minus;

  return (
    <div className="surface-card space-y-5 rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400">
            📈
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Perkembangan Berat Badan
            </h3>
            <p className="text-[11px] text-slate-500">
              {sortedHistory.length} catatan · target{' '}
              {GOAL_LABELS[activeGoal] ?? 'Maintenance'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {targetWeight ? (
            <span className="rounded-lg border border-slate-800 bg-slate-950/60 px-2 py-1 font-mono text-[11px] font-semibold text-slate-400">
              ~{targetWeight.toFixed(1)} kg
            </span>
          ) : null}
          {changeInfo ? (
            <span
              className={`inline-flex items-center gap-0.5 rounded-lg px-2 py-1 font-mono text-[11px] font-bold ${
                changeInfo.direction > 0
                  ? 'bg-amber-500/10 text-amber-400'
                  : changeInfo.direction < 0
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-slate-800 text-slate-300'
              }`}
            >
              <ChartIcon size={12} strokeWidth={2.6} aria-hidden="true" />
              {changeInfo.badge}
            </span>
          ) : null}
        </div>
      </div>

      {chart ? (
        <div className="surface-inset rounded-xl p-2.5">
          <svg
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Grafik berat badan dari ${chart.points[0].date} sampai ${
              chart.points[chart.points.length - 1].date
            }`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  style={{
                    stopColor:
                      evaluation.tone === 'warning'
                        ? 'var(--color-amber-500)'
                        : 'var(--color-emerald-500)',
                    stopOpacity: 0.3,
                  }}
                />
                <stop
                  offset="100%"
                  style={{
                    stopColor:
                      evaluation.tone === 'warning'
                        ? 'var(--color-amber-500)'
                        : 'var(--color-emerald-500)',
                    stopOpacity: 0,
                  }}
                />
              </linearGradient>
            </defs>

            {[0, 0.5, 1].map((ratio) => {
              const y =
                chart.pad.top +
                ratio * (chart.height - chart.pad.top - chart.pad.bottom);
              return (
                <line
                  key={ratio}
                  x1={chart.pad.left}
                  y1={y}
                  x2={chart.width - chart.pad.right}
                  y2={y}
                  stroke="var(--chart-grid)"
                  strokeWidth="1"
                  strokeDasharray={ratio === 1 ? '0' : '3 4'}
                />
              );
            })}

            <text
              x={chart.pad.left - 6}
              y={chart.pad.top + 3}
              textAnchor="end"
              fill="var(--color-slate-500)"
              fontSize="8"
              fontFamily="var(--font-geist-mono), monospace"
            >
              {chart.maxWeight.toFixed(0)}
            </text>
            <text
              x={chart.pad.left - 6}
              y={chart.height - chart.pad.bottom + 2}
              textAnchor="end"
              fill="var(--color-slate-500)"
              fontSize="8"
              fontFamily="var(--font-geist-mono), monospace"
            >
              {chart.minWeight.toFixed(0)}
            </text>

            {chart.targetY ? (
              <line
                x1={chart.pad.left}
                y1={chart.targetY}
                x2={chart.width - chart.pad.right}
                y2={chart.targetY}
                stroke="var(--color-slate-600)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ) : null}

            <path d={chart.area} fill={`url(#${gradientId})`} />
            <path
              d={chart.path}
              fill="none"
              stroke={
                evaluation.tone === 'warning'
                  ? 'var(--color-amber-500)'
                  : 'var(--color-emerald-500)'
              }
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chart.points.map((point, index) => (
              <g key={point.date}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={index === chart.points.length - 1 ? 4 : 3}
                  fill={
                    evaluation.tone === 'warning'
                      ? 'var(--color-amber-500)'
                      : 'var(--color-emerald-500)'
                  }
                  stroke="var(--surface-1)"
                  strokeWidth="1.6"
                >
                  <title>
                    {point.date}: {point.weight.toFixed(1)} kg
                  </title>
                </circle>
              </g>
            ))}

            <text
              x={chart.points[0].x}
              y={chart.height - 7}
              textAnchor="start"
              fill="var(--color-slate-500)"
              fontSize="8"
              fontFamily="var(--font-geist-sans), sans-serif"
            >
              {chart.points[0].date.slice(5).split('-').reverse().join('/')}
            </text>
            {chart.points.length > 1 ? (
              <text
                x={chart.points[chart.points.length - 1].x}
                y={chart.height - 7}
                textAnchor="end"
                fill="var(--color-slate-500)"
                fontSize="8"
                fontFamily="var(--font-geist-sans), sans-serif"
              >
                {chart.points[chart.points.length - 1].date
                  .slice(5)
                  .split('-')
                  .reverse()
                  .join('/')}
              </text>
            ) : null}

            <text
              x={chart.points[chart.points.length - 1].x}
              y={Math.max(
                10,
                chart.points[chart.points.length - 1].y - 9
              )}
              textAnchor="end"
              fill="var(--accent-soft-text)"
              fontSize="9"
              fontWeight="700"
              fontFamily="var(--font-geist-mono), monospace"
            >
              {chart.points[chart.points.length - 1].weight.toFixed(1)} kg
            </text>
          </svg>
        </div>
      ) : null}

      <div className={`flex items-start gap-2.5 rounded-xl border p-3.5 ${toneClass}`}>
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconClass}`}
        >
          <ChartIcon size={15} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-200">{evaluation.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            {evaluation.body}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {recentEntries.map((entry) => {
          const earlierEntries = chartData.filter(
            (item) => item.date < entry.date
          );
          const earlier = earlierEntries[earlierEntries.length - 1];
          const diff = earlier
            ? Number((entry.weight - earlier.weight).toFixed(1))
            : null;

          return (
            <div
              key={entry.date}
              className="surface-inset flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl px-3 py-2.5 text-xs"
            >
              <span className="w-14 shrink-0 font-mono text-slate-500">
                {entry.date.split('-').reverse().join('/').slice(0, 5)}
              </span>
              <span className="inline-flex items-baseline gap-1 font-mono font-bold text-slate-100">
                <RollingNumber
                  value={entry.weight}
                  maximumFractionDigits={1}
                />
                <span className="text-[11px] font-medium text-slate-400">
                  kg
                </span>
              </span>
              {diff !== null ? (
                <span
                  className={`font-mono text-[11px] font-semibold ${
                    diff > 0
                      ? 'text-amber-400'
                      : diff < 0
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                  }`}
                >
                  {diff > 0 ? '+' : ''}
                  {diff.toFixed(1)} kg
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">
                  Catatan pertama
                </span>
              )}
              {diff !== null ? (
                <span className="ml-auto text-[11px] text-slate-500">
                  {activeGoal === 'bulking'
                    ? diff > 0
                      ? 'Sesuai target'
                      : 'Perlu surplus'
                    : activeGoal === 'cutting'
                      ? diff < 0
                        ? 'Sesuai target'
                        : 'Perlu evaluasi'
                      : Math.abs(diff) < 0.5
                        ? 'Stabil'
                        : 'Fluktuasi'}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
