'use client';

import React, { useMemo } from 'react';

export default function WeightProgressCard({ weightHistory = [], weightTarget, activeGoal }) {
  const sortedHistory = useMemo(() => {
    return [...weightHistory].sort((a, b) => b.date.localeCompare(a.date));
  }, [weightHistory]);

  const recentEntries = sortedHistory.slice(0, 7);
  const chartData = [...weightHistory].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);

  // SVG Sparkline calculation
  const sparkline = useMemo(() => {
    if (chartData.length < 2) return null;
    const weights = chartData.map((d) => d.weight);
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;
    const rangeW = maxW - minW || 1;
    const w = 300;
    const h = 70;
    const padX = 10;
    const padY = 5;

    const points = chartData.map((d, i) => {
      const x = padX + (i / (chartData.length - 1)) * (w - padX * 2);
      const y = padY + (1 - (d.weight - minW) / rangeW) * (h - padY * 2);
      return { x, y, weight: d.weight, date: d.date };
    });

    const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
    const areaPath = `M ${points[0].x},${h} ${points.map((p) => `L ${p.x},${p.y}`).join(' ')} L ${points[points.length - 1].x},${h} Z`;

    // Determine color based on trend vs goal
    const first = weights[0];
    const last = weights[weights.length - 1];
    const diff = last - first;
    let trendGood = false;
    if (activeGoal === 'bulking' && diff > 0) trendGood = true;
    else if (activeGoal === 'cutting' && diff < 0) trendGood = true;
    else if (activeGoal === 'maintenance' && Math.abs(diff) < 1) trendGood = true;

    return { points, polyline, areaPath, trendGood, minW, maxW };
  }, [chartData, activeGoal]);

  const getChangeInfo = (current, previous) => {
    const diff = Number((current - previous).toFixed(1));
    const absDiff = Math.abs(diff);

    let badge = '';
    let badgeColor = 'text-slate-400';
    let analysis = '';
    let analysisColor = 'text-slate-400';

    if (diff > 0) {
      badge = `+${absDiff} kg`;
      badgeColor = 'text-amber-400';
    } else if (diff < 0) {
      badge = `-${absDiff} kg`;
      badgeColor = 'text-emerald-400';
    } else {
      badge = '0 kg';
    }

    if (activeGoal === 'bulking') {
      if (diff > 0) { analysis = '✓ Sesuai target bulking'; analysisColor = 'text-emerald-400'; }
      else if (diff < 0) { analysis = '↓ Belum sesuai target'; analysisColor = 'text-amber-400'; }
      else { analysis = '— Belum ada perubahan'; }
    } else if (activeGoal === 'cutting') {
      if (diff < 0) { analysis = '✓ Sesuai target cutting'; analysisColor = 'text-emerald-400'; }
      else if (diff > 0) { analysis = '↑ Belum sesuai target'; analysisColor = 'text-amber-400'; }
      else { analysis = '— Belum ada perubahan'; }
    } else {
      if (absDiff < 0.5) { analysis = '✓ Berat stabil'; analysisColor = 'text-emerald-400'; }
      else { analysis = '↕ Ada fluktuasi'; analysisColor = 'text-amber-400'; }
    }

    return { badge, badgeColor, analysis, analysisColor };
  };

  if (weightHistory.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📈</span>
          <h3 className="text-sm font-bold text-slate-100">Perkembangan Berat Badan</h3>
        </div>
        <p className="text-xs text-slate-400">Belum ada catatan. Klik &quot;Edit BB / Profil&quot; untuk mulai mencatat.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-base">📈</span>
        <h3 className="text-sm font-bold text-slate-100">Perkembangan Berat Badan</h3>
        <span className="text-xs text-slate-500 font-mono ml-auto">{weightHistory.length} catatan</span>
      </div>

      {/* SVG Sparkline */}
      {sparkline && (
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3">
          <svg viewBox="0 0 300 70" className="w-full h-auto">
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparkline.trendGood ? '#10b981' : '#f43f5e'} stopOpacity="0.2" />
                <stop offset="100%" stopColor={sparkline.trendGood ? '#10b981' : '#f43f5e'} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={sparkline.areaPath} fill="url(#sparkFill)" />
            <polyline
              points={sparkline.polyline}
              fill="none"
              stroke={sparkline.trendGood ? '#10b981' : '#f43f5e'}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {sparkline.points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="3" fill={sparkline.trendGood ? '#10b981' : '#f43f5e'} stroke="#0f172a" strokeWidth="1.5" />
            ))}
            {/* Min/Max labels */}
            <text x="4" y="12" fill="#94a3b8" fontSize="8" fontFamily="monospace">{sparkline.maxW.toFixed(0)} kg</text>
            <text x="4" y="68" fill="#94a3b8" fontSize="8" fontFamily="monospace">{sparkline.minW.toFixed(0)} kg</text>
          </svg>
        </div>
      )}

      {/* Weight History List */}
      <div className="space-y-1.5">
        {recentEntries.map((entry, idx) => {
          const prevEntry = sortedHistory[idx + 1];
          const changeInfo = prevEntry ? getChangeInfo(entry.weight, prevEntry.weight) : null;
          const dateFormatted = entry.date.split('-').reverse().join('/');

          return (
            <div key={entry.date} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-500 font-mono w-12 shrink-0">{dateFormatted.slice(0, 5)}</span>
              <span className="font-bold font-mono text-slate-100">{entry.weight} kg</span>
              {changeInfo && (
                <>
                  <span className={`font-mono font-semibold ${changeInfo.badgeColor}`}>{changeInfo.badge}</span>
                  <span className={`ml-auto ${changeInfo.analysisColor}`}>{changeInfo.analysis}</span>
                </>
              )}
              {!changeInfo && <span className="ml-auto text-slate-500">Catatan pertama</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
