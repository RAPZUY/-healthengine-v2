'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

const COLORS = {
  bone: '#e2e8f0',
  joint: '#94a3b8',
  active: '#34d399',
  eccentric: '#38bdf8',
  floor: '#334155',
};

const POSE_META = {
  squat: {
    label: 'Squat',
    frames: [
      [80, 22, 80, 48, 80, 68, 64, 82, 94, 82, 80, 48, 62, 61, 54, 82, 98, 61, 106, 82, 72, 32, 88, 32],
      [80, 30, 80, 54, 80, 70, 60, 82, 100, 82, 80, 54, 54, 65, 50, 82, 106, 65, 112, 82, 65, 40, 95, 40],
      [80, 20, 80, 46, 80, 66, 64, 82, 94, 82, 80, 46, 61, 58, 54, 82, 98, 58, 106, 82, 72, 28, 88, 28],
    ],
    caption: ['Eksentrik · pinggul turun', 'Transisi · paha sejajar lantai', 'Konsentrik · dorong tumit'],
  },
  pause_squat: {
    label: 'Pause Squat',
    frames: [
      [80, 22, 80, 48, 80, 68, 64, 82, 94, 82, 80, 48, 62, 61, 54, 82, 98, 61, 106, 82, 72, 32, 88, 32],
      [80, 31, 80, 55, 80, 71, 60, 82, 100, 82, 80, 55, 54, 66, 50, 82, 106, 66, 112, 82, 65, 40, 95, 40],
      [80, 31, 80, 55, 80, 71, 60, 82, 100, 82, 80, 55, 54, 66, 50, 82, 106, 66, 112, 82, 65, 40, 95, 40],
      [80, 20, 80, 46, 80, 66, 64, 82, 94, 82, 80, 46, 61, 58, 54, 82, 98, 58, 106, 82, 72, 28, 88, 28],
    ],
    caption: ['Eksentrik · turun terkontrol', 'Tahan · posisi bawah', 'Tahan · napas tetap stabil', 'Konsentrik · berdiri'],
  },
  jump_squat: {
    label: 'Jump Squat',
    frames: [
      [80, 28, 80, 54, 80, 70, 60, 82, 100, 82, 80, 54, 54, 65, 50, 82, 106, 65, 112, 82, 65, 40, 95, 40],
      [80, 18, 80, 42, 80, 58, 62, 76, 98, 76, 80, 42, 59, 49, 52, 76, 101, 49, 108, 76, 68, 26, 92, 26],
      [80, 12, 80, 38, 80, 52, 58, 68, 102, 68, 80, 38, 54, 28, 42, 12, 106, 28, 118, 12, 66, 24, 94, 24],
      [80, 28, 80, 54, 80, 70, 60, 82, 100, 82, 80, 54, 54, 65, 50, 82, 106, 65, 112, 82, 65, 40, 95, 40],
    ],
    caption: ['Eksentrik · muat tenaga', 'Konsentrik · lepas lantai', 'Konsentrik · tubuh melayang', 'Transisi · serap pendaratan'],
  },
  lunge: {
    label: 'Lunge',
    frames: [
      [78, 22, 78, 48, 78, 66, 62, 82, 94, 82, 78, 48, 54, 62, 42, 82, 104, 62, 114, 82, 70, 31, 86, 31],
      [78, 27, 78, 52, 78, 70, 58, 82, 98, 82, 78, 52, 48, 65, 36, 82, 108, 65, 120, 82, 68, 36, 88, 36],
      [78, 20, 78, 45, 78, 64, 62, 82, 94, 82, 78, 45, 54, 59, 42, 82, 104, 59, 114, 82, 70, 28, 86, 28],
    ],
    caption: ['Eksentrik · lutut belakang turun', 'Transisi · stabil di bawah', 'Konsentrik · dorong kaki depan'],
  },
  glute_bridge: {
    label: 'Glute Bridge',
    frames: [
      [30, 73, 44, 76, 76, 76, 94, 52, 106, 80, 76, 76, 88, 58, 98, 80, 72, 76, 88, 76, 38, 70, 52, 70],
      [30, 73, 44, 70, 76, 58, 94, 50, 106, 80, 76, 58, 88, 42, 98, 80, 38, 66, 52, 66, 38, 64, 52, 64],
      [30, 73, 44, 76, 76, 76, 94, 52, 106, 80, 76, 76, 88, 58, 98, 80, 38, 70, 52, 70, 38, 70, 52, 70],
    ],
    caption: ['Eksentrik · pinggul menyentuh lantai', 'Konsentrik · angkat pinggul', 'Transisi · kunci rusuk'],
  },
  calf_raise: {
    label: 'Calf Raise',
    frames: [
      [80, 20, 80, 47, 80, 66, 72, 82, 88, 82, 80, 47, 72, 64, 72, 82, 88, 64, 88, 82, 70, 30, 90, 30],
      [80, 18, 80, 45, 80, 63, 73, 76, 87, 76, 80, 45, 73, 60, 73, 78, 87, 60, 87, 78, 70, 27, 90, 27],
      [80, 20, 80, 47, 80, 66, 72, 82, 88, 82, 80, 47, 72, 64, 72, 82, 88, 64, 88, 82, 70, 30, 90, 30],
    ],
    caption: ['Eksentrik · tumit turun', 'Konsentrik · jinjit', 'Transisi · stabil di puncak'],
  },
  pushup: {
    label: 'Push-up',
    frames: [
      [124, 54, 112, 62, 72, 70, 40, 80, 25, 82, 112, 62, 100, 70, 102, 82, 84, 70, 72, 82, 106, 50, 120, 50],
      [124, 62, 112, 70, 72, 76, 40, 82, 25, 82, 112, 70, 96, 78, 102, 82, 84, 76, 72, 82, 106, 58, 120, 58],
      [124, 54, 112, 62, 72, 70, 40, 80, 25, 82, 112, 62, 100, 70, 102, 82, 84, 70, 72, 82, 106, 50, 120, 50],
    ],
    caption: ['Eksentrik · dada turun', 'Transisi · siku 45°', 'Konsentrik · dorong lantai'],
  },
  pike: {
    label: 'Pike Push-up',
    frames: [
      [118, 61, 108, 52, 76, 34, 44, 80, 28, 82, 108, 52, 102, 64, 104, 82, 84, 34, 72, 82, 112, 54, 124, 54],
      [118, 70, 108, 58, 76, 38, 44, 80, 28, 82, 108, 58, 94, 70, 104, 82, 84, 38, 72, 82, 112, 63, 124, 63],
      [118, 61, 108, 52, 76, 34, 44, 80, 28, 82, 108, 52, 102, 64, 104, 82, 84, 34, 72, 82, 112, 54, 124, 54],
    ],
    caption: ['Eksentrik · kepala mendekati lantai', 'Transisi · siku menekuk', 'Konsentrik · dorong V'],
  },
  pullup: {
    label: 'Pull-up / Row',
    frames: [
      [80, 29, 80, 42, 80, 66, 72, 82, 88, 82, 80, 42, 72, 28, 70, 14, 88, 28, 90, 14, 70, 25, 90, 25],
      [80, 17, 80, 34, 80, 58, 74, 74, 86, 74, 80, 34, 68, 27, 76, 14, 92, 27, 96, 14, 70, 20, 90, 20],
      [80, 29, 80, 42, 80, 66, 72, 82, 88, 82, 80, 42, 72, 28, 70, 14, 88, 28, 90, 14, 70, 25, 90, 25],
    ],
    caption: ['Eksentrik · lengan menggantung', 'Konsentrik · dada ke palang', 'Transisi · turunkan terkendali'],
  },
  plank: {
    label: 'Plank',
    frames: [
      [122, 56, 110, 64, 70, 70, 34, 78, 24, 82, 110, 64, 104, 76, 114, 82, 84, 70, 72, 82, 106, 52, 124, 52],
      [122, 56, 110, 64, 70, 70, 34, 78, 24, 82, 110, 64, 104, 76, 114, 82, 84, 70, 72, 82, 106, 52, 124, 52],
      [122, 56, 110, 64, 70, 70, 34, 78, 24, 82, 110, 64, 104, 76, 114, 82, 84, 70, 72, 82, 106, 52, 124, 52],
    ],
    caption: ['Tahan · siku di bawah bahu', 'Tahan · core terkunci', 'Tahan · napas teratur'],
  },
  situp: {
    label: 'Sit-up',
    frames: [
      [32, 70, 46, 74, 76, 74, 94, 54, 106, 80, 76, 74, 86, 60, 96, 80, 62, 64, 74, 58, 40, 66, 54, 66],
      [54, 46, 66, 58, 76, 72, 94, 54, 106, 80, 76, 72, 82, 60, 96, 80, 68, 48, 80, 52, 60, 52, 76, 50],
      [32, 70, 46, 74, 76, 74, 94, 54, 106, 80, 76, 74, 86, 60, 96, 80, 62, 64, 74, 58, 40, 66, 54, 66],
    ],
    caption: ['Eksentrik · rebahkan torso', 'Konsentrik · angkat torso', 'Transisi · rusuk mendekat'],
  },
  mountain_climber: {
    label: 'Mountain Climber',
    frames: [
      [122, 56, 110, 64, 70, 70, 34, 78, 24, 82, 110, 64, 104, 76, 114, 82, 84, 70, 72, 82, 106, 52, 124, 52],
      [122, 56, 110, 64, 70, 70, 34, 78, 24, 82, 110, 64, 104, 76, 114, 82, 84, 70, 92, 74, 106, 52, 124, 52],
      [122, 56, 110, 64, 70, 70, 34, 78, 24, 82, 110, 64, 104, 76, 114, 82, 84, 70, 72, 82, 106, 52, 124, 52],
    ],
    caption: ['Transisi · plank stabil', 'Konsentrik · lutut kanan ke dada', 'Transisi · ganti sisi'],
  },
  burpee: {
    label: 'Burpee',
    frames: [
      [80, 28, 80, 54, 80, 70, 60, 82, 100, 82, 80, 54, 54, 65, 50, 82, 106, 65, 112, 82, 65, 40, 95, 40],
      [118, 56, 108, 64, 70, 70, 34, 78, 24, 82, 108, 64, 104, 76, 114, 82, 84, 70, 72, 82, 106, 52, 124, 52],
      [80, 14, 80, 40, 80, 54, 60, 68, 100, 68, 80, 40, 54, 26, 42, 12, 106, 26, 118, 12, 66, 22, 94, 22],
      [80, 28, 80, 54, 80, 70, 60, 82, 100, 82, 80, 54, 54, 65, 50, 82, 106, 65, 112, 82, 65, 40, 95, 40],
    ],
    caption: ['Eksentrik · jongkok', 'Transisi · kaki ke belakang', 'Konsentrik · lompat', 'Transisi · mendarat lembut'],
  },
  skipping: {
    label: 'Skipping',
    frames: [
      [80, 20, 80, 46, 80, 66, 72, 82, 88, 82, 80, 46, 68, 62, 62, 82, 92, 62, 98, 82, 62, 30, 98, 30],
      [80, 16, 80, 42, 80, 60, 72, 76, 88, 76, 80, 42, 70, 54, 70, 70, 90, 54, 90, 70, 62, 26, 98, 26],
      [80, 20, 80, 46, 80, 66, 72, 82, 88, 82, 80, 46, 92, 62, 98, 82, 68, 62, 62, 82, 62, 30, 98, 30],
    ],
    caption: ['Transisi · tali melewati kaki', 'Konsentrik · lutut kiri naik', 'Transisi · ganti kaki'],
  },
  row: {
    label: 'Row',
    frames: [
      [112, 36, 92, 48, 64, 62, 42, 80, 26, 82, 92, 48, 78, 54, 66, 44, 96, 54, 104, 44, 104, 34, 120, 34],
      [112, 31, 92, 43, 64, 56, 42, 78, 26, 82, 92, 43, 80, 48, 70, 38, 88, 48, 96, 38, 104, 29, 120, 29],
      [112, 36, 92, 48, 64, 62, 42, 80, 26, 82, 92, 48, 78, 54, 66, 44, 96, 54, 104, 44, 104, 34, 120, 34],
    ],
    caption: ['Eksentrik · lengan memanjang', 'Konsentrik · siku ke belakang', 'Transisi · belikat terkunci'],
  },
  hinge: {
    label: 'Hinge',
    frames: [
      [88, 30, 76, 48, 60, 62, 50, 80, 42, 82, 60, 62, 82, 78, 94, 82, 70, 48, 60, 62, 98, 48, 112, 50],
      [98, 38, 78, 56, 62, 64, 52, 80, 42, 82, 62, 64, 84, 78, 98, 82, 70, 56, 54, 68, 102, 56, 116, 58],
      [88, 30, 76, 48, 60, 62, 50, 80, 42, 82, 60, 62, 82, 78, 94, 82, 70, 48, 60, 62, 98, 48, 112, 50],
    ],
    caption: ['Eksentrik · pinggul mundur', 'Transisi · beban dekat kaki', 'Konsentrik · dorong pinggul'],
  },
  shoulder_press: {
    label: 'Shoulder Press',
    frames: [
      [80, 20, 80, 46, 80, 66, 68, 82, 62, 82, 92, 66, 104, 82, 92, 46, 108, 38, 68, 46, 52, 38, 72, 46],
      [80, 18, 80, 44, 80, 66, 68, 82, 62, 82, 92, 66, 104, 82, 90, 38, 102, 20, 70, 38, 58, 20, 70, 38],
      [80, 20, 80, 46, 80, 66, 68, 82, 62, 82, 92, 66, 104, 82, 92, 46, 108, 38, 68, 46, 52, 38, 72, 46],
    ],
    caption: ['Eksentrik · beban turun', 'Konsentrik · dorong ke atas', 'Transisi · rusuk stabil'],
  },
  leg_raise: {
    label: 'Leg Raise',
    frames: [
      [32, 70, 44, 74, 76, 74, 94, 54, 106, 80, 76, 74, 88, 58, 98, 80, 44, 74, 34, 80, 82, 74, 112, 70],
      [32, 70, 44, 74, 76, 74, 94, 54, 106, 80, 76, 74, 88, 58, 98, 80, 44, 74, 42, 52, 78, 74, 82, 30],
      [32, 70, 44, 74, 76, 74, 94, 54, 106, 80, 76, 74, 88, 58, 98, 80, 44, 74, 34, 80, 82, 74, 112, 70],
    ],
    caption: ['Eksentrik · kaki turun terkontrol', 'Konsentrik · kaki menuju 90°', 'Transisi · panggul tetap netral'],
  },
  side_plank: {
    label: 'Side Plank',
    frames: [
      [116, 50, 104, 60, 70, 72, 38, 80, 24, 82, 104, 60, 96, 74, 108, 82, 80, 66, 70, 82, 96, 42, 112, 28],
      [116, 50, 104, 60, 70, 70, 38, 80, 24, 82, 104, 60, 98, 72, 110, 82, 80, 64, 70, 82, 96, 40, 112, 24],
      [116, 50, 104, 60, 70, 72, 38, 80, 24, 82, 104, 60, 96, 74, 108, 82, 80, 66, 70, 82, 96, 42, 112, 28],
    ],
    caption: ['Tahan · garis samping lurus', 'Tahan · pinggul terangkat', 'Transisi · bahu menjauh dari telinga'],
  },
  carry: {
    label: 'Loaded Carry',
    frames: [
      [80, 20, 80, 46, 80, 66, 70, 82, 62, 82, 90, 66, 98, 82, 66, 54, 54, 78, 94, 54, 106, 78, 110, 54],
      [82, 20, 82, 46, 82, 66, 72, 82, 64, 82, 92, 66, 100, 82, 68, 54, 56, 78, 96, 54, 108, 78, 112, 54],
      [80, 20, 80, 46, 80, 66, 70, 82, 62, 82, 90, 66, 98, 82, 66, 54, 54, 78, 94, 54, 106, 78, 110, 54],
    ],
    caption: ['Transisi · langkah stabil', 'Tahan · bahu tetap turun', 'Transisi · beban dekat tubuh'],
  },
};

