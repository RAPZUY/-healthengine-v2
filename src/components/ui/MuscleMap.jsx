import React from 'react';

// Pemetaan label otot Bahasa Indonesia yang konsisten
export const MUSCLE_LABELS = {
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
export const EQUIPMENT_LABELS_ID = {
  bodyweight: 'Tanpa Alat',
  skipping: 'Tali Skipping',
  pushup_board: 'Push-up Board',
  dumbbell: 'Dumbbell / Botol Air',
  pullup_bar: 'Pull-up Bar Pintu',
  resistance_band: 'Resistance Band',
  chair: 'Kursi / Bench',
};

// Definisi path anatomi poligon Tampak Depan (Anterior)
export const ANTERIOR_MUSCLES = {
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
export const POSTERIOR_MUSCLES = {
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

export function BodySVG({ title, muscles, primaryMuscles, secondaryMuscles, view }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-2 text-center text-xs font-semibold text-slate-400">{title}</p>
      <svg viewBox="0 0 200 295" className="h-auto w-full" role="img" aria-label={`Peta otot ${title}`}>
        <defs>
          <marker id={`arrow-${view}`} markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#94a3b8" />
          </marker>
        </defs>

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

        {Object.entries(muscles).map(([muscleId, def]) => (
          <g key={muscleId}>{renderMusclePaths(def, muscleId, primaryMuscles, secondaryMuscles)}</g>
        ))}

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
