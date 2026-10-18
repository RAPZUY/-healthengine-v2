'use client';

import React, { useEffect } from 'react';

// Pemetaan label otot Bahasa Indonesia yang konsisten
const MUSCLE_LABELS = {
  chest: 'Dada',
  front_delts: 'Bahu Depan',
  'front delts': 'Bahu Depan',
  side_delts: 'Bahu Samping',
  'side delts': 'Bahu Samping',
  rear_delts: 'Bahu Belakang',
  'rear delts': 'Bahu Belakang',
  biceps: 'Bisep',
  triceps: 'Trisep',
  abs: 'Perut (Core)',
  obliques: 'Perut Samping',
  upper_back: 'Punggung Atas',
  'upper back': 'Punggung Atas',
  lats: 'Punggung Sayap',
  lower_back: 'Punggung Bawah',
  'lower back': 'Punggung Bawah',
  quads: 'Paha Depan',
  hamstrings: 'Paha Belakang',
  glutes: 'Bokong (Glutes)',
  calves: 'Betis',
};

// Pemetaan label alat latihan Bahasa Indonesia
const EQUIPMENT_LABELS_ID = {
  bodyweight: 'Tanpa Alat',
  skipping: 'Tali Skipping',
  pushup_board: 'Push-up Board',
  dumbbell: 'Dumbbell / Botol Air',
  pullup_bar: 'Pull-up Bar Pintu',
  resistance_band: 'Resistance Band',
  chair: 'Kursi / Bench',
};

// Definisi path anatomi poligon Tampak Depan (Anterior)
const ANTERIOR_MUSCLES = {
  chest: {
    paths: [
      'M 72 82 C 82 81, 96 84, 98 94 C 98 104, 88 108, 74 105 C 68 103, 67 92, 72 82 Z',
      'M 128 82 C 118 81, 104 84, 102 94 C 102 104, 112 108, 126 105 C 132 103, 133 92, 128 82 Z',
    ],
    view: 'anterior',
  },
  front_delts: {
    paths: [
      'M 60 70 C 67 68, 72 73, 71 82 C 70 88, 63 90, 58 84 C 55 79, 56 72, 60 70 Z',
      'M 140 70 C 133 68, 128 73, 129 82 C 130 88, 137 90, 142 84 C 145 79, 144 72, 140 70 Z',
    ],
    view: 'anterior',
  },
  side_delts: {
    paths: [
      'M 54 74 C 58 70, 62 73, 60 83 C 58 89, 52 88, 50 82 C 49 77, 51 75, 54 74 Z',
      'M 146 74 C 142 70, 138 73, 140 83 C 142 89, 148 88, 150 82 C 151 77, 149 75, 146 74 Z',
    ],
    view: 'anterior',
  },
  biceps: {
    paths: [
      'M 52 92 C 58 91, 62 97, 60 114 C 59 122, 53 123, 49 116 C 47 107, 48 95, 52 92 Z',
      'M 148 92 C 142 91, 138 97, 140 114 C 141 122, 147 123, 151 116 C 153 107, 152 95, 148 92 Z',
    ],
    view: 'anterior',
  },
  abs: {
    paths: [
      'M 89 111 L 98 111 L 98 120 L 89 120 Z',
      'M 102 111 L 111 111 L 111 120 L 102 120 Z',
      'M 89 123 L 98 123 L 98 132 L 89 132 Z',
      'M 102 123 L 111 123 L 111 132 L 102 132 Z',
      'M 90 135 L 98 135 L 98 145 L 90 144 Z',
      'M 102 135 L 110 135 L 110 144 L 102 145 Z',
    ],
    view: 'anterior',
  },
  obliques: {
    paths: [
      'M 76 116 C 84 116, 86 126, 86 142 C 81 144, 76 138, 74 128 C 73 122, 74 118, 76 116 Z',
      'M 124 116 C 116 116, 114 126, 114 142 C 119 144, 124 138, 126 128 C 127 122, 126 118, 124 116 Z',
    ],
    view: 'anterior',
  },
  quads: {
    paths: [
      'M 76 168 C 88 166, 96 172, 95 198 C 94 214, 88 222, 78 220 C 72 214, 70 188, 76 168 Z',
      'M 124 168 C 112 166, 104 172, 105 198 C 106 214, 112 222, 122 220 C 128 214, 130 188, 124 168 Z',
    ],
    view: 'anterior',
  },
  calves: {
    paths: [
      'M 76 240 C 85 240, 89 248, 87 266 C 85 272, 79 272, 76 264 C 74 256, 74 246, 76 240 Z',
      'M 124 240 C 115 240, 111 248, 113 266 C 115 272, 121 272, 124 264 C 126 256, 126 246, 124 240 Z',
    ],
    view: 'anterior',
  },
};