const POSE_RULES = [
  [/pause squat|paused squat/, 'pause_squat'],
  [/jump squat/, 'jump_squat'],
  [/glute bridge|hip thrust/, 'glute_bridge'],
  [/calf raise/, 'calf_raise'],
  [/shoulder press|overhead press/, 'shoulder_press'],
  [/bent[- ]over row/, 'row'],
  [/seated row|inverted row|doorframe row/, 'row'],
  [/romanian deadlift|deadlift|good morning/, 'hinge'],
  [/side plank/, 'side_plank'],
  [/leg raise|hanging knee raise/, 'leg_raise'],
  [/farmer|loaded carry|carry/, 'carry'],
  [/pike push|pike hold/, 'pike'],
  [/pull-?up|chin-?up|inverted row|seated row|lat pulldown/, 'pullup'],
  [/mountain climber/, 'mountain_climber'],
  [/burpee/, 'burpee'],
  [/skipping|double-under|high knees/, 'skipping'],
  [/sit-?up|crunch/, 'situp'],
  [/plank|bear crawl|crab walk/, 'plank'],
  [/push-?up|floor press|chest press/, 'pushup'],
  [/lunge|split squat|step-up/, 'lunge'],
  [/squat/, 'squat'],
];

const CATEGORY_FALLBACK = {
  vertical_push: 'pike',
  squat_lunge: 'squat',
  pull_motion: 'pullup',
  core_floor: 'plank',
  cardio_blast: 'skipping',
  horizontal_push: 'pushup',
};

