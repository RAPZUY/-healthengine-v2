'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MARTIAL_ARTS_DISCIPLINES } from '@/data/martialArtsData';

const SCENARIO_NARRATIVE = {
  choke_release: ['Serangan masuk: kedua tangan mengejar leher.', 'Defleksi: tangan defender membuka cengkeraman.', 'Jaga jarak: defender keluar dari garis serang.'],
  outside_defense: ['Serangan masuk: pukulan melengkung mendekat.', 'Defleksi: lengan bawah menutup jalur pukulan.', 'Jaga jarak: attacker terdorong menjauh.'],
  elbow: ['Serangan masuk: attacker merapat dengan guard tinggi.', 'Defleksi: bahu defender berputar keluar garis.', 'Jaga jarak: siku berhenti lalu defender mundur.'],
  combo_punch: ['Serangan masuk: attacker menekan jarak.', 'Defleksi: guard dibuka dengan langkah menyamping.', 'Jaga jarak: kombinasi selesai dan defender reset.'],
  teep: ['Serangan masuk: attacker melangkah agresif.', 'Defleksi: defender mengangkat lutut sebagai pagar.', 'Jaga jarak: dorongan telapak membuat ruang.'],
  low_kick: ['Serangan masuk: attacker menapak ke depan.', 'Defleksi: defender memutar poros pinggul.', 'Jaga jarak: attacker kehilangan keseimbangan.'],
  knee: ['Serangan masuk: attacker masuk ke jarak clinch.', 'Defleksi: defender mengunci kepala dan posisi.', 'Jaga jarak: lutut selesai lalu kedua pihak lepas.'],
  stop_kick: ['Serangan masuk: langkah attacker mendekat.', 'Defleksi: defender menahan laju dengan kaki depan.', 'Jaga jarak: defender kembali ke kuda-kuda.'],
  wrist_escape: ['Serangan masuk: pergelangan defender dicengkeram.', 'Defleksi: siku dekat badan menciptakan tuas.', 'Jaga jarak: tangan lepas dan ruang dibuka.'],
  snap_kick: ['Serangan masuk: attacker menunduk masuk.', 'Defleksi: defender mengangkat paha sebagai chamber.', 'Jaga jarak: kaki kembali sebelum kontak berikutnya.'],
  slip_cross: ['Serangan masuk: pukulan lurus melewati wajah.', 'Defleksi: kepala defender bergeser dari jalur.', 'Jaga jarak: defender kembali ke guard.'],
};

const DEFAULT_NARRATIVE = ['Serangan masuk: lawan menekan ruang.', 'Defleksi: defender menggeser kuda-kuda.', 'Jaga jarak: kedua aktor kembali siap.'];

const SCENARIO_FRAMES = {
  choke_release: [{ attacker: [190, 0, 1], defender: [0, 0, 0], pose: 'grab' }, { attacker: [174, 2, 1], defender: [-6, 0, -5], pose: 'break' }, { attacker: [230, 8, 1], defender: [-24, 0, -10], pose: 'space' }],
  outside_defense: [{ attacker: [184, 0, 1], defender: [0, 0, 0], pose: 'swing' }, { attacker: [176, 2, 1], defender: [-5, 0, -8], pose: 'block' }, { attacker: [236, 8, 1], defender: [-24, 0, -12], pose: 'space' }],
  elbow: [{ attacker: [184, 0, 1], defender: [0, 0, 0], pose: 'guard' }, { attacker: [172, 2, 1], defender: [-3, 0, 10], pose: 'elbow' }, { attacker: [224, 7, 1], defender: [-22, 0, 4], pose: 'space' }],
  combo_punch: [{ attacker: [184, 0, 1], defender: [0, 0, 0], pose: 'guard' }, { attacker: [170, 1, 1], defender: [-3, 0, -5], pose: 'cross' }, { attacker: [226, 7, 1], defender: [-24, 0, -8], pose: 'space' }],
  teep: [{ attacker: [184, 0, 1], defender: [0, 0, 0], pose: 'step' }, { attacker: [192, 6, 1], defender: [-5, 0, 0], pose: 'teep' }, { attacker: [246, 11, 1], defender: [-24, 0, 0], pose: 'space' }],
  low_kick: [{ attacker: [184, 0, 1], defender: [0, 0, 0], pose: 'step' }, { attacker: [178, 4, 1], defender: [-4, 0, 12], pose: 'lowkick' }, { attacker: [238, 10, 1], defender: [-24, 0, 8], pose: 'space' }],
  knee: [{ attacker: [184, 0, 1], defender: [0, 0, 0], pose: 'step' }, { attacker: [173, 4, 1], defender: [-4, 0, 0], pose: 'knee' }, { attacker: [220, 9, 1], defender: [-20, 0, 0], pose: 'space' }],
  stop_kick: [{ attacker: [184, 0, 1], defender: [0, 0, 0], pose: 'step' }, { attacker: [182, 4, 1], defender: [-5, 0, 0], pose: 'stop' }, { attacker: [236, 8, 1], defender: [-22, 0, 0], pose: 'space' }],
  wrist_escape: [{ attacker: [184, 0, 1], defender: [0, 0, 0], pose: 'grab' }, { attacker: [174, 2, 1], defender: [-7, 0, -8], pose: 'escape' }, { attacker: [228, 8, 1], defender: [-24, 0, -8], pose: 'space' }],
  snap_kick: [{ attacker: [184, 0, 1], defender: [0, 0, 0], pose: 'lean' }, { attacker: [178, 5, 1], defender: [-5, 0, 0], pose: 'snap' }, { attacker: [228, 8, 1], defender: [-24, 0, 0], pose: 'space' }],
  slip_cross: [{ attacker: [184, 0, 1], defender: [0, 0, 0], pose: 'punch' }, { attacker: [175, 2, 1], defender: [-5, 0, -10], pose: 'slip' }, { attacker: [224, 8, 1], defender: [-22, 0, -6], pose: 'space' }],
};