// Definisi path anatomi Tampak Belakang (Posterior)
const POSTERIOR_MUSCLES = {
  upper_back: {
    paths: ['M 100 66 L 118 78 L 109 96 L 100 102 L 91 96 L 82 78 Z'],
    view: 'posterior',
  },
  rear_delts: {
    paths: [
      'M 60 72 C 67 70, 72 75, 70 84 C 65 86, 58 84, 56 79 C 55 75, 57 73, 60 72 Z',
      'M 140 72 C 133 70, 128 75, 130 84 C 135 86, 142 84, 144 79 C 145 75, 143 73, 140 72 Z',
    ],
    view: 'posterior',
  },
  lats: {
    paths: [
      'M 84 94 C 94 96, 96 112, 94 134 C 84 132, 76 118, 74 105 C 74 98, 78 95, 84 94 Z',
      'M 116 94 C 106 96, 104 112, 106 134 C 116 132, 124 118, 126 105 C 126 98, 122 95, 116 94 Z',
    ],
    view: 'posterior',
  },
  triceps: {
    paths: [
      'M 50 90 C 58 89, 61 96, 59 116 C 56 123, 49 122, 47 114 C 45 104, 46 94, 50 90 Z',
      'M 150 90 C 142 89, 139 96, 141 116 C 144 123, 151 122, 153 114 C 155 104, 154 94, 150 90 Z',
    ],
    view: 'posterior',
  },
  lower_back: {
    paths: [
      'M 91 135 L 98 135 L 98 155 L 91 154 Z',
      'M 102 135 L 109 135 L 109 154 L 102 155 Z',
    ],
    view: 'posterior',
  },
  glutes: {
    paths: [
      'M 75 160 C 88 156, 98 160, 98 178 C 96 190, 84 192, 75 186 C 68 178, 69 166, 75 160 Z',
      'M 125 160 C 112 156, 102 160, 102 178 C 104 190, 116 192, 125 186 C 132 178, 131 166, 125 160 Z',
    ],
    view: 'posterior',
  },
  hamstrings: {
    paths: [
      'M 75 192 C 86 190, 95 196, 93 222 C 90 228, 80 228, 75 224 C 70 216, 70 200, 75 192 Z',
      'M 125 192 C 114 190, 105 196, 107 222 C 110 228, 120 228, 125 224 C 130 216, 130 200, 125 192 Z',
    ],
    view: 'posterior',
  },
  calves: {
    paths: [
      'M 74 238 C 88 236, 91 248, 88 266 C 85 273, 77 273, 74 266 C 71 257, 70 245, 74 238 Z',
      'M 126 238 C 112 236, 109 248, 112 266 C 115 273, 123 273, 126 266 C 129 257, 130 245, 126 238 Z',
    ],
    view: 'posterior',
  },
};

function getMuscleFill(muscleId, primaryMuscles, secondaryMuscles) {
  if (primaryMuscles.includes(muscleId)) return { fill: '#f43f5e', stroke: '#fb7185', type: 'primary' };
  if (secondaryMuscles.includes(muscleId)) return { fill: '#fbbf24', stroke: '#fcd34d', type: 'secondary' };
  return { fill: '#1e293b', stroke: '#334155', type: 'none' };
}