export function resolveExercisePose(name = '', category = 'horizontal_push') {
  const text = String(name).toLowerCase();
  const rule = POSE_RULES.find(([pattern]) => pattern.test(text));
  return { pose: rule?.[1] ?? CATEGORY_FALLBACK[category] ?? 'pushup', variant: undefined };
}

export function getExercisePose(name = '', category = 'horizontal_push') {
  const { pose, variant } = resolveExercisePose(name, category);
  const meta = POSE_META[pose] ?? POSE_META.pushup;
  return {
    pose,
    variant,
    label: meta.label,
    c1: meta.caption[0],
    c2: meta.caption[meta.caption.length - 1],
    mistakes: ['Pertahankan napas dan kendalikan rentang gerak.', 'Hentikan gerakan bila nyeri tajam muncul.'],
  };
}

function setLine(element, a, b) {
  if (!element) return;
  element.setAttribute('x1', a[0]);
  element.setAttribute('y1', a[1]);
  element.setAttribute('x2', b[0]);
  element.setAttribute('y2', b[1]);
}

function readFrame(values) {
  const [head, shoulder, hip, lk, lf, rk, rf, le, lh, re, rh] = Array.from({ length: 11 }, (_, index) => [values[index * 2], values[index * 2 + 1]]);
  return { head, shoulder, hip, lk, lf, rk, rf, le, lh, re, rh };
}

