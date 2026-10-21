'use client';

import React, { useId } from 'react';

/* -------------------------------------------------------------------------- */
/* Drawing primitives                                                         */
/* -------------------------------------------------------------------------- */

const BONE = '#94a3b8';
const LIMB = '#e2e8f0';
const MUTED = '#64748b';
const PHASE_1 = '#38bdf8';
const PHASE_2 = '#34d399';
const HIGHLIGHT = '#f43f5e';
const FLOOR = '#334155';

function Bone({ d, color = BONE, width = 3.8, dash }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash}
    />
  );
}

function Head({ cx, cy, phase = 1, r = 6.2 }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={phase === 1 ? PHASE_1 : '#10b981'}
      stroke={phase === 1 ? '#7dd3fc' : '#6ee7b7'}
      strokeWidth="1"
    />
  );
}

function Tension({ x, y, r = 4.2, color = HIGHLIGHT }) {
  return (
    <>
      <circle cx={x} cy={y} r={r + 3} fill={color} opacity="0.2" />
      <circle cx={x} cy={y} r={r} fill={color} stroke="#fff" strokeWidth="1" />
    </>
  );
}

function Arrow({ x1, y1, x2, y2, color = PHASE_2, markerId, dash }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray={dash}
      markerEnd={markerId ? `url(#${markerId})` : undefined}
    />
  );
}

function Note({ x, y, text, color = '#94a3b8', anchor = 'middle', size = 6.8, weight = 'bold' }) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontWeight={weight} textAnchor={anchor}>
      {text}
    </text>
  );
}

function Dumbbell({ x, y, angle = 0, color = '#fbbf24' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <line x1="-5" y1="0" x2="5" y2="0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="-7" y="-2.6" width="2.6" height="5.2" rx="0.8" fill={color} />
      <rect x="4.4" y="-2.6" width="2.6" height="5.2" rx="0.8" fill={color} />
    </g>
  );
}

function Chair({ x, y, width = 26, height = 22 }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + width} y2={y} stroke={MUTED} strokeWidth="3" strokeLinecap="round" />
      <line x1={x + 2} y1={y} x2={x + 2} y2={y + height} stroke={MUTED} strokeWidth="2" strokeLinecap="round" />
      <line
        x1={x + width - 2}
        y1={y}
        x2={x + width - 2}
        y2={y + height}
        stroke={MUTED}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}

function Ground({ y = 82 }) {
  return <line x1="10" y1={y} x2="150" y2={y} stroke={FLOOR} strokeWidth="1.6" strokeDasharray="4 3" />;
}

