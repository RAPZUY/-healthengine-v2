'use client';

import React, { useState } from 'react';
import { MARTIAL_ARTS_DISCIPLINES } from '@/data/martialArtsData';

// Koordinat target hotspot anatomis pada tubuh lawan (X, Y) di canvas 320x200
function getTargetCoordinates(animationType) {
  switch (animationType) {
    case 'teep':
      return { x: 222, y: 95, label: 'Ulu Hati (Solar Plexus)', strikeOrigin: { x: 105, y: 135 } };
    case 'low_kick':
      return { x: 215, y: 145, label: 'Paha Luar (Saraf Femoralis)', strikeOrigin: { x: 100, y: 140 } };
    case 'elbow':
      return { x: 220, y: 52, label: 'Rahang & Pelipis Lawan', strikeOrigin: { x: 110, y: 65 } };
    case 'knee':
      return { x: 218, y: 102, label: 'Tulang Rusuk & Liver', strikeOrigin: { x: 115, y: 125 } };
    case 'combo_punch':
      return { x: 224, y: 48, label: 'Dagu & Titik Buta Rahang', strikeOrigin: { x: 108, y: 60 } };
    case 'snap_kick':
      return { x: 222, y: 60, label: 'Dagu Bawah & Tenggorokan', strikeOrigin: { x: 95, y: 140 } };
    case 'slip_cross':
      return { x: 225, y: 50, label: 'Ujung Dagu Terbuka', strikeOrigin: { x: 115, y: 55 } };
    case 'choke_release':
      return { x: 224, y: 72, label: 'Tangan Cekikan & Groin', strikeOrigin: { x: 120, y: 72 } };
    case 'outside_defense':
      return { x: 222, y: 46, label: 'Tulang Hidung (Simultan)', strikeOrigin: { x: 115, y: 55 } };
    case 'stop_kick':
      return { x: 210, y: 156, label: 'Tempurung Lutut Lawan', strikeOrigin: { x: 95, y: 135 } };
    case 'wrist_escape':
      return { x: 165, y: 88, label: 'Celah Ibu Jari Lawan', strikeOrigin: { x: 120, y: 88 } };
    default:
      return { x: 222, y: 90, label: 'Pusat Torso Lawan', strikeOrigin: { x: 100, y: 80 } };
  }
}