const ARM_PATHS = {
  grab: { attacker: 'M0 26 L-15 31 L-35 25 M0 28 L-14 40 L-34 35', defender: 'M0 25 L-10 38 L8 43 M0 28 L10 38 L23 34' },
  break: { attacker: 'M0 26 L-12 38 L-28 44 M0 28 L14 40 L28 42', defender: 'M0 25 L-18 20 L-30 8 M0 28 L15 35 L24 20' },
  swing: { attacker: 'M0 26 L-12 5 L-32 -8 M0 29 L14 38 L25 33', defender: 'M0 25 L-15 37 L-24 20 M0 28 L13 35 L25 28' },
  block: { attacker: 'M0 26 L-12 8 L-27 -2 M0 29 L14 38 L26 34', defender: 'M0 25 L-14 16 L-23 2 M0 28 L14 34 L26 27' },
  elbow: { attacker: 'M0 26 L-12 37 L-28 42 M0 29 L14 38 L28 38', defender: 'M0 25 L-13 15 L-25 13 M0 28 L14 35 L28 34' },
  cross: { attacker: 'M0 26 L-13 38 L-28 42 M0 29 L15 38 L28 36', defender: 'M0 25 L-12 36 L-30 21 M0 28 L14 35 L25 32' },
  teep: { attacker: 'M0 26 L-12 39 L-25 38 M0 29 L14 39 L27 36', defender: 'M0 25 L-14 38 L-27 33 M0 28 L12 35 L26 30' },
  lowkick: { attacker: 'M0 26 L-13 40 L-27 42 M0 29 L14 38 L28 40', defender: 'M0 25 L-14 35 L-27 26 M0 29 L14 36 L25 32' },
  knee: { attacker: 'M0 26 L-12 37 L-27 42 M0 29 L13 39 L26 40', defender: 'M0 25 L-12 14 L-20 4 M0 28 L14 34 L25 30' },
  stop: { attacker: 'M0 26 L-12 39 L-27 40 M0 29 L14 40 L28 40', defender: 'M0 25 L-14 37 L-27 35 M0 28 L12 35 L25 30' },
  escape: { attacker: 'M0 26 L-13 37 L-30 42 M0 29 L13 38 L27 40', defender: 'M0 25 L-13 37 L-31 25 M0 28 L14 34 L26 24' },
  snap: { attacker: 'M0 26 L-12 38 L-26 40 M0 29 L14 39 L27 41', defender: 'M0 25 L-14 35 L-26 28 M0 28 L12 34 L25 28' },
  punch: { attacker: 'M0 26 L-12 5 L-34 -3 M0 29 L14 38 L27 36', defender: 'M0 25 L-13 37 L-28 33 M0 28 L14 35 L27 30' },
  slip: { attacker: 'M0 26 L-12 6 L-33 -4 M0 29 L14 38 L27 36', defender: 'M0 25 L-16 37 L-28 31 M0 28 L14 35 L26 30' },
  space: { attacker: 'M0 25 L-13 37 L-28 34 M0 28 L13 38 L27 34', defender: 'M0 25 L-13 37 L-28 34 M0 28 L13 38 L27 34' },
  guard: { attacker: 'M0 25 L-13 12 L-18 2 M0 28 L13 12 L18 2', defender: 'M0 25 L-13 12 L-18 2 M0 28 L13 12 L18 2' },
  step: { attacker: 'M0 25 L-13 38 L-28 38 M0 28 L13 38 L28 38', defender: 'M0 25 L-13 38 L-28 38 M0 28 L13 38 L28 38' },
  lean: { attacker: 'M0 25 L-15 38 L-28 40 M0 28 L12 38 L25 40', defender: 'M0 25 L-14 35 L-26 28 M0 28 L12 34 L25 28' },
};

