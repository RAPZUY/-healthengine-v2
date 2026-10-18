'use client';

import React, { useState, useEffect } from 'react';
import { MARTIAL_ARTS_DISCIPLINES } from '@/data/martialArtsData';

export default function MartialArtsSection() {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState('muay_thai');
  const [selectedTechIdx, setSelectedTechIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(1); // 1 = Ancaman Lawan, 2 = Tangkisan & Balasan
  const [isAutoPlay, setIsAutoPlay] = useState(true); // Default loop aktif
  const [speedMode, setSpeedMode] = useState(1); // 1 = Normal, 0.5 = Slow-Mo

  const activeDiscipline =
    MARTIAL_ARTS_DISCIPLINES.find((d) => d.id === selectedDisciplineId) ||
    MARTIAL_ARTS_DISCIPLINES[0];

  const activeTech = activeDiscipline.techniques[selectedTechIdx] || activeDiscipline.techniques[0];

  // Auto-Play Loop handler (berganti langkah otomatis tiap 2 detik pada 1x, 3 detik pada 0.5x)
  useEffect(() => {
    if (!isAutoPlay) return;
    const intervalTime = speedMode === 0.5 ? 3000 : 2000;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev === 1 ? 2 : 1));
    }, intervalTime);
    return () => clearInterval(interval);
  }, [isAutoPlay, speedMode]);

  const handleSelectDiscipline = (id) => {
    setSelectedDisciplineId(id);
    setSelectedTechIdx(0);
    setCurrentStep(1);
  };

  const handleSelectTech = (idx) => {
    setSelectedTechIdx(idx);
    setCurrentStep(1);
  };

  // Identifikasi skenario CQC khusus
  const isChoke = activeTech.id === 'km-choke' || activeTech.animationType === 'choke_release';
  const is360 = activeTech.id === 'km-360def' || activeTech.animationType === 'outside_defense';
  const isElbow = activeTech.id === 'mt-elbow' || activeTech.animationType === 'elbow';
  const isTeep = activeTech.id === 'mt-teep' || activeTech.animationType === 'teep';
  const isLowKick = activeTech.id === 'mt-lowkick' || activeTech.animationType === 'low_kick';
  const isKnee = activeTech.id === 'mt-knee' || activeTech.animationType === 'knee';
  const isStopKick = activeTech.id === 'km-stopkick' || activeTech.animationType === 'stop_kick';
  const isWrist = activeTech.id === 'km-wrist' || activeTech.animationType === 'wrist_escape';

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
              onClick={() => handleSelectTech(idx)}
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

      {/* Interactive 2-Silhouette Close-Quarters Combat Visualizer */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
        {/* Header Visualizer & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>⚔️</span> Skenario Kontak Rapat (CQC)
            </h4>
            <p className="text-xs text-slate-400">
              Jarak Rapat Nyata: Kamu (<span className="text-blue-400 font-semibold">Biru</span>) vs Lawan (<span className="text-rose-400 font-semibold">Merah</span>)
            </p>
          </div>

          {/* Toggle Auto-Play & Speed */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsAutoPlay((prev) => !prev)}
              className={`min-h-11 px-3 rounded-xl border text-xs font-semibold transition flex items-center gap-1 ${
                isAutoPlay
                  ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
              aria-label="Toggle Auto Play Loop"
            >
              <span>{isAutoPlay ? '🔁' : '⏸'}</span>
              <span>Loop {isAutoPlay ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSpeedMode((prev) => (prev === 1 ? 0.5 : 1))}
              className="min-h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-amber-400 hover:bg-slate-800 transition flex items-center gap-1"
              aria-label="Atur Kecepatan"
            >
              {speedMode === 1 ? '⚡ 1x' : '🐢 0.5x'}
            </button>
          </div>
        </div>

        {/* Step Selector Tab (Langkah 1 vs Langkah 2) */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => { setCurrentStep(1); setIsAutoPlay(false); }}
            className={`min-h-11 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              currentStep === 1
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⚠️</span>
            <span>Langkah 1: Ancaman Lawan</span>
          </button>
          <button
            type="button"
            onClick={() => { setCurrentStep(2); setIsAutoPlay(false); }}
            className={`min-h-11 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              currentStep === 2
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🛡️</span>
            <span>Langkah 2: Tangkisan & Balasan</span>
          </button>
        </div>

        {/* SVG Canvas Kontak Rapat (viewBox 320x180, dx < 35px) */}
        <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3 overflow-hidden">
          <svg viewBox="0 0 320 180" className="w-full h-auto select-none">
            <defs>
              <linearGradient id="userCqcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="enemyCqcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
              <marker id="strikeCqcArrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
              </marker>
              <marker id="threatCqcArrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#f43f5e" />
              </marker>
            </defs>

            {/* Garis Lantai Arena */}
            <line x1="20" y1="162" x2="300" y2="162" stroke="#1e293b" strokeWidth="2" strokeDasharray="6 4" />

            {/* Indikator Zona Rapat */}
            <rect x="115" y="15" width="90" height="147" fill="#0f172a" opacity="0.4" rx="8" />
            <text x="160" y="26" fill="#64748b" fontSize="7.5" fontWeight="bold" textAnchor="middle">
              ZONA KONTAK RAPAT (dx &lt; 35px)
            </text>

            {/* ==================== 1. SKENARIO: KRAV MAGA FRONT CHOKE ==================== */}
            {isChoke && (
              <g>
                {currentStep === 1 ? (
                  // Langkah 1: Tangan lawan mencengkeram leher kamu
                  <g>
                    {/* Siluet Kamu (Terancam Cekikan) */}
                    <circle cx="138" cy="48" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="138" y1="61" x2="138" y2="108" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="138,108 126,136 122,162" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="138,108 148,136 146,162" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                    {/* Tangan Kamu terkejut bersiap mencungkil */}
                    <polyline points="138,72 130,82 142,66" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Siluet Lawan (Maju Mencekik Leher Kamu) */}
                    <circle cx="172" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="172" y1="61" x2="174" y2="108" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="174,108 168,136 166,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="174,108 186,136 190,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    {/* Kedua tangan lawan menempel di leher Kamu di (138, 62) */}
                    <line x1="170" y1="68" x2="140" y2="62" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="174" y1="72" x2="140" y2="64" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />

                    {/* Titik Bahaya Cekikan Berdenyut */}
                    <circle cx="140" cy="62" r="7" fill="#f43f5e" opacity="0.4" className="animate-ping" />
                    <circle cx="140" cy="62" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="140" y="80" fill="#fca5a5" fontSize="7.5" fontWeight="bold" textAnchor="middle">Cekikan Leher!</text>
                  </g>
                ) : (
                  // Langkah 2: Tanganmu mencungkil menyilang, telapak hantam hidung, lutut ke selangkangan
                  <g>
                    {/* Lawan terpental ke belakang */}
                    <circle cx="178" cy="45" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="178" y1="58" x2="182" y2="108" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="182,108 178,136 176,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="182,108 194,136 198,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    {/* Tangan lawan terlepas ke bawah */}
                    <line x1="176" y1="68" x2="152" y2="82" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Kamu melancarkan pluck + palm strike + knee strike */}
                    <circle cx="136" cy="48" r="13" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="136" y1="61" x2="136" y2="108" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="136,108 126,136 122,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    {/* Lutut Kamu menusuk selangkangan lawan */}
                    <polyline points="136,108 158,116 148,142" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
                    {/* Tangan kiri Kamu mencungkil (pluck) ke bawah */}
                    <polyline points="136,70 148,78 152,86" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                    {/* Tangan kanan Kamu menghantam hidung lawan */}
                    <line x1="136" y1="66" x2="174" y2="46" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" markerEnd="url(#strikeCqcArrow)" />

                    {/* Hantaman Hidung Lawan (Impact Flash) */}
                    <circle cx="174" cy="46" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping" />
                    <circle cx="174" cy="46" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="212" y="44" fill="#34d399" fontSize="8" fontWeight="bold">Hidung Hancur!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 2. SKENARIO: KRAV MAGA 360 DEFENSE ==================== */}
            {is360 && (
              <g>
                {currentStep === 1 ? (
                  // Langkah 1: Pukulan ayun lawan meluncur ke kepala
                  <g>
                    {/* Kamu dalam ancaman */}
                    <circle cx="138" cy="48" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="138" y1="61" x2="138" y2="108" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="138,108 126,136 122,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="138,108 146,136 144,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="138,72 142,66 138,54" fill="none" stroke="#38bdf8" strokeWidth="2.5" />

                    {/* Lawan mengayunkan pukulan melengkung liar */}
                    <circle cx="176" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="176" y1="61" x2="178" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="178,108 174,136 172,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <polyline points="178,108 190,136 194,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    {/* Ayunan lengan lawan mengarah ke kepala kamu di (142, 46) */}
                    <path d="M 176 68 Q 166 36 142 46" fill="none" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" markerEnd="url(#threatCqcArrow)" />

                    <circle cx="142" cy="46" r="6" fill="#f43f5e" opacity="0.3" className="animate-ping" />
                    <text x="148" y="34" fill="#fca5a5" fontSize="7.5" fontWeight="bold">Ayunan Liar!</text>
                  </g>
                ) : (
                  // Langkah 2: Lengan bawah menangkis di udara + telapak membalas ulu hati
                  <g>
                    <circle cx="136" cy="48" r="13" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="136" y1="61" x2="136" y2="108" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="136,108 126,136 122,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="136,108 144,136 142,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />

                    {/* Tangkisan 90 derajat mencegat ayunan lawan di udara */}
                    <polyline points="136,68 152,56 156,38" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />

                    {/* Lawan yang tertahan ayunannya */}
                    <circle cx="176" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="176" y1="61" x2="178" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="178,108 174,136 172,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <polyline points="178,108 190,136 194,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    {/* Tangan lawan terbentur di (154, 42) */}
                    <line x1="176" y1="68" x2="154" y2="42" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="154" cy="42" r="5" fill="#38bdf8" stroke="#fff" strokeWidth="1" />

                    {/* Telapak tangan Kamu secara simultan menghantam ulu hati lawan di (176, 80) */}
                    <line x1="136" y1="74" x2="174" y2="80" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" markerEnd="url(#strikeCqcArrow)" />
                    <circle cx="174" cy="80" r="7" fill="#f43f5e" opacity="0.4" className="animate-ping" />
                    <circle cx="174" cy="80" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="180" y="96" fill="#34d399" fontSize="8" fontWeight="bold">Ulu Hati!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 3. SKENARIO: MUAY THAI HORIZONTAL ELBOW ==================== */}
            {isElbow && (
              <g>
                {currentStep === 1 ? (
                  // Langkah 1: Lawan merangsek maju sangat rapat
                  <g>
                    <circle cx="138" cy="48" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="138" y1="61" x2="138" y2="108" stroke="#38bdf8" strokeWidth="4" />
                    <polyline points="138,108 126,136 122,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="138,108 146,136 144,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    {/* Guard rapat Kamu */}
                    <polyline points="138,70 144,60 142,50" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

                    {/* Lawan merangsek menekan maju */}
                    <circle cx="170" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="170" y1="61" x2="172" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="172,108 168,136 166,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <polyline points="172,108 184,136 188,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <line x1="170" y1="70" x2="148" y2="68" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" markerEnd="url(#threatCqcArrow)" />
                    <text x="175" y="32" fill="#fca5a5" fontSize="7.5" fontWeight="bold">Maju Mencegat</text>
                  </g>
                ) : (
                  // Langkah 2: Tepis tangan lawan, sikutan mendatar menghantam pelipis lawan
                  <g>
                    {/* Tangan kiri Kamu menepis tangan lawan ke bawah */}
                    <line x1="136" y1="74" x2="152" y2="82" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

                    {/* Tubuh Kamu memutar pinggul tajam melontarkan siku mendatar */}
                    <circle cx="138" cy="48" r="13" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="138" y1="61" x2="138" y2="108" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="138,108 128,136 124,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="138,108 146,136 146,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    {/* Siku horizontal menusuk pelipis lawan di (168, 48) */}
                    <polyline points="138,66 156,54 168,48" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />

                    {/* Lawan terkena hantaman telak di pelipis */}
                    <circle cx="174" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="174" y1="61" x2="178" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="178,108 174,136 172,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <polyline points="178,108 190,136 194,162" fill="none" stroke="#f43f5e" strokeWidth="3" />

                    <circle cx="168" cy="48" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping" />
                    <circle cx="168" cy="48" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="176" y="36" fill="#34d399" fontSize="8" fontWeight="bold">Siku Robek!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 4. SKENARIO: MUAY THAI TEEP PUSH KICK ==================== */}
            {isTeep && (
              <g>
                {currentStep === 1 ? (
                  // Langkah 1: Lawan bergerak maju agresif
                  <g>
                    <circle cx="136" cy="48" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="136" y1="61" x2="136" y2="108" stroke="#38bdf8" strokeWidth="4" />
                    <polyline points="136,108 126,136 122,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    {/* Kamu mengangkat lutut depan tinggi (chambering) */}
                    <polyline points="136,108 144,88 138,116" fill="none" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />

                    {/* Lawan maju kencang */}
                    <circle cx="170" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="170" y1="61" x2="170" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="170,108 164,136 160,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <polyline points="170,108 180,136 184,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <line x1="170" y1="68" x2="148" y2="68" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 2" markerEnd="url(#threatCqcArrow)" />
                    <text x="168" y="34" fill="#fca5a5" fontSize="7.5" fontWeight="bold">Serbuan Maju</text>
                  </g>
                ) : (
                  // Langkah 2: Telapak kaki menancap di ulu hati lawan, tubuh lawan condong ke belakang
                  <g>
                    <circle cx="130" cy="52" r="13" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="130" y1="65" x2="128" y2="108" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="128,108 116,136 112,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    {/* Kaki Kamu menendang jejak lurus menancap di ulu hati lawan di (176, 84) */}
                    <polyline points="128,108 152,94 176,84" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" markerEnd="url(#strikeCqcArrow)" />

                    {/* Tubuh lawan terdorong condong tajam ke belakang */}
                    <circle cx="188" cy="44" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="188" y1="57" x2="178" y2="108" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="178,108 174,136 170,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <polyline points="178,108 196,136 204,162" fill="none" stroke="#f43f5e" strokeWidth="3" />

                    <circle cx="176" cy="84" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping" />
                    <circle cx="176" cy="84" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="184" y="98" fill="#34d399" fontSize="8" fontWeight="bold">Teep Telak!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 5. SKENARIO DEFAULT TEKNIK LAINNYA ==================== */}
            {!isChoke && !is360 && !isElbow && !isTeep && (
              <g>
                {currentStep === 1 ? (
                  // Langkah 1: Kuda-kuda lawan menekan
                  <g>
                    <circle cx="138" cy="48" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="138" y1="61" x2="138" y2="108" stroke="#38bdf8" strokeWidth="4" />
                    <polyline points="138,108 126,136 122,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="138,108 146,136 144,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="138,70 146,62 144,52" fill="none" stroke="#38bdf8" strokeWidth="3" />

                    <circle cx="174" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="174" y1="61" x2="174" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="174,108 168,136 166,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <polyline points="174,108 184,136 188,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <line x1="174" y1="70" x2="148" y2="60" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 2" markerEnd="url(#threatCqcArrow)" />
                    <text x="174" y="34" fill="#fca5a5" fontSize="7.5" fontWeight="bold">Ancaman Serangan</text>
                  </g>
                ) : (
                  // Langkah 2: Serangan balik telak
                  <g>
                    <circle cx="138" cy="48" r="13" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="138" y1="61" x2="138" y2="108" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="138,108 126,136 122,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="138,108 148,136 146,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    {/* Hantaman balik terarah */}
                    <line x1="138" y1="68" x2="172" y2="52" stroke="#34d399" strokeWidth="4" strokeLinecap="round" markerEnd="url(#strikeCqcArrow)" />

                    <circle cx="176" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="176" y1="61" x2="180" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="180,108 174,136 172,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <polyline points="180,108 190,136 194,162" fill="none" stroke="#f43f5e" strokeWidth="3" />

                    <circle cx="172" cy="52" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping" />
                    <circle cx="172" cy="52" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="178" y="38" fill="#34d399" fontSize="8" fontWeight="bold">Hantaman Telak!</text>
                  </g>
                )}
              </g>
            )}

            {/* Label Petarung */}
            <text x="80" y="172" fill="#38bdf8" fontSize="8" fontWeight="bold">
              KAMU (DEFENDER)
            </text>
            <text x="240" y="172" fill="#f43f5e" fontSize="8" fontWeight="bold">
              LAWAN (ATTACKER)
            </text>
          </svg>
        </div>

        {/* Tactical Explanation of Current Step */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
              currentStep === 1
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {currentStep === 1 ? 'Langkah 1: Ancaman Lawan' : 'Langkah 2: Tangkisan & Balasan'}
            </span>
            <span className="text-slate-400 font-semibold">{activeTech.name}</span>
          </div>

          <p className="text-slate-300 leading-relaxed pt-1">
            {currentStep === 1 ? (
              isChoke
                ? 'Lawan menempelkan kedua telapak tangan ke tenggorokan untuk mencekik dan memotong pasokan oksigen.'
                : is360
                ? 'Lawan mengayunkan pukulan hook liar melengkung menuju sisi samping kepala atau pelipis kamu.'
                : isElbow
                ? 'Lawan merangsek maju menembus jarak guard dengan agresif untuk menekan tubuh kamu.'
                : isTeep
                ? 'Lawan melangkah maju dengan bobot badan penuh untuk melancarkan serangan kombinasi.'
                : `Lawan memulai serangan agresif mengincar ${activeTech.targetPoint}.`
            ) : (
              isChoke
                ? 'Tanganmu mencungkil menyilang pergelangan lawan (pluck), bersamaan telapak tangan menghantam hidung dan lutut menyengat selangkangan!'
                : is360
                ? 'Lengan bawahmu mencegat ayunan lawan di udara dengan sudut 90 derajat, sambil tangan lain secara simultan menghantam ulu hati lawan!'
                : isElbow
                ? 'Tepis tangan depan lawan ke bawah, putar panggul penuh, dan hujamkan sikutan mendatar tajam menghancurkan pelipis lawan!'
                : isTeep
                ? 'Telapak kakimu menancap kuat ke ulu hati lawan, menyalurkan daya dorong panggul hingga lawan terpental mundur!'
                : `Eksekusi tangkisan terarah dan lepaskan serangan balik eksplosif menghantam ${activeTech.targetPoint}.`
            )}
          </p>
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

        {/* Tahapan Kunci Eksekusi */}
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
      </div>

      {/* ================= KARTU PANDUAN TAKTIS (PENGGANTI IFRAME) ================= */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block">
              Panduan Taktis Eksekusi
            </span>
            <h4 className="text-sm font-bold text-white">{activeTech.name}</h4>
          </div>
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
            Kanal: {activeTech.channelName}
          </span>
        </div>

        {/* 3 Poin Kritis Postur */}
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <span className="text-base shrink-0">👁️</span>
            <div>
              <strong className="text-blue-400 block font-semibold">Area Pandang Mata:</strong>
              <p className="text-slate-300 leading-snug">
                Fokus tatapan ke sternum (dada atas) lawan. Jangan terpaku pada mata atau kepalan tangan agar periferalmu dapat membaca gerak seluruh tungkai tanpa tertipu tipuan (feint).
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <span className="text-base shrink-0">🛡️</span>
            <div>
              <strong className="text-emerald-400 block font-semibold">Posisi Dagu (Tucked Chin):</strong>
              <p className="text-slate-300 leading-snug">
                Tundukkan dagu rapat ke dada dan kunci di balik bahu depan. Melindungi ujung dagu dan rahang bawah secara mutlak dari risiko kehilangan kesadaran seketika (knock-out).
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <span className="text-base shrink-0">🔄</span>
            <div>
              <strong className="text-amber-400 block font-semibold">Rotasi Pinggul & Poros Kaki:</strong>
              <p className="text-slate-300 leading-snug">
                Putar pinggul bersamaan dengan tolakan tumit kaki belakang. Tenaga benturan berasal dari pemindahan massa tubuh seluruhnya, bukan hanya ayunan lengan terisolasi.
              </p>
            </div>
          </div>
        </div>

        {/* Tombol Tautan Langsung ke YouTube */}
        <div className="pt-1">
          <a
            href={`https://www.youtube.com/watch?v=${activeTech.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-11 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs inline-flex items-center justify-center gap-2 transition active:scale-95 shadow-md shadow-red-950/40"
          >
            <span>▶</span>
            <span>Buka Video Tutorial Resmi di YouTube ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