function Frame({ x = 34 }) {
  return (
    <g>
      <line x1={x} y1="16" x2={x} y2="82" stroke={MUTED} strokeWidth="3" strokeLinecap="round" />
      <line x1={x} y1="16" x2={x + 18} y2="16" stroke={MUTED} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Pose renderers — every exercise family has its own body geometry           */
/* -------------------------------------------------------------------------- */

const POSE_RENDERERS = {
  /* ---------------------------- SQUAT FAMILY ----------------------------- */
  squat: (phase, variant) => {
    if (variant === 'sumo') {
      if (phase === 1) {
        return (
          <g>
            <Bone d="M80 25 L80 46" width={4} />
            <Bone d="M80 46 L56 54" color={LIMB} />
            <Bone d="M56 54 L50 82" color={MUTED} />
            <Bone d="M50 82 L44 82" color={MUTED} width={3} />
            <Bone d="M80 46 L104 54" color={LIMB} />
            <Bone d="M104 54 L110 82" color={MUTED} />
            <Bone d="M110 82 L116 82" color={MUTED} width={3} />
            <Bone d="M72 30 L66 40 L68 44" color={PHASE_1} width={3} />
            <Bone d="M88 30 L94 40 L92 44" color={PHASE_1} width={3} />
            <Dumbbell x={80} y={45} angle={0} />
            <Head cx="80" cy="18" phase={1} />
            <Tension x="58" y="56" />
            <Tension x="102" y="56" />
            <Note x="80" y="16" text="Stance lebar" color={PHASE_1} />
          </g>
        );
      }
      return (
        <g>
          <Bone d="M80 22 L80 46" width={4} />
          <Bone d="M80 46 L60 64" color={LIMB} />
          <Bone d="M60 64 L52 82" color={MUTED} />
          <Bone d="M52 82 L46 82" color={MUTED} width={3} />
          <Bone d="M80 46 L100 64" color={LIMB} />
          <Bone d="M100 64 L108 82" color={MUTED} />
          <Bone d="M108 82 L114 82" color={MUTED} width={3} />
          <Bone d="M72 28 L66 38 L68 42" color={PHASE_2} width={3} />
          <Bone d="M88 28 L94 38 L92 42" color={PHASE_2} width={3} />
          <Dumbbell x={80} y={43} angle={0} />
          <Head cx="80" cy="15" phase={2} />
          <Tension x="62" y="62" color={PHASE_2} />
          <Tension x="98" y="62" color={PHASE_2} />
          <Arrow x1="132" y1="76" x2="132" y2="46" color={PHASE_2} markerId="arrow-up" />
        </g>
      );
    }

    const goblet = variant === 'goblet';
    const pause = variant === 'pause';
    if (phase === 1) {
      return (
        <g>
          <Bone d="M54 25 L50 46" width={4} />
          <Bone d="M50 46 L76 48" color={LIMB} />
          <Bone d="M76 48 L78 82" color={MUTED} />
          <Bone d="M78 82 L89 82" color={MUTED} width={3} />
          <Bone d="M55 29 L65 38 L76 40" color={PHASE_1} width={3} />
          <Head cx="52" cy="18" phase={1} />
          <Tension x="62" y="47" />
          <Tension x="47" y="43" />
          {goblet ? <Dumbbell x={60} y={33} angle={90} /> : null}
          <Note x="106" y="38" text="Turun" color={PHASE_1} anchor="start" />
          <Arrow x1="101" y1="24" x2="101" y2="44" color={PHASE_1} markerId="arrow-down" />
          <Note x="101" y="60" text="Paha ∥ lantai" color={PHASE_1} />
          {pause ? <Note x="101" y="70" text="tahan 2 detik" color="#fbbf24" /> : null}
        </g>
      );
    }
    return (
      <g>
        <Bone d="M58 20 L58 46" width={4} />
        <Bone d="M58 46 L59 63" color={LIMB} />
        <Bone d="M59 63 L60 82" color={MUTED} />
        <Bone d="M60 82 L69 82" color={MUTED} width={3} />
        <Bone d="M58 23 L56 38 L57 50" color={PHASE_2} width={3} />
        <Head cx="58" cy="13" phase={2} />
        <Tension x="58" y="56" color={PHASE_2} />
        {goblet ? <Dumbbell x={64} y={34} angle={90} /> : null}
        <Arrow x1="92" y1="74" x2="92" y2="46" color={PHASE_2} markerId="arrow-up" />
        <Note x="97" y="62" text="Berdiri" color={PHASE_2} anchor="start" />
      </g>
    );
  },

  jump_squat: (phase) => {
    if (phase === 1) {
      return (
        <g>
          <Bone d="M54 26 L50 48" width={4} />
          <Bone d="M50 48 L76 50" color={LIMB} />
          <Bone d="M76 50 L78 82" color={MUTED} />
          <Bone d="M78 82 L88 82" color={MUTED} width={3} />
          <Bone d="M54 30 L43 38 L39 50" color={PHASE_1} width={3} />
          <Head cx="52" cy="19" phase={1} />
          <Tension x="62" y="49" />
          <Tension x="46" y="45" />
          <Note x="107" y="40" text="Ancang-ancang" color={PHASE_1} />
          <Arrow x1="101" y1="26" x2="101" y2="50" color={PHASE_1} markerId="arrow-down" />
        </g>
      );
    }
    return (
      <g>
        <Bone d="M66 28 L66 50" width={4} />
        <Bone d="M66 50 L56 62 L52 70" color={LIMB} />
        <Bone d="M66 50 L76 62 L80 70" color={LIMB} />
        <Bone d="M66 31 L55 20 L53 12" color={PHASE_2} width={3} />
        <Bone d="M66 31 L77 20 L79 12" color={PHASE_2} width={3} />
        <Head cx="66" cy="20" phase={2} />
        <Tension x="66" y="48" color={PHASE_2} />
        <Note x="100" y="34" text="Melayang" color={PHASE_2} />
        <Arrow x1="95" y1="76" x2="95" y2="30" color={PHASE_2} markerId="arrow-up" />
        <line x1="44" y1="74" x2="38" y2="74" stroke={PHASE_2} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="44" y1="80" x2="35" y2="80" stroke={PHASE_2} strokeWidth="1.6" strokeLinecap="round" />
      </g>
    );
  },

  lunge: (phase, variant) => {
    const mirrored = variant === 'reverse';
    const curtsy = variant === 'curtsy';
    const bulgarian = variant === 'bulgarian';
    const walking = variant === 'walking';

    const body =
      phase === 1 ? (
        <g>
          <Bone d="M68 23 L64 44" width={4} />
          <Bone d="M64 44 L90 52" color={LIMB} />
          <Bone d="M90 52 L92 82" color={MUTED} />
          <Bone d="M92 82 L101 82" color={MUTED} width={3} />
          {curtsy ? (
            <Bone d="M64 44 L82 62 L70 80" color={MUTED} />
          ) : bulgarian ? (
            <Bone d="M64 44 L48 64 L36 54" color={MUTED} />
          ) : (
            <Bone d="M64 44 L46 62 L36 82" color={MUTED} />
          )}
          <Bone d="M68 28 L78 40 L80 52" color={PHASE_1} width={3} />
          <Bone d="M68 28 L58 38 L56 50" color={PHASE_1} width={3} />
          <Head cx="66" cy="16" phase={1} />
          <Tension x="82" y="52" />
          <Tension x="62" y="42" />
          <Note x="18" y="70" text="Lutut dekat lantai" color={PHASE_1} anchor="start" size={6.2} />
        </g>
      ) : (
        <g>
          <Bone d="M66 20 L64 42" width={4} />
          <Bone d="M64 42 L84 58" color={LIMB} />
          <Bone d="M84 58 L90 82" color={MUTED} />
          <Bone d="M90 82 L99 82" color={MUTED} width={3} />
          {curtsy ? (
            <Bone d="M64 42 L80 60 L72 82" color={MUTED} />
          ) : bulgarian ? (
            <Bone d="M64 42 L48 64 L36 54" color={MUTED} />
          ) : (
            <Bone d="M64 42 L46 62 L36 82" color={MUTED} />
          )}
          <Bone d="M66 25 L76 36 L78 48" color={PHASE_2} width={3} />
          <Bone d="M66 25 L56 36 L54 48" color={PHASE_2} width={3} />
          <Head cx="66" cy="13" phase={2} />
          <Tension x="78" y="56" color={PHASE_2} />
          <Arrow x1="112" y1="76" x2="112" y2="46" color={PHASE_2} markerId="arrow-up" />
        </g>
      );

    return (
      <g>
        {bulgarian ? <Chair x={18} y={54} width={22} height={28} /> : null}
        <g transform={mirrored ? 'translate(160 0) scale(-1 1)' : undefined}>{body}</g>
        {walking ? (
          <Arrow x1="52" y1="14" x2="104" y2="14" color={PHASE_2} markerId="arrow-right" dash="3 2" />
        ) : null}
        <Note x="80" y="12" text={mirrored ? 'Langkah mundur' : curtsy ? 'Silang belakang' : bulgarian ? 'Kaki belakang di kursi' : walking ? 'Melangkah' : 'Langkah jauh ke depan'} color={mirrored || curtsy || bulgarian || walking ? PHASE_1 : '#94a3b8'} size={6.2} />
      </g>
    );
  },

  glute_bridge: (phase, variant) => {
    const single = variant === 'single';
    if (phase === 1) {
      return (
        <g>
          <Head cx="34" cy="70" phase={1} />
          <Bone d="M41 73 L76 74" width={4} />
          <Bone d="M43 75 L30 79" color={MUTED} width={3} />
          <Bone d="M76 74 L94 52 L106 78" color={LIMB} />
          <Bone d="M106 78 L112 78" color={MUTED} width={3} />
          {single ? (
            <Bone d="M76 76 L98 74 L112 78" color={MUTED} />
          ) : (
            <Bone d="M76 76 L96 54 L108 80" color={MUTED} />
          )}
          <Tension x="76" y="72" />
          <Note x="80" y="34" text="Bokong menyentuh lantai" color={PHASE_1} />
          <Arrow x1="120" y1="50" x2="120" y2="68" color={PHASE_1} markerId="arrow-down" />
        </g>
      );
    }
    return (
      <g>
        <Head cx="34" cy="70" phase={2} />
        <Bone d="M41 72 L76 58" width={4} />
        <Bone d="M43 74 L30 79" color={MUTED} width={3} />
        <Bone d="M76 58 L94 50 L106 78" color={LIMB} />
        <Bone d="M106 78 L112 78" color={MUTED} width={3} />
        {single ? (
          <Bone d="M76 58 L100 60 L114 64" color={MUTED} />
        ) : (
          <Bone d="M76 60 L96 52 L108 80" color={MUTED} />
        )}
        <Bone d="M34 70 L28 72" color={MUTED} width={3} />
        <Tension x="72" y="64" color={PHASE_2} />
        <Note x="82" y="30" text="Bahu–pinggul–lutut satu garis" color={PHASE_2} size={6.2} />
        <Arrow x1="121" y1="66" x2="121" y2="42" color={PHASE_2} markerId="arrow-up" />
      </g>
    );
  },

  calf_raise: (phase, variant) => {
    if (variant === 'seated') {
      return (
        <g>
          <Chair x={38} y={58} width={26} height={24} />
          <Head cx="66" cy="24" phase={phase} />
          <Bone d="M66 31 L66 52" width={4} />
          <Bone d="M66 52 L92 52" color={LIMB} />
          {phase === 1 ? (
            <>
              <Bone d="M92 52 L92 78 L100 82" color={MUTED} />
              <Dumbbell x={80} y={45} angle={0} />
              <Note x="118" y="44" text="Paha tertekan" color={PHASE_1} anchor="start" size={6.2} />
            </>
          ) : (
            <>
              <Bone d="M92 52 L92 70 L100 82" color={MUTED} />
              <Dumbbell x={80} y={45} angle={0} />
              <Tension x="92" y="64" color={PHASE_2} />
              <Arrow x1="118" y1="70" x2="118" y2="48" color={PHASE_2} markerId="arrow-up" />
            </>
          )}
        </g>
      );
    }

    const single = variant === 'single';
    return (
      <g>
        <Head cx="62" cy="14" phase={phase} />
        <Bone d="M62 21 L62 48" width={4} />
        <Bone d="M62 24 L60 38 L61 50" color={MUTED} width={2.6} />
        {phase === 1 ? (
          <>
            <Bone d="M62 48 L62 64 L62 82" color={MUTED} />
            <Bone d="M62 82 L72 82" color={MUTED} width={3} />
            {single ? (
              <Bone d="M62 48 L74 62 L82 72" color={MUTED} />
            ) : (
              <Bone d="M62 48 L62 64 L62 82" color={MUTED} />
            )}
            <Note x="94" y="56" text="Telapak rata" color={PHASE_1} size={6.2} />
          </>
        ) : (
          <>
            <Bone d="M62 48 L61 70 L70 82" color={MUTED} />
            <Bone d="M70 82 L76 82" color={MUTED} width={3} />
            {single ? (
              <Bone d="M62 48 L76 60 L84 70" color={MUTED} />
            ) : (
              <Bone d="M62 48 L61 70 L70 82" color={MUTED} />
            )}
            <Tension x="62" y="66" color={PHASE_2} />
            <Arrow x1="92" y1="74" x2="92" y2="48" color={PHASE_2} markerId="arrow-up" />
            <Note x="97" y="62" text="Jinjit" color={PHASE_2} anchor="start" />
          </>
        )}
      </g>
    );
  },
  /* ---------------------------- PUSH FAMILY ------------------------------ */
  pushup: (phase, variant) => {
    if (variant === 'incline') {
      return (
        <g>
          <Chair x={96} y={62} width={30} height={20} />
          <Bone d={phase === 1 ? 'M110 56 L64 64 L28 80' : 'M110 50 L64 60 L28 78'} width={4} />
          <Bone d="M28 80 L20 82" color={MUTED} width={3} />
          <Head cx="120" cy={phase === 1 ? 52 : 46} phase={phase} />
          <Bone d={phase === 1 ? 'M110 56 L102 60 L112 62' : 'M110 50 L111 58 L112 62'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
          <Tension x="108" y={phase === 1 ? 60 : 54} color={phase === 1 ? HIGHLIGHT : PHASE_2} />
          <Note x="80" y="34" text="Tangan di meja" color={PHASE_1} />
          <Arrow x1="86" y1="46" x2="86" y2={phase === 1 ? 60 : 38} color={phase === 1 ? PHASE_1 : PHASE_2} markerId={phase === 1 ? 'arrow-down' : 'arrow-up'} />
        </g>
      );
    }

    if (variant === 'decline') {
      return (
        <g>
          <Chair x={16} y={54} width={24} height={28} />
          <Bone d={phase === 1 ? 'M112 68 L64 62 L32 56' : 'M112 58 L64 58 L32 56'} width={4} />
          <Bone d="M32 56 L24 58" color={MUTED} width={3} />
          <Head cx="122" cy={phase === 1 ? 65 : 55} phase={phase} />
          <Bone d={phase === 1 ? 'M112 68 L100 75 L112 82' : 'M112 58 L111 70 L112 82'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
          <Tension x="108" y={phase === 1 ? 68 : 58} color={phase === 1 ? HIGHLIGHT : PHASE_2} />
          <Note x="70" y="38" text="Kaki di kursi" color={PHASE_1} />
          <Arrow x1="88" y1="44" x2="88" y2={phase === 1 ? 62 : 36} color={phase === 1 ? PHASE_1 : PHASE_2} markerId={phase === 1 ? 'arrow-down' : 'arrow-up'} />
        </g>
      );
    }

    const handsWide = variant === 'wide';
    const diamond = variant === 'diamond';
    const spiderman = variant === 'spiderman';
    const board = variant === 'board';

    return (
      <g>
        <Bone d={phase === 1 ? 'M112 66 L70 70 L32 76' : 'M112 58 L70 64 L32 74'} width={4} />
        <Bone d={phase === 1 ? 'M32 76 L26 82' : 'M32 74 L26 82'} color={MUTED} width={3} />
        <Head cx="122" cy={phase === 1 ? 63 : 55} phase={phase} />
        {spiderman ? (
          <>
            <Bone d={phase === 1 ? 'M70 70 L88 68 L80 74' : 'M70 64 L90 64 L82 72'} color={MUTED} />
            <Tension x="90" y={phase === 1 ? 70 : 64} />
            <Note x="126" y="74" text="Lutut ke siku" color={PHASE_1} anchor="start" size={6} />
          </>
        ) : (
          <Bone d={phase === 1 ? 'M70 72 L46 74 L32 78' : 'M70 66 L46 70 L32 76'} color={MUTED} />
        )}
        {handsWide ? (
          <>
            <Bone d={phase === 1 ? 'M112 66 L116 74 L122 82' : 'M112 58 L118 70 L122 82'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
            <Bone d={phase === 1 ? 'M108 68 L100 76 L102 82' : 'M108 60 L102 72 L102 82'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
            <Note x="132" y="40" text="Grip lebar" color={PHASE_1} anchor="end" />
          </>
        ) : diamond ? (
          <>
            <Bone d={phase === 1 ? 'M112 66 L104 74 L108 82' : 'M112 58 L106 70 L108 82'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
            <Bone d={phase === 1 ? 'M112 66 L110 74 L108 82' : 'M112 58 L110 70 L108 82'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
            <polygon points="104,80 108,76 112,80 108,84" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
            <Note x="132" y="40" text="Tangan rapat" color={PHASE_1} anchor="end" />
          </>
        ) : (
          <>
            <Bone d={phase === 1 ? 'M112 66 L98 74 L110 82' : 'M112 58 L110 70 L110 82'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
            <Bone d={phase === 1 ? 'M110 68 L102 76 L104 83' : 'M110 60 L104 72 L104 83'} color={MUTED} width={2.6} />
          </>
        )}
        {board ? (
          <g>
            <line x1="96" y1="82" x2="118" y2="82" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="79" x2="100" y2="82" stroke="#fbbf24" strokeWidth="1.6" />
            <line x1="114" y1="79" x2="114" y2="82" stroke="#fbbf24" strokeWidth="1.6" />
          </g>
        ) : null}
        <Tension x="106" y={phase === 1 ? 68 : 60} color={phase === 1 ? HIGHLIGHT : PHASE_2} />
        <Note x="76" y={phase === 1 ? '28' : '22'} text={phase === 1 ? 'Turun terkontrol' : 'Dorong lurus'} color={phase === 1 ? PHASE_1 : PHASE_2} />
        <Arrow
          x1="86"
          y1={phase === 1 ? 34 : 34}
          x2="86"
          y2={phase === 1 ? 52 : 24}
          color={phase === 1 ? PHASE_1 : PHASE_2}
          markerId={phase === 1 ? 'arrow-down' : 'arrow-up'}
        />
      </g>
    );
  },

  floor_press: (phase, variant) => {
    const incline = variant === 'incline';
    return (
      <g>
        {incline ? <ellipse cx="52" cy="74" rx="17" ry="6" fill="#1e293b" stroke={MUTED} strokeWidth="1" /> : null}
        <Head cx="36" cy={incline ? 62 : 68} phase={phase} />
        <Bone d={incline ? 'M43 68 L78 74' : 'M43 71 L76 73'} width={4} />
        <Bone d="M76 73 L94 54 L106 78" color={LIMB} />
        <Bone d="M106 78 L112 80" color={MUTED} width={3} />
        <Bone d="M76 75 L96 56 L108 80" color={MUTED} />
        <Bone d={phase === 1 ? 'M50 71 L58 64 L62 56' : 'M50 71 L54 60 L56 46'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
        <Bone d={phase === 1 ? 'M58 73 L64 66 L66 58' : 'M58 73 L60 62 L62 48'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
        <Dumbbell x={phase === 1 ? 63 : 57} y={phase === 1 ? 54 : 44} angle={0} />
        <Dumbbell x={phase === 1 ? 67 : 63} y={phase === 1 ? 56 : 46} angle={0} />
        <Tension x="56" y={phase === 1 ? 66 : 54} color={phase === 1 ? HIGHLIGHT : PHASE_2} />
        <Note x="94" y={incline ? 40 : 46} text={phase === 1 ? 'Siku 45°' : 'Dorong dada'} color={phase === 1 ? PHASE_1 : PHASE_2} size={6.4} />
      </g>
    );
  },

  pike: (phase) => {
    if (phase === 1) {
      return (
        <g>
          <Bone d="M78 28 L60 54 L48 82" width={4} />
          <Bone d="M48 82 L42 82" color={MUTED} width={3} />
          <Bone d="M78 28 L108 54" width={4} />
          <Bone d="M108 54 L98 82" color={PHASE_1} width={3} />
          <Bone d="M108 54 L118 82" color={PHASE_1} width={3} />
          <Head cx="112" cy="63" phase={1} />
          <Tension x="108" y="54" />
          <Note x="128" y="40" text="Kepala turun" color={PHASE_1} anchor="end" size={6.2} />
          <Arrow x1="126" y1="34" x2="126" y2="58" color={PHASE_1} markerId="arrow-down" />
          <Note x="80" y="22" text="Pinggul tinggi" color={PHASE_1} />
        </g>
      );
    }
    return (
      <g>
        <Bone d="M80 24 L60 52 L50 82" width={4} />
        <Bone d="M50 82 L44 82" color={MUTED} width={3} />
        <Bone d="M80 24 L108 48" width={4} />
        <Bone d="M108 48 L100 82" color={PHASE_2} width={3} />
        <Bone d="M108 48 L118 82" color={PHASE_2} width={3} />
        <Head cx="113" cy="54" phase={2} />
        <Tension x="106" y="48" color={PHASE_2} />
        <Note x="128" y="40" text="Dorong V" color={PHASE_2} anchor="end" size={6.2} />
        <Arrow x1="126" y1="66" x2="126" y2="40" color={PHASE_2} markerId="arrow-up" />
      </g>
    );
  },

  pullup: (phase, variant) => {
    const chin = variant === 'chinup';
    const leftHand = chin ? 72 : 66;
    const rightHand = chin ? 88 : 94;
    return (
      <g>
        <line x1="28" y1="14" x2="132" y2="14" stroke={MUTED} strokeWidth="3.4" strokeLinecap="round" />
        {phase === 1 ? (
          <>
            <Bone d={`M${leftHand} 14 L${leftHand + 4} 28 L78 36`} color={PHASE_1} width={3} />
            <Bone d={`M${rightHand} 14 L${rightHand - 4} 28 L82 36`} color={PHASE_1} width={3} />
            <Bone d="M80 36 L80 66" width={4} />
            <Bone d="M80 66 L76 82" color={MUTED} width={3} />
            <Bone d="M80 66 L84 82" color={MUTED} width={3} />
            <Head cx="80" cy="31" phase={1} />
            <Note x="112" y="42" text="Menggantung" color={PHASE_1} anchor="start" size={6.2} />
            <Arrow x1="112" y1="28" x2="112" y2="52" color={PHASE_1} markerId="arrow-down" />
          </>
        ) : (
          <>
            <Bone d={`M${leftHand} 14 L${leftHand - 6} 30 L80 28`} color={PHASE_2} width={3} />
            <Bone d={`M${rightHand} 14 L${rightHand + 6} 30 L80 28`} color={PHASE_2} width={3} />
            <Bone d="M80 28 L80 58" width={4} />
            <Bone d="M80 58 L76 72" color={MUTED} width={3} />
            <Bone d="M80 58 L84 72" color={MUTED} width={3} />
            <Head cx="80" cy="20" phase={2} />
            <Tension x="76" y="36" color={PHASE_2} />
            <Note x="112" y="42" text="Dada ke palang" color={PHASE_2} anchor="start" size={6.2} />
            <Arrow x1="112" y1="58" x2="112" y2="32" color={PHASE_2} markerId="arrow-up" />
          </>
        )}
        {chin ? <Note x="80" y="8" text="Grip chin-up" color="#94a3b8" size={6} /> : null}
      </g>
    );
  },

  /* ----------------------------- ROW FAMILY ------------------------------ */
  inverted_row: (phase) => {
    const shoulderY = phase === 1 ? 50 : 45;
    const hipY = phase === 1 ? 60 : 54;
    const kneeY = phase === 1 ? 68 : 62;
    const elbowY = phase === 1 ? 50 : 46;
    return (
      <g>
        <line x1="42" y1="44" x2="118" y2="44" stroke={MUTED} strokeWidth="3.4" strokeLinecap="round" />
        <Bone d={`M80 ${shoulderY} L50 ${hipY} L38 ${kneeY} L30 82`} color={phase === 1 ? BONE : LIMB} width={4} />
        <Bone d={`M80 ${shoulderY} L88 ${elbowY} L92 44`} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
        <Bone d={`M80 ${shoulderY} L72 ${elbowY} L68 44`} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
        <Head cx="94" cy={phase === 1 ? 51 : 46} phase={phase} />
        <Tension x="80" y={shoulderY} color={phase === 1 ? HIGHLIGHT : PHASE_2} />
        <Note x="116" y="64" text="Tumit di lantai" color="#94a3b8" anchor="start" size={6} />
        <Arrow x1="106" y1={phase === 1 ? 66 : 58} x2="106" y2={phase === 1 ? 48 : 44} color={phase === 1 ? PHASE_1 : PHASE_2} markerId={phase === 1 ? 'arrow-down' : 'arrow-up'} />
        <Note x="110" y="36" text={phase === 1 ? 'Regang' : 'Tarik'} color={phase === 1 ? PHASE_1 : PHASE_2} anchor="start" size={6.2} />
      </g>
    );
  },

  bent_over_row: (phase) => (
    <g>
      <Bone d="M74 34 L52 52" width={4} />
      <Bone d="M52 52 L56 66 L58 82" color={MUTED} />
      <Bone d="M52 52 L46 66 L44 82" color={MUTED} />
      <Head cx="79" cy="29" phase={phase} />
      {phase === 1 ? (
        <Bone d="M74 36 L76 54 L78 70" color={PHASE_1} width={3} />
      ) : (
        <Bone d="M74 36 L62 46 L76 42" color={PHASE_2} width={3} />
      )}
      <Dumbbell x={phase === 1 ? 78 : 76} y={phase === 1 ? 72 : 42} angle={90} />
      <Tension x="64" y="42" color={phase === 1 ? HIGHLIGHT : PHASE_2} />
      <Note x="94" y="30" text="Punggung rata" color={PHASE_1} anchor="start" size={6.2} />
      <Arrow x1="96" y1="64" x2="96" y2="42" color={PHASE_2} markerId="arrow-up" />
    </g>
  ),

  seated_row: (phase) => (
    <g>
      <Chair x={38} y={64} width={30} height={18} />
      <Bone d="M68 40 L72 62" width={4} />
      <Bone d="M72 62 L94 60 L102 80" color={MUTED} />
      <Bone d="M68 40 L76 44" color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
      <Bone d="M68 40 L70 48" color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
      <Head cx="66" cy="32" phase={phase} />
      {phase === 1 ? (
        <>
          <Bone d="M76 44 L92 46 L108 48" color={PHASE_1} width={3} />
          <line x1="108" y1="48" x2="142" y2="48" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
          <Note x="110" y="38" text="Lengan lurus" color={PHASE_1} anchor="start" size={6} />
        </>
      ) : (
        <>
          <Bone d="M76 44 L56 48 L76 50" color={PHASE_2} width={3} />
          <line x1="76" y1="50" x2="142" y2="50" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
          <Tension x="68" y="44" color={PHASE_2} />
          <Note x="92" y="38" text="Siku ke belakang" color={PHASE_2} anchor="start" size={6} />
        </>
      )}
    </g>
  ),

  doorframe_row: (phase) => (
    <g>
      <Frame x={34} />
      <Bone d="M76 54 L62 42" width={4} />
      <Head cx="58" cy="32" phase={phase} />
      <Bone d="M76 54 L74 68 L92 82" color={MUTED} />
      <Bone d="M76 54 L64 66 L50 82" color={MUTED} />
      {phase === 1 ? (
        <Bone d="M62 42 L48 44 L38 46" color={PHASE_1} width={3} />
      ) : (
        <Bone d="M66 44 L52 46 L38 46" color={PHASE_2} width={3} />
      )}
      <Tension x="60" y="44" color={phase === 1 ? HIGHLIGHT : PHASE_2} />
      <Note x="96" y="40" text={phase === 1 ? 'Mundur, lengan lurus' : 'Tarik dada ke kusen'} color={phase === 1 ? PHASE_1 : PHASE_2} anchor="start" size={6} />
      <Arrow x1="104" y1={phase === 1 ? 58 : 62} x2="104" y2={phase === 1 ? 46 : 48} color={phase === 1 ? PHASE_1 : PHASE_2} markerId={phase === 1 ? 'arrow-left' : 'arrow-right'} />
    </g>
  ),

  face_pull: (phase) => (
    <g>
      <Bone d="M80 32 L80 52" width={4} />
      <Bone d="M80 52 L70 66 L68 82" color={MUTED} />
      <Bone d="M80 52 L90 66 L92 82" color={MUTED} />
      <Bone d="M80 34 L68 50" width={2.6} />
      <Head cx="80" cy="23" phase={phase} />
      {phase === 1 ? (
        <Bone d="M80 32 L96 30 L110 28" color={PHASE_1} width={3} />
      ) : (
        <Bone d="M80 32 L100 28 L86 24" color={PHASE_2} width={3} />
      )}
      <line x1={phase === 1 ? 110 : 86} y1={phase === 1 ? 28 : 24} x2="144" y2="20" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
      <Tension x="98" y="28" color={phase === 1 ? HIGHLIGHT : PHASE_2} />
      <Note x="128" y="36" text="Siku tinggi" color={PHASE_2} anchor="end" size={6} />
    </g>
  ),

  lat_pulldown: (phase) => (
    <g>
      <line x1="44" y1="16" x2="116" y2="16" stroke={MUTED} strokeWidth="3.2" strokeLinecap="round" />
      <Bone d="M76 58 L76 32" width={4} />
      <Bone d="M76 58 L62 72 L52 82" color={MUTED} />
      <Bone d="M76 58 L90 72 L100 82" color={MUTED} />
      <Head cx="76" cy="24" phase={phase} />
      {phase === 1 ? (
        <>
          <Bone d="M76 32 L66 16" color={PHASE_1} width={3} />
          <Bone d="M76 32 L86 16" color={PHASE_1} width={3} />
          <Note x="108" y="30" text="Regang lats" color={PHASE_1} anchor="start" size={6} />
          <Arrow x1="108" y1="36" x2="108" y2="52" color={PHASE_1} markerId="arrow-down" />
        </>
      ) : (
        <>
          <Bone d="M76 32 L62 38 L72 36" color={PHASE_2} width={3} />
          <Bone d="M76 32 L90 38 L80 36" color={PHASE_2} width={3} />
          <Tension x="76" y="38" color={PHASE_2} />
          <Note x="108" y="30" text="Tarik ke dada" color={PHASE_2} anchor="start" size={6} />
          <Arrow x1="108" y1="54" x2="108" y2="34" color={PHASE_2} markerId="arrow-up" />
        </>
      )}
    </g>
  ),

  pull_through: (phase) => (
    <g>
      <Bone d={phase === 1 ? 'M76 34 L54 52' : 'M76 28 L60 50'} width={4} />
      <Bone d={phase === 1 ? 'M54 52 L58 66 L60 82' : 'M60 50 L62 66 L64 82'} color={MUTED} />
      <Bone d={phase === 1 ? 'M54 52 L48 66 L46 82' : 'M60 50 L54 66 L52 82'} color={MUTED} />
      <Head cx={phase === 1 ? 81 : 81} cy={phase === 1 ? 29 : 23} phase={phase} />
      <Bone d={phase === 1 ? 'M76 36 L74 54 L70 60' : 'M76 30 L74 44 L72 54'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
      <line x1={phase === 1 ? 70 : 72} y1={phase === 1 ? 60 : 54} x2="144" y2="70" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
      <Tension x="74" y="44" color={phase === 1 ? HIGHLIGHT : PHASE_2} />
      <Note x="100" y="28" text={phase === 1 ? 'Hinge, punggung netral' : 'Dorong pinggul'} color={phase === 1 ? PHASE_1 : PHASE_2} anchor="start" size={6} />
    </g>
  ),

  band_fly: (phase) => (
    <g>
      <Head cx="80" cy="18" phase={phase} />
      <Bone d="M80 25 L80 48" width={4} />
      <Bone d="M80 48 L66 66 L62 82" color={MUTED} />
      <Bone d="M80 48 L94 66 L98 82" color={MUTED} />
      {phase === 1 ? (
        <>
          <Bone d="M72 31 L54 36" color={PHASE_1} width={3} />
          <Bone d="M88 31 L106 36" color={PHASE_1} width={3} />
          <line x1="54" y1="36" x2="106" y2="36" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
          <Note x="80" y="12" text="Regang dada" color={PHASE_1} size={6.2} />
        </>
      ) : (
        <>
          <Bone d="M72 31 L68 40 L74 38" color={PHASE_2} width={3} />
          <Bone d="M88 31 L92 40 L86 38" color={PHASE_2} width={3} />
          <line x1="74" y1="38" x2="86" y2="38" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
          <Tension x="80" y="36" color={PHASE_2} />
          <Note x="80" y="12" text="Remas dada" color={PHASE_2} size={6.2} />
        </>
      )}
    </g>
  ),

  /* ----------------------------- CORE FAMILY ----------------------------- */
  plank: (phase) => (
    <g>
      <Bone d="M110 62 L70 68 L34 76" width={4} />
      <Bone d="M34 76 L28 82" color={MUTED} width={3} />
      <Bone d="M110 62 L108 78 L122 82" color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
      <Bone d="M108 64 L100 78 L114 82" color={MUTED} width={2.6} />
      <Head cx="120" cy="57" phase={phase} />
      {phase === 2 ? (
        <>
          <Tension x="84" y="70" color={PHASE_2} />
          <Note x="80" y="34" text="Garis lurus, core terkunci" color={PHASE_2} size={6.2} />
        </>
      ) : (
        <>
          <Note x="80" y="34" text="Siku di bawah bahu" color={PHASE_1} size={6.2} />
          <Arrow x1="80" y1="44" x2="80" y2="60" color={PHASE_1} markerId="arrow-down" dash="3 2" />
        </>
      )}
    </g>
  ),

  mountain_climber: (phase) => (
    <g>
      <Bone d="M110 60 L70 64" width={4} />
      <Bone d="M110 60 L108 78 L120 82" color={PHASE_1} width={3} />
      <Head cx="120" cy="55" phase={phase} />
      {phase === 1 ? (
        <>
          <Bone d="M70 64 L46 70 L32 80" color={MUTED} />
          <Bone d="M70 64 L48 68 L34 78" color={MUTED} width={2.6} />
          <Note x="84" y="36" text="Posisi plank" color={PHASE_1} />
          <Arrow x1="86" y1="44" x2="86" y2="60" color={PHASE_1} markerId="arrow-down" dash="3 2" />
        </>
      ) : (
        <>
          <Bone d="M70 64 L88 70 L78 78" color={PHASE_2} />
          <Bone d="M70 64 L48 70 L34 80" color={MUTED} />
          <Tension x="80" y="68" color={PHASE_2} />
          <Note x="98" y="40" text="Lutut ke dada" color={PHASE_2} />
          <Arrow x1="100" y1="50" x2="88" y2="64" color={PHASE_2} markerId="arrow-left" />
        </>
      )}
    </g>
  ),

  bear_crawl: (phase) => (
    <g>
      <Bone d="M108 56 L76 58" width={4} />
      <Bone d="M108 56 L114 68 L116 82" color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
      <Bone d="M108 56 L124 70 L128 82" color={MUTED} width={2.6} />
      <Head cx="116" cy="50" phase={phase} />
      {phase === 1 ? (
        <>
          <Bone d="M76 58 L66 68 L58 78" color={MUTED} />
          <Bone d="M76 58 L80 70 L74 80" color={MUTED} width={2.6} />
          <Note x="78" y="34" text="Lutut melayang" color={PHASE_1} size={6.2} />
          <line x1="60" y1="76" x2="52" y2="76" stroke={PHASE_1} strokeWidth="1.4" strokeDasharray="2 2" />
        </>
      ) : (
        <>
          <Bone d="M76 58 L62 66 L52 78" color={PHASE_2} />
          <Bone d="M76 58 L84 70 L78 80" color={MUTED} width={2.6} />
          <Tension x="82" y="64" color={PHASE_2} />
          <Arrow x1="42" y1="40" x2="76" y2="40" color={PHASE_2} markerId="arrow-right" />
          <Note x="58" y="34" text="Merangkak maju" color={PHASE_2} size={6.2} />
        </>
      )}
    </g>
  ),

  crab_walk: (phase) => (
    <g>
      <Bone d="M108 64 L70 60" width={4} />
      <Bone d="M108 64 L120 74 L124 82" color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
      <Head cx="116" cy="60" phase={phase} />
      <Bone d="M70 60 L54 50 L40 78" color={MUTED} />
      <Bone d="M70 60 L58 48 L46 76" color={MUTED} width={2.6} />
      {phase === 2 ? (
        <>
          <Bone d="M70 60 L52 52 L32 74" color={PHASE_2} />
          <Tension x="76" y="60" color={PHASE_2} />
          <Note x="76" y="30" text="Pinggul terangkat" color={PHASE_2} size={6.2} />
          <Arrow x1="34" y1="40" x2="66" y2="40" color={PHASE_2} markerId="arrow-right" />
        </>
      ) : (
        <Note x="76" y="30" text="Telapak & kaki menapak" color={PHASE_1} size={6.2} />
      )}
    </g>
  ),

  situp: (phase) => (
    <g>
      {phase === 1 ? (
        <>
          <Head cx="32" cy="69" phase={1} />
          <Bone d="M40 74 L78 74" width={4} />
          <Bone d="M78 74 L94 54 L106 78" color={LIMB} />
          <Bone d="M40 72 L52 66 L62 60" color={MUTED} width={2.8} />
          <Note x="74" y="42" text="Berbaring, lutut tekuk" color={PHASE_1} size={6.2} />
          <Arrow x1="56" y1="50" x2="42" y2="64" color={PHASE_1} markerId="arrow-left" />
        </>
      ) : (
        <>
          <Head cx="54" cy="45" phase={2} />
          <Bone d="M60 52 L78 72" width={4} />
          <Bone d="M78 72 L94 54 L106 78" color={LIMB} />
          <Bone d="M60 54 L74 52 L86 56" color={PHASE_2} width={3} />
          <Tension x="70" y="62" color={PHASE_2} />
          <Note x="104" y="38" text="Angkat torso" color={PHASE_2} anchor="end" size={6.2} />
          <Arrow x1="92" y1="66" x2="70" y2="48" color={PHASE_2} markerId="arrow-up" />
        </>
      )}
    </g>
  ),

  bicycle_crunch: (phase) => (
    <g>
      <Head cx="52" cy="46" phase={phase} />
      <Bone d="M58 52 L78 72" width={4} />
      <Bone d="M78 72 L96 54 L108 76" color={LIMB} />
      {phase === 1 ? (
        <>
          <Bone d="M78 72 L96 58 L86 48" color={PHASE_1} />
          <Bone d="M58 54 L78 52 L88 56" color={PHASE_1} width={3} />
          <Tension x="82" y="58" />
          <Note x="110" y="42" text="Siku ke lutut" color={PHASE_1} anchor="end" size={6} />
        </>
      ) : (
        <>
          <Bone d="M78 72 L62 54 L72 46" color={PHASE_2} />
          <Bone d="M58 54 L42 62 L36 72" color={PHASE_2} width={3} />
          <Tension x="72" y="58" color={PHASE_2} />
          <Note x="44" y="36" text="Bergantian" color={PHASE_2} size={6} />
        </>
      )}
    </g>
  ),

  russian_twist: (phase) => (
    <g>
      <Head cx="58" cy="38" phase={phase} />
      <Bone d="M62 46 L68 70" width={4} />
      <Bone d="M68 70 L88 56 L96 72" color={LIMB} />
      <Bone d="M68 70 L64 82" color={MUTED} width={3} />
      {phase === 1 ? (
        <>
          <Bone d="M64 52 L76 54 L88 56" color={PHASE_1} width={3} />
          <circle cx="82" cy="55" r="3.4" fill="#fbbf24" />
          <Note x="112" y="44" text="Putar ke kanan" color={PHASE_1} anchor="end" size={6} />
        </>
      ) : (
        <>
          <Bone d="M64 52 L78 54 L84 44" color={PHASE_2} width={3} />
          <circle cx="86" cy="43" r="3.4" fill="#fbbf24" />
          <Tension x="72" y="52" color={PHASE_2} />
          <Note x="126" y="32" text="Putar ke kiri" color={PHASE_2} anchor="end" size={6} />
          <Arrow x1="110" y1="52" x2="92" y2="42" color={PHASE_2} markerId="arrow-up" />
        </>
      )}
    </g>
  ),

  leg_raise: (phase) => (
    <g>
      <Head cx="32" cy="70" phase={phase} />
      <Bone d="M40 74 L78 74" width={4} />
      <Bone d="M42 76 L28 80" color={MUTED} width={3} />
      {phase === 1 ? (
        <>
          <Bone d="M78 74 L96 60 L112 54" color={PHASE_1} />
          <Note x="96" y="40" text="Turun 45°" color={PHASE_1} size={6} />
          <Arrow x1="112" y1="46" x2="118" y2="58" color={PHASE_1} markerId="arrow-down" />
        </>
      ) : (
        <>
          <Bone d="M78 74 L80 54 L82 34" color={PHASE_2} />
          <Tension x="72" y="70" color={PHASE_2} />
          <Note x="94" y="34" text="Tungkai 90°" color={PHASE_2} size={6} />
          <Arrow x1="62" y1="64" x2="76" y2="52" color={PHASE_2} markerId="arrow-up" />
        </>
      )}
    </g>
  ),

  hanging_knee_raise: (phase) => (
    <g>
      <line x1="30" y1="14" x2="130" y2="14" stroke={MUTED} strokeWidth="3.2" strokeLinecap="round" />
      <Bone d="M66 14 L72 30 L78 36" color={BONE} width={3} />
      <Bone d="M94 14 L88 30 L82 36" color={BONE} width={3} />
      <Bone d="M80 36 L80 62" width={4} />
      <Head cx="80" cy="30" phase={phase} />
      {phase === 1 ? (
        <>
          <Bone d="M80 62 L76 78" color={MUTED} width={3} />
          <Bone d="M80 62 L84 78" color={MUTED} width={3} />
          <Note x="106" y="48" text="Menggantung" color={PHASE_1} anchor="start" size={6} />
        </>
      ) : (
        <>
          <Bone d="M80 62 L94 56 L88 68" color={PHASE_2} />
          <Bone d="M80 62 L96 62 L90 72" color={MUTED} width={2.6} />
          <Tension x="82" y="56" color={PHASE_2} />
          <Note x="108" y="48" text="Lutut ke perut" color={PHASE_2} anchor="start" size={6} />
          <Arrow x1="112" y1="66" x2="112" y2="48" color={PHASE_2} markerId="arrow-up" />
        </>
      )}
    </g>
  ),

  prone_raise: (phase, variant) => {
    if (variant === 'cobra') {
      return (
        <g>
          <Head cx="34" cy={phase === 1 ? 67 : 56} phase={phase} />
          <Bone d={phase === 1 ? 'M42 72 L78 74' : 'M42 64 L78 74'} width={4} />
          <Bone d="M78 74 L102 76" color={MUTED} />
          {phase === 1 ? (
            <Bone d="M50 74 L56 70 L52 66" color={PHASE_1} width={2.8} />
          ) : (
            <Bone d="M46 66 L54 70 L54 78" color={PHASE_2} width={3} />
          )}
          <Tension x="54" y={phase === 1 ? 70 : 64} color={phase === 1 ? HIGHLIGHT : PHASE_2} />
          <Note x="92" y="40" text={phase === 1 ? 'Tengkurap' : 'Dada terangkat'} color={phase === 1 ? PHASE_1 : PHASE_2} anchor="end" size={6.2} />
        </g>
      );
    }

    const ytw = variant === 'ytw';
    return (
      <g>
        <Head cx="34" cy={phase === 1 ? 68 : 60} phase={phase} />
        <Bone d={phase === 1 ? 'M42 72 L78 74' : 'M42 66 L78 68'} width={4} />
        <Bone d={phase === 1 ? 'M42 70 L22 64' : 'M42 64 L20 54'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
        <Bone d={phase === 1 ? 'M78 74 L102 76' : 'M78 68 L102 66'} color={MUTED} />
        <Bone d={phase === 1 ? 'M78 72 L96 72' : 'M78 66 L98 60'} color={MUTED} width={2.6} />
        <Tension x="64" y={phase === 1 ? 72 : 66} color={phase === 1 ? HIGHLIGHT : PHASE_2} />
        <Note x="104" y="46" text={ytw ? (phase === 1 ? 'Bentuk Y' : 'Bentuk T / W') : phase === 1 ? 'Tengkurap rata' : 'Angkat dada & kaki'} color={phase === 1 ? PHASE_1 : PHASE_2} anchor="end" size={6.2} />
        {phase === 2 ? <Arrow x1="110" y1="62" x2="110" y2="46" color={PHASE_2} markerId="arrow-up" /> : null}
      </g>
    );
  },

  side_plank: (phase) => (
    <g>
      <Bone d={phase === 1 ? 'M82 58 L52 68 L26 76' : 'M82 56 L52 58 L26 70'} width={4} />
      <Bone d="M82 58 L84 78 L96 82" color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
      <Bone d="M82 58 L82 42" color={phase === 1 ? PHASE_1 : PHASE_2} width={2.8} />
      <Head cx="89" cy={phase === 1 ? 52 : 50} phase={phase} />
      {phase === 2 ? (
        <>
          <Tension x="58" y="60" color={PHASE_2} />
          <Note x="76" y="32" text="Pinggul terangkat, garis lurus" color={PHASE_2} size={6.2} />
          <Arrow x1="106" y1="68" x2="106" y2="44" color={PHASE_2} markerId="arrow-up" />
        </>
      ) : (
        <Note x="76" y="32" text="Tumpu lengan bawah" color={PHASE_1} size={6.2} />
      )}
    </g>
  ),

  /* ---------------------------- CARDIO FAMILY ---------------------------- */
  skipping: (phase, variant) => {
    const double = variant === 'double';
    return (
      <g>
        <Head cx="70" cy="22" phase={phase} />
        <Bone d="M70 29 L70 52" width={4} />
        <Bone d="M70 32 L54 42 L50 52" color={MUTED} width={2.8} />
        <Bone d="M70 32 L86 42 L90 52" color={MUTED} width={2.8} />
        {phase === 1 ? (
          <>
            <Bone d="M70 52 L64 66 L60 82" color={MUTED} />
            <Bone d="M70 52 L76 66 L80 82" color={MUTED} />
            <path d="M50 52 Q70 92 90 52" fill="none" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
            <Note x="112" y="44" text="Siap lompat" color={PHASE_1} anchor="start" size={6.2} />
          </>
        ) : (
          <>
            <Bone d="M70 52 L62 62 L58 70" color={PHASE_2} />
            <Bone d="M70 52 L78 62 L82 70" color={PHASE_2} />
            <path d="M50 52 Q70 84 90 52" fill="none" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
            {double ? (
              <path d="M50 52 Q58 92 70 78 Q82 64 90 52" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2 2" />
            ) : null}
            <Note x="108" y="40" text={double ? 'Double-under' : 'Melayang'} color={PHASE_2} anchor="start" size={6.2} />
            <Arrow x1="104" y1="72" x2="104" y2="46" color={PHASE_2} markerId="arrow-up" />
          </>
        )}
      </g>
    );
  },

  burpee: (phase) => (
    <g>
      {phase === 1 ? (
        <>
          <Head cx="100" cy="54" phase={1} />
          <Bone d="M94 60 L72 60" width={4} />
          <Bone d="M94 60 L98 70 L100 82" color={PHASE_1} width={3} />
          <Bone d="M72 60 L58 66 L52 82" color={MUTED} />
          <Bone d="M72 62 L64 70 L58 80" color={MUTED} width={2.6} />
          <Note x="82" y="34" text="Tangan ke lantai" color={PHASE_1} size={6.2} />
          <Arrow x1="82" y1="44" x2="82" y2="60" color={PHASE_1} markerId="arrow-down" />
        </>
      ) : (
        <>
          <Head cx="76" cy="18" phase={2} />
          <Bone d="M76 25 L76 48" width={4} />
          <Bone d="M76 28 L60 18 L58 10" color={PHASE_2} width={3} />
          <Bone d="M76 28 L92 18 L94 10" color={PHASE_2} width={3} />
          <Bone d="M76 48 L66 60 L62 68" color={PHASE_2} width={3} />
          <Bone d="M76 48 L86 60 L90 68" color={PHASE_2} width={3} />
          <Note x="110" y="34" text="Lompat eksplosif" color={PHASE_2} anchor="start" size={6} />
          <Arrow x1="106" y1="72" x2="106" y2="38" color={PHASE_2} markerId="arrow-up" />
        </>
      )}
    </g>
  ),

  skater: (phase) => (
    <g>
      <Head cx={phase === 1 ? 76 : 84} cy="30" phase={phase} />
      <Bone d={phase === 1 ? 'M80 38 L86 58' : 'M84 38 L78 58'} width={4} />
      {phase === 1 ? (
        <>
          <Bone d="M86 58 L96 68 L102 82" color={PHASE_1} />
          <Bone d="M86 58 L62 66 L46 62" color={MUTED} />
          <Bone d="M80 42 L62 38 L52 44" color={MUTED} width={2.6} />
          <Bone d="M80 42 L98 36 L108 40" color={MUTED} width={2.6} />
          <Arrow x1="118" y1="62" x2="94" y2="62" color={PHASE_1} markerId="arrow-left" />
          <Note x="112" y="48" text="Mendarat" color={PHASE_1} anchor="end" size={6} />
        </>
      ) : (
        <>
          <Bone d="M78 58 L58 68 L42 66" color={PHASE_2} />
          <Bone d="M78 58 L94 66 L108 70" color={MUTED} />
          <Bone d="M84 42 L102 36 L112 42" color={MUTED} width={2.6} />
          <Bone d="M84 42 L66 38 L56 44" color={MUTED} width={2.6} />
          <Arrow x1="42" y1="62" x2="66" y2="62" color={PHASE_2} markerId="arrow-right" />
          <Note x="62" y="48" text="Lompat samping" color={PHASE_2} size={6} />
        </>
      )}
    </g>
  ),

  jumping_jack: (phase) => (
    <g>
      <Head cx="80" cy="18" phase={phase} />
      <Bone d={phase === 1 ? 'M80 26 L80 48' : 'M80 24 L80 46'} width={4} />
      {phase === 1 ? (
        <>
          <Bone d="M80 48 L68 62 L64 78" color={MUTED} />
          <Bone d="M80 48 L92 62 L96 78" color={MUTED} />
          <Bone d="M72 31 L62 42 L60 52" color={PHASE_1} width={3} />
          <Bone d="M88 31 L98 42 L100 52" color={PHASE_1} width={3} />
          <Note x="112" y="64" text="Setengah squat" color={PHASE_1} anchor="start" size={6} />
        </>
      ) : (
        <>
          <Bone d="M80 46 L62 58 L52 74" color={PHASE_2} />
          <Bone d="M80 46 L98 58 L108 74" color={PHASE_2} />
          <Bone d="M72 29 L62 18 L60 10" color={PHASE_2} width={3} />
          <Bone d="M88 29 L98 18 L100 10" color={PHASE_2} width={3} />
          <Note x="112" y="64" text="Buka & lompat" color={PHASE_2} anchor="start" size={6} />
          <Arrow x1="132" y1="72" x2="132" y2="54" color={PHASE_2} markerId="arrow-up" />
        </>
      )}
    </g>
  ),

  high_knees: (phase) => (
    <g>
      <Head cx="80" cy="18" phase={phase} />
      <Bone d="M80 25 L80 48" width={4} />
      {phase === 1 ? (
        <>
          <Bone d="M80 48 L64 54 L60 66" color={PHASE_1} />
          <Bone d="M80 48 L94 64 L96 80" color={MUTED} />
          <Bone d="M72 30 L58 40 L62 52" color={MUTED} width={2.6} />
          <Bone d="M88 30 L102 40 L98 52" color={MUTED} width={2.6} />
          <Note x="112" y="40" text="Lutut tinggi" color={PHASE_1} anchor="start" size={6} />
        </>
      ) : (
        <>
          <Bone d="M80 48 L96 54 L100 66" color={PHASE_2} />
          <Bone d="M80 48 L66 64 L64 80" color={MUTED} />
          <Bone d="M72 30 L58 40 L62 52" color={MUTED} width={2.6} />
          <Bone d="M88 30 L102 40 L98 52" color={MUTED} width={2.6} />
          <Arrow x1="112" y1="68" x2="112" y2="50" color={PHASE_2} markerId="arrow-up" />
        </>
      )}
    </g>
  ),

  /* ----------------------------- ARM FAMILY ------------------------------ */
  lateral_raise: (phase) => (
    <g>
      <Head cx="80" cy="18" phase={phase} />
      <Bone d="M80 25 L80 48" width={4} />
      <Bone d="M80 48 L66 66 L62 82" color={MUTED} />
      <Bone d="M80 48 L94 66 L98 82" color={MUTED} />
      {phase === 1 ? (
        <>
          <Bone d="M72 30 L60 40 L54 52" color={PHASE_1} width={3} />
          <Bone d="M88 30 L100 40 L106 52" color={PHASE_1} width={3} />
          <Dumbbell x={52} y={54} angle={90} />
          <Dumbbell x={108} y={54} angle={90} />
          <Note x="80" y="12" text="Lengan di samping" color={PHASE_1} size={6} />
        </>
      ) : (
        <>
          <Bone d="M72 30 L56 32 L44 32" color={PHASE_2} width={3} />
          <Bone d="M88 30 L104 32 L116 32" color={PHASE_2} width={3} />
          <Dumbbell x={42} y={32} angle={90} />
          <Dumbbell x={118} y={32} angle={90} />
          <Tension x="60" y="30" color={PHASE_2} />
          <Note x="80" y="12" text="Setinggi bahu" color={PHASE_2} size={6} />
        </>
      )}
    </g>
  ),

  reverse_fly: (phase) => (
    <g>
      <Bone d="M64 40 L84 52" width={4} />
      <Bone d="M84 52 L88 66 L90 82" color={MUTED} />
      <Bone d="M84 52 L80 66 L78 82" color={MUTED} />
      <Head cx="58" cy="34" phase={phase} />
      <Bone d="M64 42 L62 54" color={MUTED} width={2.6} />
      {phase === 1 ? (
        <>
          <Bone d="M64 42 L60 56 L58 64" color={PHASE_1} width={3} />
          <Dumbbell x={58} y={66} angle={0} />
          <Note x="100" y="34" text="Hinge, punggung rata" color={PHASE_1} anchor="start" size={6} />
        </>
      ) : (
        <>
          <Bone d="M64 42 L44 38" color={PHASE_2} width={3} />
          <Bone d="M64 42 L82 34" color={PHASE_2} width={3} />
          <Dumbbell x={42} y={38} angle={0} />
          <Dumbbell x={84} y={34} angle={0} />
          <Tension x="74" y="38" color={PHASE_2} />
          <Note x="100" y="34" text="Buka lengan ke samping" color={PHASE_2} anchor="start" size={6} />
        </>
      )}
    </g>
  ),

  curl: (phase, variant) => {
    if (variant === 'isometric') {
      return (
        <g>
          <Frame x={96} />
          <Head cx="66" cy="20" phase={phase} />
          <Bone d="M66 27 L66 50" width={4} />
          <Bone d="M66 50 L62 66 L60 82" color={MUTED} />
          <Bone d="M66 50 L70 66 L72 82" color={MUTED} />
          <Bone d={phase === 1 ? 'M68 34 L82 40 L94 38' : 'M68 34 L80 44 L94 40'} color={phase === 1 ? PHASE_1 : PHASE_2} width={3} />
          <Tension x="78" y="40" color={phase === 1 ? HIGHLIGHT : PHASE_2} />
          <Note x="104" y="26" text="Tekan kusen, tahan 6 detik" color={phase === 1 ? PHASE_1 : PHASE_2} anchor="end" size={6} />
        </g>
      );
    }

    if (variant === 'combo') {
      return (
        <g>
          <Head cx="66" cy="18" phase={phase} />
          <Bone d="M66 25 L66 50" width={4} />
          <Bone d="M66 50 L60 66 L58 82" color={MUTED} />
          <Bone d="M66 50 L72 66 L74 82" color={MUTED} />
          <Bone d={phase === 1 ? 'M68 32 L72 44 L72 54' : 'M68 32 L80 30 L80 24'} color={PHASE_1} width={3} />
          <Bone d={phase === 1 ? 'M64 32 L60 22 L64 16' : 'M64 32 L60 22 L64 16'} color={PHASE_1} width={3} />
          <Dumbbell x={72} y={phase === 1 ? 56 : 22} angle={90} />
          <Dumbbell x={64} y={16} angle={90} />
          <Note x="98" y="40" text={phase === 1 ? 'Satu arm curl, satu ekstensi' : 'Ganti sisi di set berikutnya'} color={phase === 1 ? PHASE_1 : PHASE_2} anchor="start" size={6} />
        </g>
      );
    }

    const hammer = variant === 'hammer';
    return (
      <g>
        <Head cx="64" cy="18" phase={phase} />
        <Bone d="M64 25 L64 50" width={4} />
        <Bone d="M64 50 L58 66 L56 82" color={MUTED} />
        <Bone d="M64 50 L70 66 L72 82" color={MUTED} />
        {phase === 1 ? (
          <>
            <Bone d="M66 32 L68 44 L68 56" color={PHASE_1} width={3} />
            <Dumbbell x={68} y={58} angle={hammer ? 90 : 0} />
            <Note x="94" y="44" text="Lengan lurus" color={PHASE_1} anchor="start" size={6} />
          </>
        ) : (
          <>
            <Bone d="M66 32 L70 42 L80 32" color={PHASE_2} width={3} />
            <Dumbbell x={82} y={30} angle={hammer ? 90 : 0} />
            <Tension x="68" y="38" color={PHASE_2} />
            <Note x="94" y="44" text={hammer ? 'Grip netral' : 'Puncak curl'} color={PHASE_2} anchor="start" size={6} />
            <Arrow x1="94" y1="60" x2="94" y2="42" color={PHASE_2} markerId="arrow-up" />
          </>
        )}
      </g>
    );
  },

  triceps: (phase, variant) => {
    if (variant === 'pushdown') {
      return (
        <g>
          <line x1="120" y1="14" x2="120" y2="50" stroke={MUTED} strokeWidth="2" />
          <Head cx="66" cy="18" phase={phase} />
          <Bone d="M66 25 L66 50" width={4} />
          <Bone d="M66 50 L60 66 L58 82" color={MUTED} />
          <Bone d="M66 50 L72 66 L74 82" color={MUTED} />
          <Bone d="M68 32 L76 42" color={PHASE_1} width={3} />
          {phase === 1 ? (
            <>
              <Bone d="M76 42 L80 52" color={PHASE_1} width={3} />
              <line x1="80" y1="52" x2="120" y2="50" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
              <Note x="98" y="64" text="Siku menekuk" color={PHASE_1} anchor="start" size={6} />
            </>
          ) : (
            <>
              <Bone d="M76 42 L78 58" color={PHASE_2} width={3} />
              <line x1="78" y1="58" x2="120" y2="50" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
              <Tension x="78" y="50" color={PHASE_2} />
              <Note x="98" y="64" text="Luruskan penuh" color={PHASE_2} anchor="start" size={6} />
            </>
          )}
        </g>
      );
    }

    if (variant === 'dip') {
      return (
        <g>
          <Chair x={92} y={50} width={34} height={32} />
          <Head cx="86" cy={phase === 1 ? 36 : 28} phase={phase} />
          <Bone d={phase === 1 ? 'M88 42 L96 58 L96 64' : 'M88 34 L96 52 L96 62'} width={4} />
          <Bone d="M96 64 L80 66 L68 82" color={MUTED} />
          {phase === 1 ? (
            <Bone d="M92 44 L106 52 L108 50" color={PHASE_1} width={3} />
          ) : (
            <Bone d="M92 38 L104 50 L108 50" color={PHASE_2} width={3} />
          )}
          <Tension x="98" y="48" color={phase === 1 ? HIGHLIGHT : PHASE_2} />
          <Note x="36" y="34" text={phase === 1 ? 'Turun, siku ke belakang' : 'Dorong hingga lurus'} color={phase === 1 ? PHASE_1 : PHASE_2} anchor="start" size={6} />
        </g>
      );
    }

    if (variant === 'floor') {
      return (
        <g>
          <Head cx="34" cy="70" phase={phase} />
          <Bone d="M42 74 L78 74" width={4} />
          <Bone d="M78 74 L94 56 L106 78" color={LIMB} />
          {phase === 1 ? (
            <Bone d="M46 72 L36 64 L28 68" color={PHASE_1} width={3} />
          ) : (
            <Bone d="M46 72 L32 72 L20 72" color={PHASE_2} width={3} />
          )}
          <Dumbbell x={phase === 1 ? 26 : 18} y={phase === 1 ? 70 : 72} angle={0} />
          <Tension x="36" y="66" color={phase === 1 ? HIGHLIGHT : PHASE_2} />
          <Note x="88" y="38" text={phase === 1 ? 'Turun ke belakang kepala' : 'Luruskan trisep'} color={phase === 1 ? PHASE_1 : PHASE_2} anchor="end" size={6} />
        </g>
      );
    }

    return (
      <g>
        <Head cx="64" cy="18" phase={phase} />
        <Bone d="M64 25 L64 50" width={4} />
        <Bone d="M64 50 L58 66 L56 82" color={MUTED} />
        <Bone d="M64 50 L70 66 L72 82" color={MUTED} />
        {phase === 1 ? (
          <>
            <Bone d="M66 32 L66 18 L54 24" color={PHASE_1} width={3} />
            <Dumbbell x={52} y={26} angle={0} />
            <Note x="94" y="40" text="Siku di samping telinga" color={PHASE_1} anchor="start" size={6} />
          </>
        ) : (
          <>
            <Bone d="M66 32 L66 16 L66 4" color={PHASE_2} width={3} />
            <Dumbbell x={66} y={2} angle={0} />
            <Tension x="66" y="30" color={PHASE_2} />
            <Note x="94" y="40" text="Ekstensi penuh" color={PHASE_2} anchor="start" size={6} />
          </>
        )}
      </g>
    );
  },

  shoulder_press: (phase) => (
    <g>
      <Head cx="80" cy="18" phase={phase} />
      <Bone d="M80 25 L80 48" width={4} />
      <Bone d="M80 48 L66 66 L62 82" color={MUTED} />
      <Bone d="M80 48 L94 66 L98 82" color={MUTED} />
      {phase === 1 ? (
        <>
          <Bone d="M72 30 L62 28 L58 34" color={PHASE_1} width={3} />
          <Bone d="M88 30 L98 28 L102 34" color={PHASE_1} width={3} />
          <Dumbbell x={56} y={35} angle={0} />
          <Dumbbell x={104} y={35} angle={0} />
          <Note x="80" y="12" text="Siku 90°" color={PHASE_1} size={6} />
        </>
      ) : (
        <>
          <Bone d="M72 30 L64 18 L62 8" color={PHASE_2} width={3} />
          <Bone d="M88 30 L96 18 L98 8" color={PHASE_2} width={3} />
          <Dumbbell x={62} y={6} angle={0} />
          <Dumbbell x={98} y={6} angle={0} />
          <Tension x="74" y="28" color={PHASE_2} />
          <Arrow x1="126" y1="66" x2="126" y2="38" color={PHASE_2} markerId="arrow-up" />
          <Note x="130" y="54" text="Dorong" color={PHASE_2} anchor="start" size={6} />
        </>
      )}
    </g>
  ),

  /* ----------------------------- LEG FAMILY ------------------------------ */
  hinge: (phase) => (
    <g>
      {phase === 1 ? (
        <>
          <Head cx="62" cy="16" phase={1} />
          <Bone d="M62 23 L62 50" width={4} />
          <Bone d="M62 50 L56 66 L54 82" color={MUTED} />
          <Bone d="M62 50 L68 66 L70 82" color={MUTED} />
          <Bone d="M64 30 L64 44 L64 56" color={PHASE_1} width={3} />
          <Dumbbell x={64} y={58} angle={0} />
          <Note x="96" y="52" text="Berdiri tegak" color={PHASE_1} anchor="start" size={6} />
        </>
      ) : (
        <>
          <Head cx="80" cy="34" phase={2} />
          <Bone d="M76 38 L52 54" width={4} />
          <Bone d="M52 54 L56 68 L58 82" color={MUTED} />
          <Bone d="M52 54 L48 68 L46 82" color={MUTED} />
          <Bone d="M76 40 L74 56 L72 66" color={PHASE_2} width={3} />
          <Dumbbell x={72} y={68} angle={0} />
          <Tension x="66" y="54" color={PHASE_2} />
          <Note x="102" y="40" text="Punggung lurus, dorong pinggul" color={PHASE_2} anchor="start" size={6} />
        </>
      )}
    </g>
  ),

  thruster: (phase) => (
    <g>
      {phase === 1 ? (
        <>
          <Head cx="52" cy="18" phase={1} />
          <Bone d="M54 25 L50 46" width={4} />
          <Bone d="M50 46 L76 48" color={LIMB} />
          <Bone d="M76 48 L78 82" color={MUTED} />
          <Bone d="M78 82 L88 82" color={MUTED} width={3} />
          <Bone d="M54 30 L62 28 L60 36" color={PHASE_1} width={3} />
          <Dumbbell x={58} y={38} angle={90} />
          <Note x="104" y="40" text="Jongkok, dumbbell di bahu" color={PHASE_1} anchor="start" size={6} />
        </>
      ) : (
        <>
          <Head cx="66" cy="16" phase={2} />
          <Bone d="M66 23 L66 48" width={4} />
          <Bone d="M66 48 L60 64 L58 82" color={MUTED} />
          <Bone d="M66 48 L72 64 L74 82" color={MUTED} />
          <Bone d="M68 30 L62 18 L60 8" color={PHASE_2} width={3} />
          <Bone d="M68 30 L76 18 L78 8" color={PHASE_2} width={3} />
          <Dumbbell x={58} y={6} angle={0} />
          <Dumbbell x={80} y={6} angle={0} />
          <Arrow x1="112" y1="70" x2="112" y2="40" color={PHASE_2} markerId="arrow-up" />
          <Note x="116" y="56" text="Dorong overhead" color={PHASE_2} anchor="start" size={6} />
        </>
      )}
    </g>
  ),

  step_up: (phase) => (
    <g>
      <Chair x={94} y={54} width={32} height={28} />
      {phase === 1 ? (
        <>
          <Head cx="70" cy="18" phase={1} />
          <Bone d="M70 25 L70 46" width={4} />
          <Bone d="M70 46 L86 52 L100 54" color={PHASE_1} />
          <Bone d="M70 46 L66 62 L64 82" color={MUTED} />
          <Bone d="M72 30 L82 40 L86 50" color={MUTED} width={2.6} />
          <Note x="54" y="34" text="Pijak kursi" color={PHASE_1} anchor="end" size={6} />
          <Arrow x1="118" y1="44" x2="118" y2="26" color={PHASE_1} markerId="arrow-up" />
        </>
      ) : (
        <>
          <Head cx="92" cy="12" phase={2} />
          <Bone d="M92 19 L92 38" width={4} />
          <Bone d="M92 38 L96 46 L100 54" color={PHASE_2} />
          <Bone d="M92 38 L84 52 L76 70" color={MUTED} />
          <Bone d="M94 24 L104 34 L108 42" color={MUTED} width={2.6} />
          <Tension x="94" y="42" color={PHASE_2} />
          <Note x="60" y="30" text="Berdiri di kursi" color={PHASE_2} anchor="end" size={6} />
        </>
      )}
    </g>
  ),

  woodchop: (phase) => (
    <g>
      <line x1="138" y1="16" x2="138" y2="30" stroke={MUTED} strokeWidth="2" />
      <Head cx="70" cy="22" phase={phase} />
      <Bone d="M72 30 L76 54" width={4} />
      <Bone d="M76 54 L60 68 L56 82" color={MUTED} />
      <Bone d="M76 54 L94 68 L98 82" color={MUTED} />
      {phase === 1 ? (
        <>
          <Bone d="M72 34 L90 24 L110 20" color={PHASE_1} width={3} />
          <line x1="110" y1="20" x2="138" y2="22" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
          <Note x="42" y="34" text="Tarik diagonal atas" color={PHASE_1} anchor="start" size={6} />
        </>
      ) : (
        <>
          <Bone d="M74 34 L58 44 L40 58" color={PHASE_2} width={3} />
          <line x1="40" y1="58" x2="138" y2="22" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
          <Tension x="66" y="46" color={PHASE_2} />
          <Note x="96" y="66" text="Putar pinggul & core" color={PHASE_2} anchor="start" size={6} />
        </>
      )}
    </g>
  ),

  pallof: (phase) => (
    <g>
      <line x1="24" y1="40" x2="24" y2="82" stroke={MUTED} strokeWidth="2" />
      <Head cx="78" cy="20" phase={phase} />
      <Bone d="M78 27 L78 50" width={4} />
      <Bone d="M78 50 L70 64 L68 82" color={MUTED} />
      <Bone d="M78 50 L86 64 L88 82" color={MUTED} />
      {phase === 1 ? (
        <Bone d="M76 32 L64 38 L54 40" color={PHASE_1} width={3} />
      ) : (
        <Bone d="M76 32 L62 40 L46 40" color={PHASE_2} width={3} />
      )}
      <line x1={phase === 1 ? 54 : 46} y1="40" x2="24" y2="40" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" />
      <Tension x="62" y="38" color={phase === 1 ? HIGHLIGHT : PHASE_2} />
      <Note x="96" y="40" text={phase === 1 ? 'Tahan di dada' : 'Dorong ke depan, lawan rotasi'} color={phase === 1 ? PHASE_1 : PHASE_2} anchor="start" size={6} />
    </g>
  ),

  lateral_walk: (phase) => (
    <g>
      <Bone d="M80 52 L80 34" width={4} />
      <Head cx="80" cy="25" phase={phase} />
      <Bone d="M80 34 L70 42 L66 54" color={PHASE_1} width={2.8} />
      <Bone d="M80 34 L90 42 L94 54" color={PHASE_1} width={2.8} />
      {phase === 1 ? (
        <>
          <Bone d="M80 52 L70 64 L68 80" color={MUTED} />
          <Bone d="M80 52 L90 64 L92 80" color={MUTED} />
          <line x1="68" y1="78" x2="92" y2="78" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2" />
          <Note x="80" y="14" text="Setengah squat" color={PHASE_1} size={6} />
        </>
      ) : (
        <>
          <Bone d="M80 52 L62 62 L54 80" color={PHASE_2} />
          <Bone d="M80 52 L98 62 L106 80" color={PHASE_2} />
          <line x1="54" y1="78" x2="106" y2="78" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2" />
          <Tension x="62" y="58" color={PHASE_2} />
          <Note x="80" y="14" text="Langkah lebar" color={PHASE_2} size={6} />
          <Arrow x1="122" y1="64" x2="106" y2="64" color={PHASE_2} markerId="arrow-left" />
        </>
      )}
    </g>
  ),

  carry: (phase) => (
    <g>
      <Head cx="78" cy="18" phase={phase} />
      <Bone d="M78 25 L78 48" width={4} />
      <Bone d="M70 31 L60 42 L58 54" color={PHASE_1} width={3} />
      <Bone d="M86 31 L96 42 L98 54" color={PHASE_1} width={3} />
      <Dumbbell x={58} y={56} angle={90} />
      <Dumbbell x={98} y={56} angle={90} />
      {phase === 1 ? (
        <>
          <Bone d="M78 48 L66 64 L62 82" color={MUTED} />
          <Bone d="M78 48 L90 64 L94 82" color={MUTED} />
        </>
      ) : (
        <>
          <Bone d="M78 48 L90 64 L96 82" color={MUTED} />
          <Bone d="M78 48 L66 64 L58 82" color={MUTED} />
        </>
      )}
      <Tension x="80" y="32" color={phase === 1 ? HIGHLIGHT : PHASE_2} />
      <Note x="80" y="12" text="Beban seimbang, core kencang" color={phase === 1 ? PHASE_1 : PHASE_2} size={6} />
      {phase === 2 ? <Arrow x1="116" y1="46" x2="100" y2="46" color={PHASE_2} markerId="arrow-left" /> : null}
    </g>
  ),
};

/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */

const POSE_META = {
  squat: {
    label: 'Squat — Jongkok 90° → Berdiri',
    c1: 'Buka pinggul ke belakang, tekuk lutut searah ujung kaki sampai paha sejajar lantai.',
    c2: 'Tancapkan tumit, dorong lantai, lalu kunci paha depan dan bokong di posisi tegak.',
  },
  jump_squat: {
    label: 'Jump Squat — Ancang-ancang → Melayang',
    c1: 'Turun ke jongkok elastis dengan lengan ke belakang, kumpulkan energi sebelum meledak.',
    c2: 'Ledakkan tungkai, lepas dari lantai, lalu mendarat kembali dengan lutut tertekuk lembut.',
  },
  lunge: {
    label: 'Lunge — Langkah Jauh, Lutut 90°',
    c1: 'Langkahkan kaki jauh ke depan, turunkan lutut belakang hingga hampir menyentuh lantai.',
    c2: 'Dorong tumit kaki depan untuk kembali tegak, jaga lutut tetap searah ujung kaki.',
  },
  glute_bridge: {
    label: 'Glute Bridge — Bokong ke Lantai → Hip Thrust',
    c1: 'Berbaring telentang, lutut tertekuk, telapak kaki menapak, bokong menyentuh lantai.',
    c2: 'Angkat pinggul sampai bahu–pinggul–lutut membentuk satu garis diagonal lurus.',
  },
  calf_raise: {
    label: 'Calf Raise — Telapak Rata → Berjinjit',
    c1: 'Berdiri dengan telapak kaki rata di pijakan, beban bertumpu di seluruh kaki.',
    c2: 'Angkat tumit setinggi mungkin, bertumpu pada ujung jari, lalu kontraksi betis.',
  },
  pushup: {
    label: 'Push-up — Dada Turun → Dorong Lurus',
    c1: 'Garis tubuh lurus dari kepala ke tumit, turunkan dada dengan siku menyerong 45°.',
    c2: 'Dorong lantai melalui telapak tangan sampai lengan lurus tanpa mengunci siku.',
  },
  floor_press: {
    label: 'Floor Press — Dada Terbuka → Dorong Vertikal',
    c1: 'Berbaring dengan lutut tertekuk, turunkan dumbbell ke samping dada secara terkontrol.',
    c2: 'Dorong dumbbell vertikal hingga lengan lurus, remas otot dada di puncak.',
  },
  pike: {
    label: 'Pike Push-up — V Terbalik → Dorong',
    c1: 'Pinggul tinggi membentuk V terbalik, turunkan kepala terkontrol di antara kedua tangan.',
    c2: 'Dorong lantai melalui pangkal telapak tangan sampai kembali ke posisi V.',
  },
  pullup: {
    label: 'Pull-up — Menggantung → Dada ke Palang',
    c1: 'Gantung dengan lengan terentang penuh, depresikan bahu, rasakan regangan otot sayap.',
    c2: 'Tarik siku ke bawah dan belakang sampai dada mendekati palang, rapatkan belikat.',
  },
  inverted_row: {
    label: 'Inverted Row — Tubuh di Bawah Palang',
    c1: 'Pegang tumpuan di atas, tubuh lurus dengan tumit di lantai, lengan terentang.',
    c2: 'Tarik dada ke arah palang, siku ke belakang, tubuh tetap kaku seperti papan.',
  },
  bent_over_row: {
    label: 'Bent-Over Row — Hinge → Tarik ke Pinggang',
    c1: 'Hinge dari pinggul dengan punggung rata, biarkan lengan menggantung membawa beban.',
    c2: 'Tarik siku ke belakang menuju pinggang, remas otot punggung tanpa mengangkat torso.',
  },
  seated_row: {
    label: 'Seated Row — Duduk → Siku ke Belakang',
    c1: 'Duduk tegak dengan lutut sedikit tertekuk, lengan terentang memegang handle/band.',
    c2: 'Tarik handle ke arah perut, siku melewati badan, dada tetap tegak.',
  },
  doorframe_row: {
    label: 'Doorframe Row — Bersandar → Tarik Dada',
    c1: 'Pegang kusen pintu, mundurkan badan dengan lengan lurus dan tumit menapak.',
    c2: 'Tekuk siku dan tarik dada ke arah kusen, jaga tubuh tetap lurus.',
  },
  face_pull: {
    label: 'Face Pull — Tarik ke Arah Wajah',
    c1: 'Pegang band setinggi wajah, lengan terentang, siku sedikit lebih tinggi dari bahu.',
    c2: 'Tarik band ke arah wajah, siku melebar ke samping, rapatkan belikat.',
  },
  lat_pulldown: {
    label: 'Lat Pulldown — Regang → Tarik ke Dada',
    c1: 'Berlutut tegak, pegang band/bar di atas, lengan terentang penuh.',
    c2: 'Tarik siku ke bawah menuju dada, busungkan dada, jangan mengayun badan.',
  },
  pull_through: {
    label: 'Pull-Through — Hinge → Dorong Pinggul',
    c1: 'Hinge dengan punggung netral, band melewati bawah paha, lengan menggantung.',
    c2: 'Dorong pinggul ke depan hingga tegak, tarik band ke arah pinggang.',
  },
  band_fly: {
    label: 'Band Chest Fly — Regang → Remas',
    c1: 'Berdiri tegak, pegang band dengan lengan terbuka lebar, rasakan regangan dada.',
    c2: 'Bawa kedua tangan bertemu di depan dada, remas otot dada dengan kontrol.',
  },
  plank: {
    label: 'Plank — Tumpu Lengan → Kunci Core',
    c1: 'Tumpu lengan bawah di lantai, siku di bawah bahu, tubuh lurus dari kepala ke tumit.',
    c2: 'Tarik pusar ke tulang belakang, rapatkan bokong, tahan garis lurus tanpa goyang.',
  },
  mountain_climber: {
    label: 'Mountain Climber — Plank → Lutut ke Dada',
    c1: 'Mulai dari posisi plank tinggi, tangan di bawah bahu, core terkunci.',
    c2: 'Tarik satu lutut ke arah dada, ganti kaki dengan tempo terkontrol.',
  },
  bear_crawl: {
    label: 'Bear Crawl — Lutut Melayang → Merangkak',
    c1: 'Tumpu tangan dan ujung kaki, lutut melayang beberapa senti di atas lantai.',
    c2: 'Gerakkan tangan dan kaki berlawanan secara bergantian, pinggul stabil.',
  },
  crab_walk: {
    label: 'Crab Walk — Telentang → Jalan Kepiting',
    c1: 'Duduk lalu angkat pinggul, telapak tangan dan kaki menapak, badan menghadap atas.',
    c2: 'Langkahkan tangan dan kaki berlawanan, jaga pinggul tetap terangkat.',
  },
  situp: {
    label: 'Sit-up — Berbaring → Angkat Torso',
    c1: 'Berbaring telentang dengan lutut tertekuk dan telapak kaki menapak.',
    c2: 'Angkat torso dengan otot perut, dagu menjauh dari dada, lalu turun terkontrol.',
  },
  bicycle_crunch: {
    label: 'Bicycle Crunch — Rotasi Bergantian',
    c1: 'Berbaring dengan tangan di belakang kepala, satu lutut ditarik ke dada.',
    c2: 'Putar sisi tubuh berlawanan ke arah lutut, ganti sisi tanpa menarik leher.',
  },
  russian_twist: {
    label: 'Russian Twist — Duduk V → Rotasi',
    c1: 'Duduk bersandar dengan lutut tertekuk, dada tegak, pegang beban di depan.',
    c2: 'Putar torso ke satu sisi lalu sisi lain, jaga punggung tetap netral.',
  },
  leg_raise: {
    label: 'Lying Leg Raise — Turun 45° → 90°',
    c1: 'Berbaring telentang, rapatkan kaki, turunkan tungkai terkontrol tanpa menyentuh lantai.',
    c2: 'Angkat tungkai kembali hingga membentuk sudut 90°, tekan punggung bawah ke lantai.',
  },
  hanging_knee_raise: {
    label: 'Hanging Knee Raise — Gantung → Lutut ke Perut',
    c1: 'Gantung di palang dengan bahu terdepresi, tungkai lurus ke bawah.',
    c2: 'Tarik kedua lutut ke arah perut, tahan sesaat, lalu turun terkontrol.',
  },
  prone_raise: {
    label: 'Prone Raise — Tengkurap → Angkat',
    c1: 'Berbaring tengkurap dengan leher netral, lengan dan tungkai rileks.',
    c2: 'Angkat dada, lengan, dan tungkai dari lantai, remas otot punggung.',
  },
  side_plank: {
    label: 'Side Plank — Tumpu Sisi → Angkat Pinggul',
    c1: 'Tumpu lengan bawah di lantai, badan menyamping, lutut boleh sedikit tertekuk.',
    c2: 'Angkat pinggul hingga tubuh membentuk garis lurus dari kepala ke kaki.',
  },
  skipping: {
    label: 'Skipping — Siap → Melayang',
    c1: 'Berdiri dengan tali di belakang, siku dekat badan, siap memutar pergelangan.',
    c2: 'Lompat rendah, putar tali dengan pergelangan, mendarat di bantalan kaki depan.',
  },
  burpee: {
    label: 'Burpee — Tangan ke Lantai → Lompat',
    c1: 'Turunkan tangan ke lantai, tendang kaki ke belakang atau lipat ke posisi jongkok.',
    c2: 'Berdiri dan lompat eksplosif dengan lengan di atas kepala, mendarat lembut.',
  },
  skater: {
    label: 'Skater Jump — Lompat Samping Bergantian',
    c1: 'Mendarat di satu kaki dengan lutut tertekuk, kaki lain terentang ke samping.',
    c2: 'Dorong lateral dan lompat ke sisi lain, mendarat dengan lutut menyerap benturan.',
  },
  jumping_jack: {
    label: 'Squat Jack — Squat → Buka & Lompat',
    c1: 'Setengah squat dengan lutut tertekuk dan lengan di samping badan.',
    c2: 'Lompat membuka kaki dan angkat lengan ke atas, lalu kembali ke squat.',
  },
  high_knees: {
    label: 'High Knees — Lutut Tinggi Bergantian',
    c1: 'Berdiri tegak, angkat satu lutut setinggi pinggul, lengan berlawanan mengayun.',
    c2: 'Ganti kaki dengan cepat di tempat, mendarat di bantalan kaki depan.',
  },
  lateral_raise: {
    label: 'Lateral Raise — Lengan Samping → Setinggi Bahu',
    c1: 'Berdiri tegak, pegang dumbbell di samping badan dengan siku sedikit tertekuk.',
    c2: 'Angkat lengan ke samping hingga setinggi bahu, jangan mengangkat trapesius.',
  },
  reverse_fly: {
    label: 'Reverse Fly — Hinge → Buka Lengan',
    c1: 'Hinge dengan punggung rata, lengan menggantung membawa dumbbell.',
    c2: 'Buka lengan ke samping, siku sedikit tertekuk, remas otot punggung atas.',
  },
  curl: {
    label: 'Bicep Curl — Lengan Lurus → Fleksi',
    c1: 'Berdiri tegak dengan lengan lurus di samping, siku menempel badan.',
    c2: 'Tekuk siku, angkat beban ke arah dada, tahan sesaat lalu turun terkontrol.',
  },
  triceps: {
    label: 'Triceps — Fleksi Siku → Ekstensi',
    c1: 'Tekuk siku dengan posisi pangkal lengan stabil, beban di belakang atau samping.',
    c2: 'Luruskan siku penuh dengan trisep, jaga pangkal lengan tidak ikut bergerak.',
  },
  shoulder_press: {
    label: 'Shoulder Press — Siku 90° → Overhead',
    c1: 'Berdiri tegak, pegang dumbbell setinggi bahu dengan siku tertekuk 90°.',
    c2: 'Dorong beban lurus ke atas hingga lengan lurus, jangan melengkungkan punggung.',
  },
  hinge: {
    label: 'Romanian Deadlift — Berdiri → Hinge',
    c1: 'Berdiri tegak membawa beban di depan paha, lutut sedikit tertekuk.',
    c2: 'Dorong pinggul ke belakang dengan punggung lurus, beban turun dekat tulang kering.',
  },
  thruster: {
    label: 'Thruster — Squat → Overhead Press',
    c1: 'Turun ke squat dengan dumbbell di bahu, siku di depan badan.',
    c2: 'Berdiri eksplosif lalu dorong dumbbell ke atas kepala dalam satu tarikan.',
  },
  step_up: {
    label: 'Step-up — Pijak Kursi → Berdiri',
    c1: 'Letakkan satu kaki di kursi, dorong melalui tumit tanpa mengayun kaki belakang.',
    c2: 'Berdiri tegak di atas kursi, jaga lutut searah ujung kaki, lalu turun terkontrol.',
  },
  woodchop: {
    label: 'Woodchop — Diagonal Atas → Bawah',
    c1: 'Pegang band tinggi di satu sisi, putar torso dan tarik secara diagonal.',
    c2: 'Selesaikan tarikan di sisi berlawanan pinggul, putar melalui core dan pinggul.',
  },
  pallof: {
    label: 'Pallof Press — Tahan → Dorong Anti-Rotasi',
    c1: 'Berdiri menyamping ke anchor, pegang band di dada, tahan tubuh tidak berputar.',
    c2: 'Dorong tangan lurus ke depan, lawan tarikan band agar torso tetap diam.',
  },
  lateral_walk: {
    label: 'Band Lateral Walk — Langkah Samping',
    c1: 'Setengah squat dengan band di pergelangan kaki, kaki berdekatan.',
    c2: 'Langkahkan kaki ke samping melawan band, jaga lutut tetap di luar.',
  },
  carry: {
    label: "Farmer's Walk — Jalan dengan Beban",
    c1: 'Berdiri tegak membawa beban seimbang di kedua sisi, bahu ditarik ke belakang.',
    c2: 'Melangkah pendek dan stabil, core kencang, jangan biarkan badan miring.',
  },
};

const CATEGORY_GUIDANCE = {
  horizontal_push: [
    'Siku membuka 90° sejajar bahu sehingga menjepit rotator cuff.',
    'Pinggul melorot karena core tidak dikunci rapat.',
  ],
  vertical_push: [
    'Siku melebar ke samping alih-alih menyerong ke belakang.',
    'Punggung bawah melengkung karena kehilangan tegangan core.',
  ],
  squat_lunge: [
    'Lutut roboh ke dalam (knee valgus) saat menekuk.',
    'Tumit terangkat dari lantai sehingga beban pindah ke tempurung lutut.',
  ],
  pull_motion: [
    'Mengayunkan badan memakai momentum, bukan kontraksi otot punggung.',
    'Bahu terangkat ke telinga karena tidak ada depresi skapula.',
  ],
  core_floor: [
    'Pinggul merosot ke bawah sehingga punggung bawah menanggung beban.',
    'Menahan napas terlalu lama hingga tekanan darah melonjak.',
  ],
  cardio_blast: [
    'Mendarat dengan lutut terkunci lurus sehingga benturan langsung ke sendi.',
    'Mendarat dengan tumit keras alih-alih meredam di bantalan kaki depan.',
  ],
};

/* -------------------------------------------------------------------------- */
/* Resolver: name → pose + variant                                            */
/* -------------------------------------------------------------------------- */

function pickPushupVariant(text) {
  if (text.includes('spiderman')) return 'spiderman';
  if (text.includes('diamond') || text.includes('close-grip')) return 'diamond';
  if (text.includes('wide grip')) return 'wide';
  if (text.includes('decline')) return 'decline';
  if (text.includes('incline')) return 'incline';
  if (text.includes('board') || text.includes('multi-grip')) return 'board';
  return undefined;
}

function pickLungeVariant(text) {
  if (text.includes('reverse')) return 'reverse';
  if (text.includes('curtsy')) return 'curtsy';
  if (text.includes('bulgarian') || text.includes('split squat')) return 'bulgarian';
  if (text.includes('walking')) return 'walking';
  return undefined;
}

function pickCurlVariant(text) {
  if (text.includes('curl') && (text.includes('pushdown') || text.includes('overhead extension'))) return 'combo';
  if (text.includes('hammer')) return 'hammer';
  if (text.includes('isometric') || text.includes('doorway')) return 'isometric';
  return undefined;
}

function pickTricepsVariant(text) {
  if (text.includes('dip')) return 'dip';
  if (text.includes('pushdown')) return 'pushdown';
  if (text.includes('floor')) return 'floor';
  return 'overhead';
}

const POSE_RULES = [
  [/glute bridge/, 'glute_bridge', (t) => (t.includes('single') ? 'single' : undefined)],
  [/jump squat/, 'jump_squat'],
  [/squat jack/, 'jumping_jack'],
  [/bulgarian|split squat/, 'lunge', () => 'bulgarian'],
  [/lunge/, 'lunge', pickLungeVariant],
  [/step-up/, 'step_up'],
  [/thruster|squat to press/, 'thruster'],
  [/sumo squat/, 'squat', () => 'sumo'],
  [/squat/, 'squat', (t) => (t.includes('goblet') ? 'goblet' : t.includes('pause') ? 'pause' : undefined)],
  [/calf raise/, 'calf_raise', (t) => (t.includes('seated') ? 'seated' : t.includes('single') ? 'single' : undefined)],
  [/pike|dolphin/, 'pike'],
  [/push-?up|pushup/, 'pushup', pickPushupVariant],
  [/incline dumbbell press/, 'floor_press', () => 'incline'],
  [/floor dumbbell press/, 'floor_press'],
  [/tricep dip/, 'triceps', () => 'dip'],
  [/tricep/, 'triceps', pickTricepsVariant],
  [/hammer curl|bicep curl|bicep|door curl|curl/, 'curl', pickCurlVariant],
  [/lateral raise/, 'lateral_raise'],
  [/reverse fly/, 'reverse_fly'],
  [/face pull/, 'face_pull'],
  [/lat pulldown/, 'lat_pulldown'],
  [/seated row/, 'seated_row'],
  [/bent-over row/, 'bent_over_row'],
  [/inverted row/, 'inverted_row'],
  [/doorframe row/, 'doorframe_row'],
  [/pull-through/, 'pull_through'],
  [/pull-?up|chin-?up/, 'pullup', (t) => (t.includes('chin') ? 'chinup' : undefined)],
  [/shoulder press|overhead press/, 'shoulder_press'],
  [/chest fly|band fly/, 'band_fly'],
  [/romanian deadlift/, 'hinge'],
  [/lateral walk/, 'lateral_walk'],
  [/woodchop/, 'woodchop'],
  [/pallof/, 'pallof'],
  [/farmer/, 'carry'],
  [/mountain climber/, 'mountain_climber'],
  [/bear crawl/, 'bear_crawl'],
  [/crab walk/, 'crab_walk'],
  [/side plank/, 'side_plank'],
  [/plank|pike hold/, 'plank'],
  [/hanging knee raise/, 'hanging_knee_raise'],
  [/bicycle crunch/, 'bicycle_crunch'],
  [/russian twist/, 'russian_twist'],
  [/leg raise/, 'leg_raise'],
  [/sit-?up/, 'situp'],
  [/superman/, 'prone_raise', () => 'superman'],
  [/cobra/, 'prone_raise', () => 'cobra'],
  [/prone y|snow angel/, 'prone_raise', () => 'ytw'],
  [/skipping|double-under/, 'skipping', (t) => (t.includes('double') ? 'double' : undefined)],
  [/burpee/, 'burpee'],
  [/skater/, 'skater'],
  [/squat jack/, 'jumping_jack'],
  [/high knees/, 'high_knees'],
];

const CATEGORY_FALLBACK = {
  horizontal_push: 'pushup',
  vertical_push: 'pike',
  squat_lunge: 'squat',
  pull_motion: 'pullup',
  core_floor: 'plank',
  cardio_blast: 'skipping',
};

export function resolveExercisePose(name = '', category = 'horizontal_push') {
  const text = String(name).toLowerCase();
  for (const [pattern, pose, variant] of POSE_RULES) {
    if (pattern.test(text)) {
      return {
        pose,
        variant: typeof variant === 'function' ? variant(text) : variant,
      };
    }
  }
  return { pose: CATEGORY_FALLBACK[category] ?? 'pushup', variant: undefined };
}

export function getExercisePose(name = '', category = 'horizontal_push') {
  const { pose, variant } = resolveExercisePose(name, category);
  const meta = POSE_META[pose] ?? POSE_META.pushup;
  return {
    pose,
    variant,
    label: meta.label,
    c1: meta.c1,
    c2: meta.c2,
    mistakes: CATEGORY_GUIDANCE[category] ?? CATEGORY_GUIDANCE.horizontal_push,
  };
}

/* -------------------------------------------------------------------------- */
/* Renderer                                                                   */
/* -------------------------------------------------------------------------- */

export function PhaseVector({ pose, variant, phase, className = '' }) {
  const renderer = POSE_RENDERERS[pose] ?? POSE_RENDERERS.pushup;

  return (
    <svg
      viewBox="0 0 160 92"
      className={`h-auto w-full select-none ${className}`}
      role="img"
      aria-label={`Vektor fase ${phase} — ${POSE_META[pose]?.label ?? 'gerakan'}`}
    >
      <defs>
        {['arrow-up', 'arrow-down', 'arrow-left', 'arrow-right'].map((id) => (
          <marker
            key={id}
            id={id}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="context-stroke" />
          </marker>
        ))}
      </defs>
      <Ground />
      {renderer(phase, variant)}
    </svg>
  );
}

export default POSE_RENDERERS;