function Skeleton({ role, pose, refNode, armRef }) {
  const isDefender = role === 'defender';
  const stroke = isDefender ? '#34d399' : '#f97316';
  const dark = isDefender ? '#064e3b' : '#7c2d12';
  const initialArms = ARM_PATHS[pose]?.[isDefender ? 'defender' : 'attacker'] || ARM_PATHS.space[isDefender ? 'defender' : 'attacker'];
  return (
    <g ref={refNode}>
      <circle cy="-29" r="10" fill={dark} stroke={stroke} strokeWidth="2.5" />
      <line x1="0" y1="-19" x2="0" y2="20" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      <path d="M0 20 L-12 44 L-17 70 M0 20 L13 44 L18 70" fill="none" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" />
      <path ref={armRef} d={initialArms} fill="none" stroke={stroke} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function CombatCanvas({ animationType }) {
  const rootRef = useRef(null);
  const attackerRef = useRef(null);
  const defenderRef = useRef(null);
  const attackerArmsRef = useRef(null);
  const defenderArmsRef = useRef(null);
  const impactRef = useRef(null);
  const captionRef = useRef(null);
  const loopRef = useRef(null);
  const rafRef = useRef(null);
  const visibleRef = useRef(false);
  const playingRef = useRef(true);
  const speedRef = useRef(1);
  const progressRef = useRef(0);
  const startRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const frames = useMemo(() => SCENARIO_FRAMES[animationType] || SCENARIO_FRAMES.combo_punch, [animationType]);
  const captions = useMemo(() => SCENARIO_NARRATIVE[animationType] || DEFAULT_NARRATIVE, [animationType]);

  const applyFrame = useCallback((progress) => {
    const segment = progress * frames.length;
    const index = Math.min(frames.length - 1, Math.floor(segment));
    const next = frames[(index + 1) % frames.length];
    const amount = segment - index;
    const actor = frames[index];
    const interpolate = (values, target) => values.map((value, item) => value + (target[item] - value) * amount);
    const attacker = interpolate(actor.attacker, next.attacker);
    const defender = interpolate(actor.defender, next.defender);
    attackerRef.current?.setAttribute('transform', `translate(${attacker[0]} ${92 + attacker[1]}) rotate(${attacker[2]})`);
    defenderRef.current?.setAttribute('transform', `translate(${110 + defender[0]} ${92 + defender[1]}) rotate(${defender[2]})`);
    const pose = amount < 0.5 ? actor.pose : next.pose;
    const armPath = (role) => ARM_PATHS[pose]?.[role] || ARM_PATHS.space[role];
    attackerArmsRef.current?.setAttribute('d', armPath('attacker'));
    defenderArmsRef.current?.setAttribute('d', armPath('defender'));
    if (impactRef.current) {
      const active = index === 1 && amount > 0.45;
      impactRef.current.setAttribute('opacity', active ? `${Math.min(1, (amount - 0.45) * 4)}` : '0');
      impactRef.current.setAttribute('transform', `translate(${animationType === 'teep' || animationType === 'low_kick' ? 184 : 174} ${animationType === 'low_kick' ? 135 : 58})`);
    }
    const nextPhase = Math.min(2, Math.floor(progress * captions.length));
    if (captionRef.current && captionRef.current.textContent !== captions[nextPhase]) {
      captionRef.current.textContent = captions[nextPhase];
    }
  }, [animationType, captions, frames]);

  useEffect(() => {
    playingRef.current = isPlaying;
    if (isPlaying && visibleRef.current && !rafRef.current) {
      startRef.current = performance.now() - progressRef.current * (3600 / speedRef.current);
      rafRef.current = requestAnimationFrame((time) => loopRef.current?.(time));
    }
    return undefined;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
    startRef.current = performance.now() - progressRef.current * (3600 / speed);
  }, [speed]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const tick = (time) => {
      if (!visibleRef.current || !playingRef.current) { rafRef.current = null; return; }
      progressRef.current = ((time - startRef.current) / (3600 / speedRef.current)) % 1;
      applyFrame(progressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    loopRef.current = tick;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (visibleRef.current && playingRef.current && !rafRef.current) rafRef.current = requestAnimationFrame(tick);
      if (!visibleRef.current && rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    }, { threshold: 0.05 });
    observer.observe(node);
    return () => { observer.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; };
  }, [animationType, applyFrame, frames]);

  return (
    <div ref={rootRef} className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
      <div className="relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950">
        <svg viewBox="0 0 320 180" className="h-auto w-full select-none" role="img" aria-label="Animasi dua aktor bela diri">
          <line x1="20" y1="162" x2="300" y2="162" stroke="#334155" strokeWidth="2" />
          <line x1="160" y1="22" x2="160" y2="156" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 5" />
          <g ref={defenderRef} transform={`translate(${110 + frames[0].defender[0]} ${92 + frames[0].defender[1]}) rotate(${frames[0].defender[2]})`}><Skeleton role="defender" pose={frames[0].pose} armRef={defenderArmsRef} /></g>
          <g ref={attackerRef} transform={`translate(${frames[0].attacker[0]} ${92 + frames[0].attacker[1]}) rotate(${frames[0].attacker[2]})`}><Skeleton role="attacker" pose={frames[0].pose} armRef={attackerArmsRef} /></g>
          <g ref={impactRef} opacity="0"><circle r="13" fill="none" stroke="#fbbf24" strokeWidth="2" /><circle r="5" fill="#fbbf24" /><line x1="-20" y1="0" x2="-10" y2="0" stroke="#fbbf24" strokeWidth="2" /><line x1="10" y1="0" x2="20" y2="0" stroke="#fbbf24" strokeWidth="2" /></g>
          <text x="72" y="174" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">DEFENDER</text>
          <text x="248" y="174" fill="#f97316" fontSize="8" fontWeight="bold" textAnchor="middle">ATTACKER</text>
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {[0.5, 1].map((value) => <button key={value} type="button" onClick={() => setSpeed(value)} className={`min-h-11 rounded-xl border px-4 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${speed === value ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-100'}`}>{value}x</button>)}
        <button type="button" onClick={() => setIsPlaying((value) => !value)} className="min-h-11 rounded-xl border border-slate-800 bg-slate-900 px-4 text-xs font-bold text-slate-200 transition-colors hover:border-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400" aria-pressed={isPlaying}>{isPlaying ? 'Pause' : 'Play'}</button>
        <span className="ml-auto rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-slate-400">Auto-loop</span>
      </div>
      <p ref={captionRef} className="mt-3 text-xs leading-relaxed text-slate-300">{captions[0]}</p>
    </div>
  );
}

export default function MartialArtsSection() {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState('muay_thai');
  const [selectedTechIdx, setSelectedTechIdx] = useState(0);
  const activeDiscipline = MARTIAL_ARTS_DISCIPLINES.find((discipline) => discipline.id === selectedDisciplineId) || MARTIAL_ARTS_DISCIPLINES[0];
  const activeTech = activeDiscipline.techniques[selectedTechIdx] || activeDiscipline.techniques[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {MARTIAL_ARTS_DISCIPLINES.map((discipline) => <button key={discipline.id} type="button" onClick={() => { setSelectedDisciplineId(discipline.id); setSelectedTechIdx(0); }} className={`min-h-11 rounded-xl border px-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${discipline.id === selectedDisciplineId ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-100'}`}>{discipline.name}</button>)}
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-400">Kurikulum bela diri</p>
        <h3 className="mt-1 text-base font-bold text-slate-100">{activeDiscipline.name}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">{activeDiscipline.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {activeDiscipline.techniques.map((technique, index) => <button key={technique.id} type="button" onClick={() => setSelectedTechIdx(index)} className={`min-h-11 rounded-xl border px-3 py-2 text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${index === selectedTechIdx ? 'border-emerald-500/50 bg-emerald-600/15 text-white' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-100'}`}><span className="block truncate font-semibold">{technique.name}</span><span className="block truncate text-[11px] text-slate-500">{technique.indonesianTitle}</span></button>)}
      </div>
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3">
          <h4 className="text-sm font-bold text-slate-100">Skenario dua aktor</h4>
          <p className="mt-1 text-xs text-slate-400">Gerak tubuh menjelaskan urutan serangan, defleksi, dan pelepasan jarak.</p>
        </div>
        <CombatCanvas animationType={activeTech.animationType} />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Titik sasaran</p><p className="mt-1 text-sm font-semibold text-rose-300">{activeTech.targetPoint}</p></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Fungsi situasi</p><p className="mt-1 text-xs leading-relaxed text-slate-300">{activeTech.combatUse}</p></div>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h4 className="text-sm font-bold text-slate-100">Langkah kunci eksekusi</h4>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-slate-300">{activeTech.keySteps.map((step) => <li key={step}>{step}</li>)}</ol>
      </section>
    </div>
  );
}