function mix(a, b, amount) {
  return a.map((value, index) => value + (b[index] - value) * amount);
}

function Skeleton({ lineRefs, circleRefs, initialFrame }) {
  const lines = Array.from({ length: 10 });
  const circles = Array.from({ length: 8 });
  const initial = readFrame(initialFrame);
  const initialLines = [
    [initial.head, initial.shoulder], [initial.shoulder, initial.hip],
    [initial.shoulder, initial.le], [initial.le, initial.lh],
    [initial.shoulder, initial.re], [initial.re, initial.rh],
    [initial.hip, initial.lk], [initial.lk, initial.lf],
    [initial.hip, initial.rk], [initial.rk, initial.rf],
  ];
  const initialCircles = [initial.head, initial.shoulder, initial.hip, initial.le, initial.lh, initial.re, initial.rh, initial.lk];
  return (
    <g>
      {lines.map((_, index) => <line key={`line-${index}`} ref={(node) => { lineRefs.current[index] = node; }} x1={initialLines[index][0][0]} y1={initialLines[index][0][1]} x2={initialLines[index][1][0]} y2={initialLines[index][1][1]} stroke={index < 4 ? COLORS.bone : index < 8 ? COLORS.active : COLORS.eccentric} strokeWidth={index < 4 ? 4 : 3} strokeLinecap="round" strokeLinejoin="round" />)}
      {circles.map((_, index) => <circle key={`circle-${index}`} ref={(node) => { circleRefs.current[index] = node; }} cx={initialCircles[index][0]} cy={initialCircles[index][1]} r={index === 0 ? 7 : 3.5} fill={index === 0 ? COLORS.bone : COLORS.joint} stroke="#0f172a" strokeWidth="1.2" />)}
    </g>
  );
}

