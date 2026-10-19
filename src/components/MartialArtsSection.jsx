'use client';

import React, { useState, useEffect } from 'react';
import { MARTIAL_ARTS_DISCIPLINES } from '@/data/martialArtsData';

/**
 * Narasi taktis per skenario CQC.
 * Dijaga sinkron 1:1 dengan animationType di martialArtsData.js:
 * titik kontak yang disebut di teks = titik kontak yang digambar di SVG.
 */
const SCENARIO_NARRATIVE = {
  choke: {
    threat:
      'Lawan menempelkan kedua telapak tangan ke tenggorokan (cy 62) untuk mencekik dan memotong pasokan oksigen.',
    counter:
      'Tanganmu mencungkil menyilang pergelangan lawan (pluck), bersamaan telapak tangan menghantam hidung dan lutut menyengat selangkangan.',
  },
  outside_defense: {
    threat:
      'Lawan mengayunkan pukulan hook liar melengkung menuju sisi samping kepala atau pelipis kamu (cy 46).',
    counter:
      'Lengan bawahmu mencegat ayunan lawan di udara dengan sudut 90 derajat, sambil tangan lain secara simultan menghantam ulu hati lawan.',
  },
  elbow: {
    threat: 'Lawan merangsek maju menembus jarak guard dengan agresif untuk menekan tubuh kamu.',
    counter:
      'Tepis tangan depan lawan ke bawah, putar panggul penuh, dan hujamkan sikutan mendatar tajam ke pelipis lawan (cy 48).',
  },
  combo_punch: {
    threat: 'Lawan menutup jarak dengan guard tinggi, mencoba membalas lebih dulu dari jarak rapat.',
    counter:
      'Jab depan memecah guard, lalu cross bertenaga panggul menghantam rahang samping lawan tepat di pelipisnya.',
  },
  teep: {
    threat:
      'Lawan melangkah maju dengan bobot badan penuh untuk melancarkan serangan kombinasi.',
    counter:
      'Telapak kakimu menancap kuat ke ulu hati lawan (cy 85), menyalurkan daya dorong panggul hingga torso lawan condong terjungkal ke belakang.',
  },
  low_kick: {
    threat: 'Lawan menapakkan kaki tumpuan depan terbuka dengan bobot badan masih tinggi.',
    counter:
      'Putar poros kaki dan panggul, lalu hantamkan tulang kering diagonal ke otot paha luar lawan (cy 135) sampai kakinya terpantul mundur.',
  },
  knee: {
    threat: 'Lawan menyerbu masuk jarak rapat dengan kepala masih tegak di depan dada kamu.',
    counter:
      'Kaitkan kedua tangan di belakang tengkuk lawan (plum), tarik kepalanya turun, dan tancapkan lutut lurus ke ulu hati lawan.',
  },
  stop_kick: {
    threat: 'Lawan melangkahkan kaki depan maju agresif sebelum masuk jarak jangkauan senjata.',
    counter:
      'Kunci lutut lurus dan jejakkan tumit keras tepat ke tempurung lutut lawan, menghentikan laju tubuhnya di tempat.',
  },
  wrist_escape: {
    threat:
      'Lawan mencekam pergelangan tangan kamu dari depan dengan cengkeraman penuh seluruh jari.',
    counter:
      'Kencangkan tendon, dekatkan siku ke tubuh untuk membentuk tuas, lalu sentakkan pergelangan keluar melewati celah ibu jari lawan.',
  },
  snap_kick: {
    threat: 'Lawan menunduk dan mencondongkan badan ke depan, membuka saluran serangan ke dagu bawah.',
    counter:
      'Angkat paha lurus tanpa memutar panggul, lalu pecutkan betis seperti cambuk hingga telapak kaki menghantam dagu lawan.',
  },
  slip_cross: {
    threat: 'Lawan melepaskan pukulan lurus ke arah tengah wajah kamu dari jarak dekat.',
    counter:
      'Miringkan kepala melewati jalur pukulan (slip), lalu balas seketika dengan cross lurus bertenaga panggul ke dagu lawan yang terbuka.',
  },
};

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

  // Identifikasi skenario CQC khusus (satu bendera = satu judul teknik, tidak ada pemetaan ganda)
  const isChoke = activeTech.id === 'km-choke' || activeTech.animationType === 'choke_release';
  const is360 = activeTech.id === 'km-360def' || activeTech.animationType === 'outside_defense';
  const isElbow = activeTech.id === 'mt-elbow' || activeTech.animationType === 'elbow';
  const isPunch = activeTech.id === 'kb-combo' || activeTech.animationType === 'combo_punch';
  const isTeep = activeTech.id === 'mt-teep' || activeTech.animationType === 'teep';
  const isLowKick = activeTech.id === 'mt-lowkick' || activeTech.animationType === 'low_kick';
  const isKnee = activeTech.id === 'mt-knee' || activeTech.animationType === 'knee';
  const isStopKick = activeTech.id === 'km-stopkick' || activeTech.animationType === 'stop_kick';
  const isWrist = activeTech.id === 'km-wrist' || activeTech.animationType === 'wrist_escape';
  const isSnapKick = activeTech.id === 'kb-snapkick' || activeTech.animationType === 'snap_kick';
  const isSlipCross = activeTech.id === 'kb-slipcounter' || activeTech.animationType === 'slip_cross';

  // Kunci skenario aktif untuk mengambil narasi taktis di SCENARIO_NARRATIVE
  const scenario = isChoke
    ? 'choke'
    : is360
    ? 'outside_defense'
    : isElbow
    ? 'elbow'
    : isPunch
    ? 'combo_punch'
    : isTeep
    ? 'teep'
    : isLowKick
    ? 'low_kick'
    : isKnee
    ? 'knee'
    : isStopKick
    ? 'stop_kick'
    : isWrist
    ? 'wrist_escape'
    : isSnapKick
    ? 'snap_kick'
    : isSlipCross
    ? 'slip_cross'
    : 'generic';

  const narrative = SCENARIO_NARRATIVE[scenario];

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
                    <circle cx="140" cy="62" r="7" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
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
                    <circle cx="174" cy="46" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
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

                    <circle cx="142" cy="46" r="6" fill="#f43f5e" opacity="0.3" className="animate-ping motion-reduce:animate-none" />
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
                    <circle cx="174" cy="80" r="7" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
                    <circle cx="174" cy="80" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="180" y="96" fill="#34d399" fontSize="8" fontWeight="bold">Ulu Hati!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 3. SKENARIO: SIKUTAN MENDATAR & KOMBINASI TINJU JARAK RAPAT ==================== */}
            {(isElbow || isPunch) && (
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
                    <text x="175" y="32" fill="#fca5a5" fontSize="7.5" fontWeight="bold">
                      {isElbow ? 'Maju Mencegat' : 'Guard Terbuka'}
                    </text>
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
                    {/* Siku horizontal (atau cross rahang) menusuk pelipis lawan di (168, 48) */}
                    {isElbow ? (
                      <polyline points="138,66 156,54 168,48" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    ) : (
                      <g>
                        {/* Jab tangan depan memecah guard lawan */}
                        <line x1="138" y1="66" x2="158" y2="54" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                        {/* Cross tangan belakang menghantam rahang samping */}
                        <line x1="138" y1="74" x2="168" y2="52" stroke="#34d399" strokeWidth="4" strokeLinecap="round" markerEnd="url(#strikeCqcArrow)" />
                        <circle cx="158" cy="54" r="2.5" fill="#38bdf8" />
                      </g>
                    )}

                    {/* Lawan terkena hantaman telak di pelipis */}
                    <circle cx="174" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="174" y1="61" x2="178" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="178,108 174,136 172,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <polyline points="178,108 190,136 194,162" fill="none" stroke="#f43f5e" strokeWidth="3" />

                    <circle cx="168" cy="48" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
                    <circle cx="168" cy="48" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="176" y="36" fill="#34d399" fontSize="8" fontWeight="bold">
                      {isElbow ? 'Siku Robek!' : 'Rahang Hancur!'}
                    </text>
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
                    {/* Kaki Kamu menendang lurus, telapak kaki menancap di ulu hati lawan (181, 85) */}
                    <polyline points="128,108 154,96 181,85" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" markerEnd="url(#strikeCqcArrow)" />

                    {/* Tubuh lawan terdorong condong tajam ke belakang */}
                    <circle cx="188" cy="44" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="188" y1="57" x2="178" y2="108" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="178,108 174,136 170,162" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    <polyline points="178,108 196,136 204,162" fill="none" stroke="#f43f5e" strokeWidth="3" />

                    <circle cx="181" cy="85" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
                    <circle cx="181" cy="85" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="190" y="102" fill="#34d399" fontSize="8" fontWeight="bold">Teep Telak!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 5. SKENARIO: MUAY THAI LOW KICK (PAHA LUAR LAWAN) ==================== */}
            {isLowKick && (
              <g>
                {currentStep === 1 ? (
                  // Langkah 1: Lawan menapak maju dengan kaki depan terbuka dan bobot badan masih tinggi
                  <g>
                    {/* Kamu: kuda-kuda seimbang, poros kaki siap memutar */}
                    <circle cx="136" cy="48" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="136" y1="61" x2="136" y2="108" stroke="#38bdf8" strokeWidth="4" />
                    <polyline points="136,108 126,136 122,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="136,108 146,136 150,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="136,70 130,84 140,90" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Lawan: kaki tumpuan depan terulur ke depan, paha luarnya terbuka */}
                    <circle cx="170" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="170" y1="61" x2="170" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="170,108 156,132 148,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="170,108 184,136 190,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <line x1="170" y1="70" x2="146" y2="66" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 2" markerEnd="url(#threatCqcArrow)" />
                    <text x="162" y="34" fill="#fca5a5" fontSize="7.5" fontWeight="bold">Langkah Masuk</text>
                  </g>
                ) : (
                  // Langkah 2: Poros kaki memutar, tulang kering mengayun diagonal ke paha luar lawan (cy 135)
                  <g>
                    {/* Kamu: kaki poros berputar penuh, panggul meledak */}
                    <circle cx="136" cy="50" r="13" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="136" y1="63" x2="136" y2="108" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="136,108 124,136 116,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    <line x1="136" y1="72" x2="122" y2="88" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Tungkai mengayun diagonal: sepertiga bawah tulang kering menancap di paha luar lawan */}
                    <polyline points="136,108 152,119 178,144" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="152" cy="119" r="3.5" fill="#34d399" />

                    {/* Lawan: kaki depan terpantul mundur menjauh dari benturan */}
                    <circle cx="170" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="170" y1="61" x2="170" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <line x1="170" y1="108" x2="178" y2="130" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="178" y1="130" x2="190" y2="156" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <line x1="170" y1="108" x2="188" y2="136" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <line x1="188" y1="136" x2="196" y2="162" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    {/* Jejak posisi kaki sesaat sebelum terhantam */}
                    <line x1="170" y1="108" x2="156" y2="132" stroke="#9f1239" strokeWidth="2" strokeDasharray="4 3" />
                    <line x1="156" y1="132" x2="148" y2="162" stroke="#9f1239" strokeWidth="2" strokeDasharray="4 3" />
                    {/* Panah pantulan kaki lawan */}
                    <path d="M 174 148 Q 192 146 202 132" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#threatCqcArrow)" />

                    {/* Titik benturan di otot paha luar lawan (168, 135) */}
                    <circle cx="168" cy="135" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
                    <circle cx="168" cy="135" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="190" y="110" fill="#34d399" fontSize="8" fontWeight="bold">Paha Luar Robek!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 6. SKENARIO: CLINCH KNEE STRIKE (ULU HATI) ==================== */}
            {isKnee && (
              <g>
                {currentStep === 1 ? (
                  // Langkah 1: Lawan menyerbu masuk jarak rapat dengan kepala masih tegak
                  <g>
                    <circle cx="134" cy="48" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="134" y1="61" x2="134" y2="108" stroke="#38bdf8" strokeWidth="4" />
                    <polyline points="134,108 124,136 120,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="134,108 144,136 148,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="134,72 128,84 138,90" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

                    <circle cx="168" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="168" y1="61" x2="168" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="168,108 162,136 158,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="168,108 178,136 184,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <line x1="168" y1="70" x2="146" y2="64" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 2" markerEnd="url(#threatCqcArrow)" />
                    <text x="160" y="34" fill="#fca5a5" fontSize="7.5" fontWeight="bold">Serbuan Maju</text>
                  </g>
                ) : (
                  // Langkah 2: Tengkuk lawan dikunci, lutut menusuk lurus ke ulu hati
                  <g>
                    {/* Kamu: kaki tumpuan mengunci, lutut melesat naik */}
                    <circle cx="136" cy="50" r="13" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="136" y1="63" x2="136" y2="108" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="136,108 126,136 122,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="136,108 170,100 156,126" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    {/* Kedua tangan mencengkeram tengkuk lawan (Plum) */}
                    <line x1="136" y1="66" x2="164" y2="74" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="136" y1="70" x2="162" y2="80" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Lawan: tubuh membungkuk tertarik ke bawah */}
                    <circle cx="168" cy="62" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="168" y1="75" x2="178" y2="118" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="178,118 172,140 168,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="178,118 192,140 198,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />

                    <circle cx="170" cy="100" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
                    <circle cx="170" cy="100" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="188" y="96" fill="#34d399" fontSize="8" fontWeight="bold">Lutut Menusuk!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 7. SKENARIO: KRAV MAGA DEFENSIVE STOP KICK (LUTUT LAWAN) ==================== */}
            {isStopKick && (
              <g>
                {currentStep === 1 ? (
                  // Langkah 1: Lawan melangkahkan kaki depan maju agresif
                  <g>
                    <circle cx="134" cy="48" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="134" y1="61" x2="134" y2="108" stroke="#38bdf8" strokeWidth="4" />
                    <polyline points="134,108 124,136 120,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="134,108 144,136 148,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="134,72 128,84 138,90" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

                    <circle cx="170" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="170" y1="61" x2="170" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="170,108 158,134 150,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="170,108 182,136 188,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <line x1="170" y1="70" x2="148" y2="64" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 2" markerEnd="url(#threatCqcArrow)" />
                    <text x="160" y="34" fill="#fca5a5" fontSize="7.5" fontWeight="bold">Melangkah Masuk</text>
                  </g>
                ) : (
                  // Langkah 2: Tumit menjejak lurus ke tempurung lutut lawan, lajunya berhenti di tempat
                  <g>
                    <circle cx="128" cy="50" r="13" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="128" y1="63" x2="128" y2="106" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="128,106 114,138 108,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    {/* Kaki lurus: tumit menancap di tempurung lutut lawan */}
                    <polyline points="128,106 150,112 165,136" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" markerEnd="url(#strikeCqcArrow)" />

                    {/* Lawan: paha depan maju, lututnya pasrah dihantam */}
                    <circle cx="176" cy="46" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="176" y1="59" x2="176" y2="106" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="176,106 166,134 160,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="176,106 188,136 194,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <line x1="174" y1="68" x2="158" y2="76" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />

                    <circle cx="165" cy="136" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
                    <circle cx="165" cy="136" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="182" y="124" fill="#34d399" fontSize="8" fontWeight="bold">Henti di Lutut!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 8. SKENARIO: KRAV MAGA WRIST GRAB ESCAPE ==================== */}
            {isWrist && (
              <g>
                {currentStep === 1 ? (
                  // Langkah 1: Lawan mencekam pergelangan tangan dengan seluruh jari
                  <g>
                    <circle cx="132" cy="48" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="132" y1="61" x2="132" y2="108" stroke="#38bdf8" strokeWidth="4" />
                    <polyline points="132,108 122,136 118,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="132,108 142,136 146,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <line x1="132" y1="70" x2="150" y2="84" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

                    <circle cx="170" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="170" y1="61" x2="170" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="170,108 164,136 160,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="170,108 180,136 186,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <line x1="170" y1="68" x2="154" y2="82" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />

                    {/* Cengkeraman penuh di pergelangan kamu (152, 84) */}
                    <circle cx="152" cy="84" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
                    <circle cx="152" cy="84" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="150" y="74" fill="#fca5a5" fontSize="7.5" fontWeight="bold">Cekaman Penuh!</text>
                  </g>
                ) : (
                  // Langkah 2: Siku ditarik rapat, pergelangan menyentak keluar lewat celah ibu jari
                  <g>
                    <circle cx="134" cy="48" r="13" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="134" y1="61" x2="134" y2="108" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="134,108 124,136 120,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="134,108 144,136 148,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    {/* Tuas: siku mendekat ke tubuh, tangan tersentak ke dalam */}
                    <polyline points="134,70 148,80 138,92" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 154 88 Q 148 98 138 96" fill="none" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#strikeCqcArrow)" />

                    {/* Lawan: cengkeraman lepas, tangannya terlempar ke luar */}
                    <circle cx="172" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="172" y1="61" x2="172" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="172,108 166,136 162,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="172,108 182,136 188,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <line x1="172" y1="68" x2="160" y2="82" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    {/* Balasan telapak tangan ke hidung lawan */}
                    <line x1="134" y1="76" x2="168" y2="50" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" markerEnd="url(#strikeCqcArrow)" />
                    <circle cx="168" cy="50" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
                    <circle cx="168" cy="50" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="182" y="40" fill="#34d399" fontSize="8" fontWeight="bold">Lepas &amp; Balas!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 9. SKENARIO: KICKBOXING FRONT SNAP KICK (DAGU) ==================== */}
            {isSnapKick && (
              <g>
                {currentStep === 1 ? (
                  // Langkah 1: Lawan menunduk condong ke depan, membuka saluran ke dagu bawah
                  <g>
                    <circle cx="130" cy="50" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="130" y1="63" x2="130" y2="108" stroke="#38bdf8" strokeWidth="4" />
                    <polyline points="130,108 120,136 116,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    {/* Lutut terangkat lurus tanpa memutar panggul (chambering) */}
                    <polyline points="130,108 138,88 132,114" fill="none" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />

                    <circle cx="166" cy="56" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="166" y1="69" x2="160" y2="108" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="160,108 154,136 150,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="160,108 170,136 176,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <text x="154" y="40" fill="#fca5a5" fontSize="7.5" fontWeight="bold">Menunduk Maju</text>
                  </g>
                ) : (
                  // Langkah 2: Betis memecut seperti cambuk, telapak kaki menghantam dagu bawah
                  <g>
                    <circle cx="128" cy="54" r="13" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="128" y1="67" x2="128" y2="110" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="128,110 114,138 108,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="128,108 152,88 170,58" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" markerEnd="url(#strikeCqcArrow)" />
                    <circle cx="152" cy="88" r="3.5" fill="#34d399" />

                    {/* Lawan: dagu tersentak, kepala terlempar ke belakang */}
                    <circle cx="178" cy="46" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="178" y1="59" x2="176" y2="108" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="176,108 170,136 166,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="176,108 188,136 194,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />

                    <circle cx="172" cy="58" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
                    <circle cx="172" cy="58" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="188" y="52" fill="#34d399" fontSize="8" fontWeight="bold">Dagu Tersentak!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 10. SKENARIO: KICKBOXING SLIP & COUNTER CROSS ==================== */}
            {isSlipCross && (
              <g>
                {currentStep === 1 ? (
                  // Langkah 1: Pukulan lurus lawan lewat tipis di samping daun telinga
                  <g>
                    {/* Kepala Kamu menggeser keluar jalur pukulan (slip) */}
                    <circle cx="140" cy="52" r="13" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="140" y1="65" x2="136" y2="108" stroke="#38bdf8" strokeWidth="4" />
                    <polyline points="136,108 126,136 122,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <polyline points="136,108 146,136 150,162" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    <line x1="138" y1="76" x2="128" y2="66" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

                    <circle cx="174" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="174" y1="61" x2="174" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="174,108 168,136 164,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="174,108 184,136 190,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <line x1="174" y1="70" x2="152" y2="46" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" markerEnd="url(#threatCqcArrow)" />
                    <text x="146" y="34" fill="#fca5a5" fontSize="7.5" fontWeight="bold">Lewat Tipis!</text>
                  </g>
                ) : (
                  // Langkah 2: Dagu lawan terbuka, cross balasan bertenaga panggul menghantamnya
                  <g>
                    <circle cx="140" cy="52" r="13" fill="#0f172a" stroke="#34d399" strokeWidth="2.5" />
                    <line x1="140" y1="65" x2="136" y2="108" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                    <polyline points="136,108 126,136 122,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="136,108 146,136 150,162" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                    <line x1="140" y1="72" x2="172" y2="56" stroke="#34d399" strokeWidth="4" strokeLinecap="round" markerEnd="url(#strikeCqcArrow)" />

                    <circle cx="174" cy="48" r="13" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.5" />
                    <line x1="174" y1="61" x2="174" y2="108" stroke="#f43f5e" strokeWidth="4" />
                    <polyline points="174,108 168,136 164,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                    <polyline points="174,108 184,136 190,162" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />

                    <circle cx="172" cy="56" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
                    <circle cx="172" cy="56" r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                    <text x="184" y="44" fill="#34d399" fontSize="8" fontWeight="bold">Cross Balasan!</text>
                  </g>
                )}
              </g>
            )}

            {/* ==================== 11. SKENARIO DEFAULT TEKNIK LAINNYA ==================== */}
            {!isChoke &&
              !is360 &&
              !isElbow &&
              !isPunch &&
              !isTeep &&
              !isLowKick &&
              !isKnee &&
              !isStopKick &&
              !isWrist &&
              !isSnapKick &&
              !isSlipCross && (
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

                    <circle cx="172" cy="52" r="8" fill="#f43f5e" opacity="0.4" className="animate-ping motion-reduce:animate-none" />
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
            {currentStep === 1
              ? narrative?.threat ||
                `Lawan memulai serangan agresif mengincar ${activeTech.targetPoint}.`
              : narrative?.counter ||
                `Eksekusi tangkisan terarah dan lepaskan serangan balik eksplosif menghantam ${activeTech.targetPoint}.`}
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
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
              activeTech.name + ' tutorial FightTips Krav Maga Muay Thai'
            )}`}
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