function renderMusclePaths(muscleDef, muscleId, primaryMuscles, secondaryMuscles) {
  const { fill, stroke, type } = getMuscleFill(muscleId, primaryMuscles, secondaryMuscles);
  const opacity = type === 'none' ? 0.45 : 0.95;

  return muscleDef.paths.map((d, i) => (
    <path
      key={`${muscleId}-${i}`}
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={type !== 'none' ? '1.5' : '1'}
      opacity={opacity}
      className={`transition-all duration-300 ${type !== 'none' ? 'drop-shadow-md' : ''}`}
    />
  ));
}

function getLabelPosition(muscleId, view) {
  const positions = {
    anterior: {
      chest: { from: { x: 88, y: 94 }, to: { x: 180, y: 84 } },
      front_delts: { from: { x: 64, y: 76 }, to: { x: 16, y: 64 } },
      side_delts: { from: { x: 144, y: 78 }, to: { x: 182, y: 68 } },
      biceps: { from: { x: 54, y: 106 }, to: { x: 16, y: 106 } },
      abs: { from: { x: 105, y: 128 }, to: { x: 182, y: 130 } },
      obliques: { from: { x: 80, y: 130 }, to: { x: 16, y: 136 } },
      quads: { from: { x: 86, y: 196 }, to: { x: 16, y: 196 } },
      calves: { from: { x: 118, y: 254 }, to: { x: 182, y: 256 } },
    },
    posterior: {
      upper_back: { from: { x: 100, y: 84 }, to: { x: 182, y: 76 } },
      rear_delts: { from: { x: 64, y: 76 }, to: { x: 16, y: 68 } },
      lats: { from: { x: 80, y: 114 }, to: { x: 16, y: 114 } },
      triceps: { from: { x: 146, y: 106 }, to: { x: 182, y: 106 } },
      lower_back: { from: { x: 105, y: 144 }, to: { x: 182, y: 144 } },
      glutes: { from: { x: 82, y: 174 }, to: { x: 16, y: 174 } },
      hamstrings: { from: { x: 118, y: 208 }, to: { x: 182, y: 208 } },
      calves: { from: { x: 82, y: 254 }, to: { x: 16, y: 254 } },
    },
  };
  return positions[view]?.[muscleId];
}