function AnimatedExerciseCanvas({ pose, className = '' }) {
  const meta = POSE_META[pose] ?? POSE_META.pushup;
  const rootRef = useRef(null);
  const linesRef = useRef([]);
  const circlesRef = useRef([]);
  const captionRef = useRef(null);
  const loopRef = useRef(null);
  const observerRef = useRef(null);
  const rafRef = useRef(null);
  const playingRef = useRef(true);
  const visibleRef = useRef(false);
  const speedRef = useRef(1);
  const startRef = useRef(0);
  const progressRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const draw = useCallback((progress) => {
    const segment = progress * meta.frames.length;
    const index = Math.min(meta.frames.length - 1, Math.floor(segment));
    const amount = segment - index;
    const current = readFrame(mix(meta.frames[index], meta.frames[(index + 1) % meta.frames.length], amount));
    const lines = [
      [current.head, current.shoulder], [current.shoulder, current.hip],
      [current.shoulder, current.le], [current.le, current.lh],
      [current.shoulder, current.re], [current.re, current.rh],
      [current.hip, current.lk], [current.lk, current.lf],
      [current.hip, current.rk], [current.rk, current.rf],
    ];
    lines.forEach(([a, b], indexLine) => setLine(linesRef.current[indexLine], a, b));
    [current.head, current.shoulder, current.hip, current.le, current.lh, current.re, current.rh, current.lk].forEach(([x, y], indexCircle) => {
      const circle = circlesRef.current[indexCircle];
      if (circle) { circle.setAttribute('cx', x); circle.setAttribute('cy', y); }
    });
    const nextCaption = meta.caption[Math.min(meta.caption.length - 1, Math.floor(progress * meta.caption.length))];
    if (captionRef.current && captionRef.current.textContent !== nextCaption) {
      captionRef.current.textContent = nextCaption;
    }
  }, [meta]);

  useEffect(() => {
    playingRef.current = isPlaying;
    if (isPlaying && visibleRef.current && !rafRef.current) {
      startRef.current = performance.now() - progressRef.current * 3200;
      rafRef.current = requestAnimationFrame((time) => loopRef.current?.(time));
    }
    return undefined;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
    startRef.current = performance.now() - progressRef.current * (3200 / speed);
  }, [speed]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const tick = (time) => {
      if (!visibleRef.current || !playingRef.current) { rafRef.current = null; return; }
      progressRef.current = ((time - startRef.current) / (3200 / speedRef.current)) % 1;
      draw(progressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    loopRef.current = tick;
    observerRef.current = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (visibleRef.current && playingRef.current && !rafRef.current) {
        startRef.current = performance.now() - progressRef.current * (3200 / speedRef.current);
        rafRef.current = requestAnimationFrame(tick);
      }
      if (!visibleRef.current && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }, { threshold: 0.05 });
    observerRef.current.observe(node);
    return () => {
      observerRef.current?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [draw, pose]);

  return (
    <div ref={rootRef} className={`rounded-2xl border border-slate-800 bg-slate-950 p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Panggung gerak</p>
          <p ref={captionRef} className="mt-1 text-sm font-semibold text-slate-100">{meta.caption[0]}</p>
        </div>
        <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 font-mono text-[11px] font-semibold text-emerald-300">{meta.label}</span>
      </div>
      <svg viewBox="0 0 160 92" className="h-auto w-full select-none" role="img" aria-label={`Animasi biomekanika ${meta.label}`}>
        <line x1="12" y1="82" x2="148" y2="82" stroke={COLORS.floor} strokeWidth="1.5" />
        <Skeleton lineRefs={linesRef} circleRefs={circlesRef} initialFrame={meta.frames[0]} />
      </svg>
      <div className="mt-3 flex flex-wrap gap-2">
        {[0.5, 1].map((value) => <button key={value} type="button" onClick={() => setSpeed(value)} className={`min-h-11 rounded-xl border px-4 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${speed === value ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-100'}`}>{value}x</button>)}
        <button type="button" onClick={() => setIsPlaying((value) => !value)} className="min-h-11 rounded-xl border border-slate-800 bg-slate-900 px-4 text-xs font-bold text-slate-200 transition-colors hover:border-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400" aria-pressed={isPlaying}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>
    </div>
  );
}

export function PhaseVector({ pose, className = '' }) {
  return <AnimatedExerciseCanvas pose={pose} className={className} />;
}

export { AnimatedExerciseCanvas };
export default POSE_META;