export default function MartialArtsSection() {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState('muay_thai');
  const [selectedTechIdx, setSelectedTechIdx] = useState(0);
  const [speedMode, setSpeedMode] = useState(1); // 1 = Normal, 0.5 = Slow-Mo
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const activeDiscipline =
    MARTIAL_ARTS_DISCIPLINES.find((d) => d.id === selectedDisciplineId) ||
    MARTIAL_ARTS_DISCIPLINES[0];

  const activeTech = activeDiscipline.techniques[selectedTechIdx] || activeDiscipline.techniques[0];
  const targetInfo = getTargetCoordinates(activeTech.animationType);

  // Durasi animasi berdasarkan kecepatan
  const animDuration = speedMode === 0.5 ? '2.4s' : '1.2s';

  const handleSelectDiscipline = (id) => {
    setSelectedDisciplineId(id);
    setSelectedTechIdx(0);
  };

  return (
    <div className="space-y-4">
      {/* Selector Disiplin Bela Diri (3 Tab) */}
      <div className="grid grid-cols-3 gap-2">
        {MARTIAL_ARTS_DISCIPLINES.map((d) => {
          const isSelected = d.id === selectedDisciplineId;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => handleSelectDiscipline(d.id)}
              className={`min-h-11 px-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="text-sm">{d.emoji}</span>
              <span className="truncate">{d.name}</span>
            </button>
          );
        })}
      </div>

      {/* Header Disiplin Terpilih */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
            Kurikulum Bela Diri
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
            {activeDiscipline.techniques.length} Teknik Inti
          </span>
        </div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>{activeDiscipline.emoji}</span>
          <span>{activeDiscipline.name}</span>
        </h3>
        <p className="text-xs text-slate-400">{activeDiscipline.tagline} — {activeDiscipline.description}</p>
      </div>

      {/* Technique Chips Selector */}
      <div className="grid grid-cols-2 gap-2">
        {activeDiscipline.techniques.map((tech, idx) => {
          const isSelected = idx === selectedTechIdx;
          return (
            <button
              key={tech.id}
              type="button"
              onClick={() => setSelectedTechIdx(idx)}
              className={`min-h-11 px-3 py-2 rounded-xl border text-left text-xs transition flex flex-col justify-center ${
                isSelected
                  ? 'bg-emerald-600/15 border-emerald-500/50 text-white font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="truncate font-semibold text-slate-200">{tech.name}</span>
              <span className="text-xs font-normal text-slate-500 truncate">{tech.indonesianTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive 2-Silhouette SVG Combat Visualizer */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>🎯</span> Visualizer Titik Serang Lawan
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Siluet Biru (Kamu) vs Siluet Merah (Lawan)
            </p>
          </div>

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => setSpeedMode((prev) => (prev === 1 ? 0.5 : 1))}
            className="min-h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-amber-400 hover:bg-slate-800 transition flex items-center gap-1.5 shrink-0"
            aria-label="Atur Kecepatan Animasi"
          >
            {speedMode === 1 ? '⚡ Normal (1x)' : '🐢 Slow-Mo (0.5x)'}
          </button>
        </div>

        {/* Canvas Visualizer SVG */}
        <div className="relative rounded-xl bg-slate-950 border border-slate-800/80 p-3 overflow-hidden">
          <svg viewBox="0 0 320 200" className="w-full h-auto select-none">
            <defs>
              <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="enemyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
              <marker id="strikeArrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
              </marker>
            </defs>

            {/* Garis Dasar Arena */}
            <line x1="20" y1="180" x2="300" y2="180" stroke="#1e293b" strokeWidth="2" strokeDasharray="6 4" />

            {/* Label Petarung */}
            <text x="80" y="24" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
              🛡️ KAMU (DEFENDER)
            </text>
            <text x="230" y="24" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
              ⚔️ LAWAN (ATTACKER)
            </text>

            {/* ================= SILUET PENGGUNA (BIRU) ================= */}
            <g id="user-silhouette">
              {/* Kepala Pengguna */}
              <circle cx="80" cy="48" r="14" fill="#0f172a" stroke="url(#userGrad)" strokeWidth="2.2" />
              {/* Leher & Torso */}
              <path
                d="M 80 62 L 80 114 M 64 74 L 96 74"
                stroke="url(#userGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Kaki Kuda-Kuda */}
              <polyline
                points="80,114 65,145 60,178"
                fill="none"
                stroke="url(#userGrad)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <polyline
                points="80,114 95,145 105,178"
                fill="none"
                stroke="url(#userGrad)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Lengan Guard / Serang Pengguna */}
              <g
                style={{
                  animation: `userLimbStrike ${animDuration} ease-in-out infinite`,
                  transformOrigin: '80px 74px',
                }}
              >
                <polyline
                  points="68,74 90,82 108,70"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="108" cy="70" r="4.5" fill="#38bdf8" />
              </g>
            </g>

            {/* ================= SILUET LAWAN (MERAH) ================= */}
            <g id="enemy-silhouette">
              {/* Kepala Lawan */}
              <circle cx="230" cy="48" r="14" fill="#0f172a" stroke="url(#enemyGrad)" strokeWidth="2.2" />
              {/* Leher & Torso Lawan */}
              <path
                d="M 230 62 L 230 114 M 214 74 L 246 74"
                stroke="url(#enemyGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Kaki Lawan */}
              <polyline
                points="230,114 218,145 212,178"
                fill="none"
                stroke="url(#enemyGrad)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <polyline
                points="230,114 242,145 250,178"
                fill="none"
                stroke="url(#enemyGrad)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* Lengan Guard Lawan */}
              <polyline
                points="220,74 205,82 208,66"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <polyline
                points="240,74 250,86 245,102"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* ================= PANAH VEKTOR SERANGAN DINAMIS ================= */}
            <g>
              <line
                x1={targetInfo.strikeOrigin.x}
                y1={targetInfo.strikeOrigin.y}
                x2={targetInfo.x}
                y2={targetInfo.y}
                stroke="#34d399"
                strokeWidth="3"
                markerEnd="url(#strikeArrow)"
                strokeDasharray="12 6"
                style={{
                  animation: `attackVectorLine ${animDuration} linear infinite`,
                }}
              />
            </g>

            {/* ================= TITIK TARGET MENYALA (HOTSPOT) ================= */}
            <g>
              {/* Efek Pancaran Lingkaran Ping */}
              <circle
                cx={targetInfo.x}
                cy={targetInfo.y}
                r="12"
                fill="#f43f5e"
                opacity="0.35"
                style={{
                  animation: `hotspotPing ${animDuration} ease-out infinite`,
                  transformOrigin: `${targetInfo.x}px ${targetInfo.y}px`,
                }}
              />
              {/* Inti Titik Sasaran */}
              <circle cx={targetInfo.x} cy={targetInfo.y} r="5.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />

              {/* Garis Penunjuk Label Sasaran */}
              <line
                x1={targetInfo.x}
                y1={targetInfo.y}
                x2={targetInfo.x > 200 ? 280 : 150}
                y2={targetInfo.y < 90 ? targetInfo.y - 14 : targetInfo.y + 14}
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text
                x={targetInfo.x > 200 ? 285 : 145}
                y={targetInfo.y < 90 ? targetInfo.y - 12 : targetInfo.y + 16}
                fill="#fca5a5"
                fontSize="8"
                fontWeight="bold"
                textAnchor={targetInfo.x > 200 ? 'start' : 'end'}
              >
                {targetInfo.label}
              </text>
            </g>
          </svg>

          {/* CSS Animation Keyframes */}
          <style>{`
            @keyframes attackVectorLine {
              0% { stroke-dashoffset: 36; opacity: 0.4; }
              50% { opacity: 1; }
              100% { stroke-dashoffset: 0; opacity: 0.8; }
            }
            @keyframes hotspotPing {
              0% { transform: scale(0.6); opacity: 0.8; }
              50% { transform: scale(1.6); opacity: 0.15; }
              100% { transform: scale(0.6); opacity: 0.8; }
            }
            @keyframes userLimbStrike {
              0% { transform: translateX(0px); }
              45% { transform: translateX(18px); }
              100% { transform: translateX(0px); }
            }
          `}</style>
        </div>

        {/* Informasi Titik Sasaran & Analisis Tempur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-semibold uppercase tracking-wider block">Titik Sasaran Vital</span>
            <div className="font-bold text-rose-400 font-mono text-sm">
              🎯 {activeTech.targetPoint}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-semibold uppercase tracking-wider block">Fungsi Dalam Situasi Nyata</span>
            <p className="text-slate-300 leading-snug">
              {activeTech.combatUse}
            </p>
          </div>
        </div>

        {/* Tahapan Eksekusi Taktis */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span>⚡</span> Langkah Kunci Eksekusi:
          </p>
          <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
            {activeTech.keySteps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="font-medium text-slate-200">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tombol Buka Video Tutorial Resmi */}
        <button
          type="button"
          onClick={() => setActiveVideoModal(activeTech)}
          className="w-full min-h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-rose-950/30"
        >
          <span>▶</span>
          <span>Buka Video Panduan Resmi ({activeTech.channelName})</span>
        </button>
      </div>

      {/* Video YouTube Embed Modal */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{activeVideoModal.name}</h4>
                <p className="text-xs text-slate-400">Kanal: {activeVideoModal.channelName}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="min-h-11 min-w-11 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-center text-sm"
                aria-label="Tutup Video"
              >
                ✕
              </button>
            </div>

            {/* Video Iframe Container (16:9 Aspect) */}
            <div className="p-4 bg-slate-950">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 shadow-inner">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtubeId}?rel=0`}
                  title={activeVideoModal.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2.5 text-center">
                Sumber video tutorial resmi YouTube ({activeVideoModal.channelName}). Latih gerakan secara perlahan sebelum menambah kecepatan tenaga.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-900 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="min-h-11 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Tutup Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