function BodySVG({ title, muscles, primaryMuscles, secondaryMuscles, view }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs text-center text-slate-400 font-semibold mb-2">{title}</p>
      <svg viewBox="0 0 200 295" className="w-full h-auto">
        <defs>
          <marker id={`arrow-${view}`} markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Siluet dasar tubuh */}
        <ellipse cx="100" cy="34" rx="17" ry="21" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
        <path d="M 93 54 L 93 64 L 107 64 L 107 54 Z" fill="#0f172a" stroke="#334155" strokeWidth="1" />
        <path
          d="M 64 68 Q 50 72 47 90 L 46 128 Q 45 138 50 144 L 54 144 Q 58 136 57 126 L 58 92 Q 62 80 68 74 Z"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="1"
        />
        <path
          d="M 136 68 Q 150 72 153 90 L 154 128 Q 155 138 150 144 L 146 144 Q 142 136 143 126 L 142 92 Q 138 80 132 74 Z"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="1"
        />
        <path
          d="M 68 68 Q 100 63 132 68 L 138 72 Q 140 100 134 136 L 128 156 Q 115 164 100 166 Q 85 164 72 156 L 66 136 Q 60 100 62 72 Z"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="1.2"
        />
        <path
          d="M 74 162 Q 70 190 69 224 Q 68 250 73 274 Q 75 284 80 288 L 91 288 Q 93 282 93 270 Q 95 244 95 220 Q 97 190 95 166 Z"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="1.2"
        />
        <path
          d="M 126 162 Q 130 190 131 224 Q 132 250 127 274 Q 125 284 120 288 L 109 288 Q 107 282 107 270 Q 105 244 105 220 Q 103 190 105 166 Z"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="1.2"
        />

        {/* Lapisan Otot Vektor */}
        {Object.entries(muscles).map(([muscleId, def]) => (
          <g key={muscleId}>{renderMusclePaths(def, muscleId, primaryMuscles, secondaryMuscles)}</g>
        ))}

        {/* Label Otot Utama */}
        {primaryMuscles.map((muscleId) => {
          const pos = getLabelPosition(muscleId, view);
          if (!pos || !muscles[muscleId]) return null;
          return (
            <g key={`label-${muscleId}`}>
              <line
                x1={pos.from.x}
                y1={pos.from.y}
                x2={pos.to.x}
                y2={pos.to.y}
                stroke="#f43f5e"
                strokeWidth="0.9"
                markerEnd={`url(#arrow-${view})`}
                strokeDasharray="2 2"
              />
              <text
                x={pos.to.x}
                y={pos.to.y - 4}
                fill="#f43f5e"
                fontSize="7.5"
                fontWeight="bold"
                textAnchor={pos.to.x < 100 ? 'start' : 'end'}
              >
                {MUSCLE_LABELS[muscleId] || muscleId}
              </text>
            </g>
          );
        })}

        {/* Label Otot Sekunder */}
        {secondaryMuscles.map((muscleId) => {
          const pos = getLabelPosition(muscleId, view);
          if (!pos || !muscles[muscleId]) return null;
          return (
            <g key={`label-s-${muscleId}`}>
              <line
                x1={pos.from.x}
                y1={pos.from.y}
                x2={pos.to.x}
                y2={pos.to.y}
                stroke="#fbbf24"
                strokeWidth="0.7"
                strokeDasharray="2 2"
              />
              <text
                x={pos.to.x}
                y={pos.to.y - 4}
                fill="#fbbf24"
                fontSize="6.5"
                fontWeight="semibold"
                textAnchor={pos.to.x < 100 ? 'start' : 'end'}
              >
                {MUSCLE_LABELS[muscleId] || muscleId}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Analisis pola biomekanika berdasarkan jenis gerakan
function getBiomechanicsData(exercise) {
  const p = exercise.primaryMuscles || [];
  const nameLower = (exercise.name || '').toLowerCase();

  // Pattern categorization
  if (p.includes('quads') || p.includes('glutes') || p.includes('hamstrings') || p.includes('calves')) {
    return {
      type: 'legs',
      phase1Title: 'Fase 1: Turun Terkontrol (Eksentrik)',
      phase1Breath: 'Tarik Napas (Turun Terkontrol)',
      phase1Desc: 'Buka pinggul ke belakang, tekuk lutut perlahan searah jari kaki hingga sudut 90°.',
      phase2Title: 'Fase 2: Dorong Tegak (Konsentrik)',
      phase2Breath: 'Buang Napas (Dorong/Tarik Kuat)',
      phase2Desc: 'Dorong lantai melalui tumit, kencangkan paha depan & bokong hingga posisi berdiri tegak.',
      mistakes: [
        'Lutut menekuk ke arah dalam (knee valgus) membebani ligamen.',
        'Tumit terangkat dari lantai saat turun, memindahkan beban ke sendi lutut.',
        'Punggung bawah melengkung membungkuk karena core tidak dikunci.',
      ],
    };
  }

  if (p.includes('lats') || p.includes('upper_back') || p.includes('biceps')) {
    return {
      type: 'pull',
      phase1Title: 'Fase 1: Rentangan Penuh (Eksentrik)',
      phase1Breath: 'Tarik Napas (Turun Terkontrol)',
      phase1Desc: 'Luruskan lengan perlahan, rasakan regangan penuh pada otot punggung sayap dan bisep.',
      phase2Title: 'Fase 2: Tarikan Puncak (Konsentrik)',
      phase2Breath: 'Buang Napas (Dorong/Tarik Kuat)',
      phase2Desc: 'Tarik siku ke bawah dan belakang, rapatkan belikat, dorong dada membusung ke depan.',
      mistakes: [
        'Mengayunkan badan (kipping/momentum) menghilangkan beban dari otot punggung.',
        'Bahu terangkat mendekati telinga (shrugging) akibat kurang depresi skapula.',
        'Hanya menarik dengan lengan tanpa mengaktifkan otot sayap (lats).',
      ],
    };
  }

  if (p.includes('abs') || p.includes('obliques')) {
    return {
      type: 'core',
      phase1Title: 'Fase 1: Ekstensi / Persiapan (Eksentrik)',
      phase1Breath: 'Tarik Napas (Turun Terkontrol)',
      phase1Desc: 'Buka rongga perut terkendali tanpa melepaskan ketegangan otot panggul dan pinggang.',
      phase2Title: 'Fase 2: Kontraksi Puncak (Konsentrik)',
      phase2Breath: 'Buang Napas (Dorong/Tarik Kuat)',
      phase2Desc: 'Tarik tulang rusuk mendekati panggul, peras otot perut kuat selama 1 detik penuh.',
      mistakes: [
        'Menarik leher atau kepala dengan tangan hingga menimbulkan cedera servikal.',
        'Menahan napas terlalu lama sehingga tekanan rongga perut naik berlebihan.',
        'Menggunakan momentum ayunan kaki alih-alih kekuatan kontraksi core.',
      ],
    };
  }

  if (p.includes('side_delts') || p.includes('rear_delts') || (p.includes('front_delts') && !p.includes('chest'))) {
    return {
      type: 'shoulders',
      phase1Title: 'Fase 1: Turun Terkendali (Eksentrik)',
      phase1Breath: 'Tarik Napas (Turun Terkontrol)',
      phase1Desc: 'Turunkan beban/lengan perlahan di bidang scapular plane tanpa menjatuhkan siku.',
      phase2Title: 'Fase 2: Angkat / Tekan (Konsentrik)',
      phase2Breath: 'Buang Napas (Dorong/Tarik Kuat)',
      phase2Desc: 'Dorong atau angkat siku sejajar bahu, tahan posisi puncak tanpa melengkungkan pinggang.',
      mistakes: [
        'Melengkungkan tulang belakang ke belakang (arching) saat mendorong beban ke atas.',
        'Mengayunkan panggul untuk mengangkat beban di luar kapasitas otot bahu.',
        'Pergelangan tangan tertekuk ke belakang melemahkan transfer tenaga.',
      ],
    };
  }

  // Default: Push / Chest
  return {
    type: 'push',
    phase1Title: 'Fase 1: Turun ke Dada (Eksentrik)',
    phase1Breath: 'Tarik Napas (Turun Terkontrol)',
    phase1Desc: 'Buka dada, tekuk siku 45-60 derajat dari torso, turunkan badan hingga dada hampir menyentuh bidang.',
    phase2Title: 'Fase 2: Dorongan Kuat (Konsentrik)',
    phase2Breath: 'Buang Napas (Dorong/Tarik Kuat)',
    phase2Desc: 'Kencangkan dada dan trisep, dorong kuat hingga lengan lurus tanpa mengunci sendi siku keras.',
    mistakes: [
      'Siku membuka 90 derajat sejajar bahu yang menjepit sendi rotator cuff.',
      'Pinggul melorot ke bawah karena core perut tidak dikunci rapat.',
      'Kepala mendongak atau menunduk ekstrem mengganggu kelurusan tulang leher.',
    ],
  };
}

// Komponen Visualizer Vektor Biomekanika 2-Fase
function BiomechanicalVectorViewer({ biomech }) {
  const { type, phase1Breath, phase2Breath, phase1Desc, phase2Desc, mistakes } = biomech;

  return (
    <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <span>📐</span> Panduan Biomekanika Gerakan
        </h4>
        <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          2-Fase Vektor
        </span>
      </div>

      {/* Grid 2-Fase Diagram */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Fase 1: Eksentrik */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-blue-400">Fase 1: Eksentrik</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono">Persiapan</span>
            </div>
            <p className="text-xs text-slate-400 leading-snug">{phase1Desc}</p>
          </div>

          {/* SVG Diagram Fase 1 */}
          <div className="py-2 flex items-center justify-center bg-slate-950/70 rounded-lg border border-slate-800/60">
            <svg viewBox="0 0 160 90" className="w-full max-w-[180px] h-20">
              <defs>
                <marker id="arrow-down" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
                </marker>
              </defs>

              {type === 'push' && (
                <g>
                  {/* Garis Lantai */}
                  <line x1="20" y1="80" x2="140" y2="80" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Tubuh Turun Rendah (Eksentrik) */}
                  <line x1="45" y1="62" x2="120" y2="70" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="126" cy="68" r="8" fill="#38bdf8" /> {/* Kepala */}
                  <polyline points="50,63 70,52 82,78" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" /> {/* Tangan tekuk 90 */}
                  <line x1="38" y1="78" x2="45" y2="62" stroke="#64748b" strokeWidth="3" /> {/* Kaki */}
                  {/* Panah Vektor Turun Terkontrol */}
                  <line x1="85" y1="28" x2="85" y2="52" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow-down)" strokeDasharray="3 2" />
                  <text x="94" y="42" fill="#38bdf8" fontSize="8" fontWeight="bold">Turun 2 dtk</text>
                </g>
              )}

              {type === 'pull' && (
                <g>
                  {/* Palang / Bar */}
                  <line x1="30" y1="18" x2="130" y2="18" stroke="#64748b" strokeWidth="3" />
                  {/* Tubuh Menggantung Terentang Penuh */}
                  <line x1="80" y1="36" x2="80" y2="68" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="80" cy="28" r="7" fill="#38bdf8" />
                  <line x1="65" y1="18" x2="74" y2="38" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                  <line x1="95" y1="18" x2="86" y2="38" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                  <line x1="80" y1="68" x2="75" y2="86" stroke="#64748b" strokeWidth="2.5" />
                  <line x1="80" y1="68" x2="85" y2="86" stroke="#64748b" strokeWidth="2.5" />
                  {/* Panah Regangan */}
                  <line x1="108" y1="35" x2="108" y2="58" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-down)" strokeDasharray="2 2" />
                  <text x="115" y="50" fill="#38bdf8" fontSize="7.5" fontWeight="bold">Rentang</text>
                </g>
              )}

              {type === 'legs' && (
                <g>
                  {/* Garis Lantai */}
                  <line x1="20" y1="84" x2="140" y2="84" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Torso & Hip Hinge turun */}
                  <circle cx="70" cy="24" r="7" fill="#38bdf8" />
                  <line x1="70" y1="31" x2="64" y2="54" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  {/* Femur sudut squat */}
                  <line x1="64" y1="54" x2="84" y2="58" stroke="#e2e8f0" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="84" y1="58" x2="82" y2="82" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                  {/* Panah Vektor Hinge Turun */}
                  <line x1="105" y1="28" x2="105" y2="54" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-down)" strokeDasharray="3 2" />
                  <text x="112" y="44" fill="#38bdf8" fontSize="7.5" fontWeight="bold">90° Paralel</text>
                </g>
              )}

              {(type === 'shoulders' || type === 'core') && (
                <g>
                  <circle cx="80" cy="26" r="8" fill="#38bdf8" />
                  <line x1="80" y1="34" x2="80" y2="68" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  <polyline points="55,50 80,44 105,50" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                  <line x1="80" y1="68" x2="65" y2="84" stroke="#64748b" strokeWidth="3" />
                  <line x1="80" y1="68" x2="95" y2="84" stroke="#64748b" strokeWidth="3" />
                  <line x1="120" y1="34" x2="120" y2="56" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-down)" strokeDasharray="3 2" />
                  <text x="126" y="48" fill="#38bdf8" fontSize="7.5" fontWeight="bold">Terkendali</text>
                </g>
              )}
            </svg>
          </div>

          <div className="pt-1.5 border-t border-slate-800">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded w-full">
              🌬️ {phase1Breath}
            </span>
          </div>
        </div>

        {/* Fase 2: Konsentrik */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-400">Fase 2: Konsentrik</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">Puncak</span>
            </div>
            <p className="text-xs text-slate-400 leading-snug">{phase2Desc}</p>
          </div>

          {/* SVG Diagram Fase 2 */}
          <div className="py-2 flex items-center justify-center bg-slate-950/70 rounded-lg border border-slate-800/60">
            <svg viewBox="0 0 160 90" className="w-full max-w-[180px] h-20">
              <defs>
                <marker id="arrow-up" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
                </marker>
              </defs>

              {type === 'push' && (
                <g>
                  {/* Garis Lantai */}
                  <line x1="20" y1="80" x2="140" y2="80" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Tubuh Terangkat Tegak Lurus Penuh */}
                  <line x1="45" y1="52" x2="120" y2="40" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="128" cy="38" r="8" fill="#10b981" />
                  {/* Tangan lurus dorong kuat */}
                  <line x1="102" y1="44" x2="102" y2="78" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="38" y1="78" x2="45" y2="52" stroke="#64748b" strokeWidth="3" />
                  {/* Titik Kencang Otot Bekerja (Glowing Hotspot) */}
                  <circle cx="102" cy="44" r="7" fill="#f43f5e" opacity="0.3" className="animate-ping" />
                  <circle cx="102" cy="44" r="4" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                  {/* Panah Dorongan Kuat */}
                  <line x1="102" y1="74" x2="102" y2="52" stroke="#34d399" strokeWidth="2.5" markerEnd="url(#arrow-up)" />
                  <text x="110" y="60" fill="#34d399" fontSize="8" fontWeight="bold">Dorong!</text>
                </g>
              )}

              {type === 'pull' && (
                <g>
                  {/* Palang / Bar */}
                  <line x1="30" y1="18" x2="130" y2="18" stroke="#64748b" strokeWidth="3" />
                  {/* Dagu di atas palang / siku ditarik ke bawah */}
                  <circle cx="80" cy="14" r="7" fill="#10b981" />
                  <line x1="80" y1="20" x2="80" y2="52" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  <polyline points="65,18 70,30 80,24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                  <polyline points="95,18 90,30 80,24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                  {/* Titik Kencang Punggung Lats */}
                  <circle cx="80" cy="34" r="7" fill="#f43f5e" opacity="0.3" className="animate-ping" />
                  <circle cx="80" cy="34" r="4" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                  {/* Panah Angkat */}
                  <line x1="50" y1="48" x2="50" y2="24" stroke="#34d399" strokeWidth="2.5" markerEnd="url(#arrow-up)" />
                  <text x="24" y="38" fill="#34d399" fontSize="8" fontWeight="bold">Peras Otot</text>
                </g>
              )}

              {type === 'legs' && (
                <g>
                  <line x1="20" y1="84" x2="140" y2="84" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                  {/* Posisi Berdiri Tegak Mengunci Glutes & Quads */}
                  <circle cx="80" cy="18" r="7" fill="#10b981" />
                  <line x1="80" y1="25" x2="80" y2="54" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  <line x1="80" y1="54" x2="76" y2="82" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="80" y1="54" x2="84" y2="82" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Glowing Titik Quads & Glutes */}
                  <circle cx="80" cy="54" r="7" fill="#f43f5e" opacity="0.3" className="animate-ping" />
                  <circle cx="80" cy="54" r="4" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                  <line x1="105" y1="70" x2="105" y2="40" stroke="#34d399" strokeWidth="2.5" markerEnd="url(#arrow-up)" />
                  <text x="112" y="55" fill="#34d399" fontSize="8" fontWeight="bold">Kunci Otot!</text>
                </g>
              )}

              {(type === 'shoulders' || type === 'core') && (
                <g>
                  <circle cx="80" cy="18" r="8" fill="#10b981" />
                  <line x1="80" y1="26" x2="80" y2="60" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  {/* Lengan Mendorong Ke Atas Penuh */}
                  <line x1="80" y1="36" x2="60" y2="16" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                  <line x1="80" y1="36" x2="100" y2="16" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="80" cy="36" r="7" fill="#f43f5e" opacity="0.3" className="animate-ping" />
                  <circle cx="80" cy="36" r="4" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                  <line x1="120" y1="50" x2="120" y2="24" stroke="#34d399" strokeWidth="2.5" markerEnd="url(#arrow-up)" />
                  <text x="126" y="38" fill="#34d399" fontSize="8" fontWeight="bold">Puncak</text>
                </g>
              )}
            </svg>
          </div>

          <div className="pt-1.5 border-t border-slate-800">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded w-full">
              💨 {phase2Breath}
            </span>
          </div>
        </div>
      </div>

      {/* Kesalahan Umum Postur yang Wajib Dihindari */}
      <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 space-y-1.5">
        <p className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
          <span>⚠️</span> Kesalahan Postur yang Wajib Dihindari:
        </p>
        <ul className="space-y-1 text-xs text-slate-300">
          {mistakes.map((m, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-rose-400 font-bold shrink-0">✕</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function MuscleAnatomyModal({ exercise, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!exercise) return null;

  const {
    name,
    equipment,
    setsReps,
    rest,
    tempo,
    difficulty,
    postureTip,
    primaryMuscles = [],
    secondaryMuscles = [],
    muscleExplanation,
  } = exercise;

  const biomech = getBiomechanicsData(exercise);

  const anteriorPrimary = primaryMuscles.filter((m) => ANTERIOR_MUSCLES[m]);
  const anteriorSecondary = secondaryMuscles.filter((m) => ANTERIOR_MUSCLES[m]);
  const posteriorPrimary = primaryMuscles.filter((m) => POSTERIOR_MUSCLES[m]);
  const posteriorSecondary = secondaryMuscles.filter((m) => POSTERIOR_MUSCLES[m]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 leading-snug">{name}</h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {EQUIPMENT_LABELS_ID[equipment] || equipment}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-950 text-slate-300 border border-slate-800">
                  {difficulty}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="min-h-11 min-w-11 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-center shrink-0"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 p-4">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-500 block">Set × Rep</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{setsReps}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-500 block">Istirahat</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{rest}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 col-span-2">
            <span className="text-xs text-emerald-400 block font-semibold">⏱ Tempo Gerakan</span>
            <span className="text-sm font-bold text-emerald-300">{tempo}</span>
          </div>
        </div>

        {/* Tips Postur & Keamanan */}
        <div className="px-4 pb-3">
          <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20">
            <p className="text-xs font-semibold text-blue-400 mb-1">🛡️ Tips Postur & Keamanan</p>
            <p className="text-xs text-slate-300 leading-relaxed">{postureTip}</p>
          </div>
        </div>

        {/* Panel Vektor Biomekanika 2-Fase */}
        <div className="px-4 pb-3">
          <BiomechanicalVectorViewer biomech={biomech} />
        </div>

        {/* SVG Muscle Anatomy Map */}
        <div className="px-4 pb-3">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5">
            <p className="text-xs font-bold text-slate-300 mb-3 text-center">Peta Anatomi Otot Aktif</p>

            <div className="flex gap-2">
              <BodySVG
                title="Tampak Depan"
                muscles={ANTERIOR_MUSCLES}
                primaryMuscles={anteriorPrimary}
                secondaryMuscles={anteriorSecondary}
                view="anterior"
              />
              <BodySVG
                title="Tampak Belakang"
                muscles={POSTERIOR_MUSCLES}
                primaryMuscles={posteriorPrimary}
                secondaryMuscles={posteriorSecondary}
                view="posterior"
              />
            </div>

            {/* Legenda Otot */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-3.5 pt-3 border-t border-slate-800/80 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-400 shrink-0" />
                <span>🔴 <strong>Merah:</strong> Otot Utama yang Dilatih</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-300 shrink-0" />
                <span>🟡 <strong>Kuning:</strong> Otot Pendukung (Stabilizer)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Muscle Explanation */}
        {muscleExplanation && (
          <div className="px-4 pb-4">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <p className="text-xs font-semibold text-slate-300 mb-1">💡 Cara Kerja Otot</p>
              <p className="text-xs text-slate-400 leading-relaxed">{muscleExplanation}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-11 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-sm font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
