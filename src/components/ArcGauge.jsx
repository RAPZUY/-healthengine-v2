'use client';

import React, { useCallback } from 'react';

export default function ArcGauge({ bmi }) {
  const cx = 160;
  const cy = 145;
  const radius = 110;
  const strokeWidth = 14;

  const minBMI = 12;
  const maxBMI = 38;
  const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi || 21.5));

  const valueToAngle = useCallback((val) => {
    const ratio = (val - minBMI) / (maxBMI - minBMI);
    return Math.PI - ratio * Math.PI; // Dari kiri (pi) ke kanan (0)
  }, []);

  const describeArc = useCallback((startAngle, endAngle) => {
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy - radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy - radius * Math.sin(endAngle);
    return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  }, [cx, cy, radius]);

  const pointerAngle = valueToAngle(clampedBMI);
  const pointerX = cx + (radius - 2) * Math.cos(pointerAngle);
  const pointerY = cy - (radius - 2) * Math.sin(pointerAngle);

  // Zona BMI Asia Pasifik / Kemenkes RI
  const zones = [
    { startVal: 12, endVal: 18.5, color: '#F59E0B', label: '<18.5 Kurang' },
    { startVal: 18.5, endVal: 22.9, color: '#10B981', label: '18.5-22.9 Ideal' },
    { startVal: 23.0, endVal: 24.9, color: '#EAB308', label: '23-24.9 Waspada' },
    { startVal: 25.0, endVal: 29.9, color: '#F97316', label: '25-29.9 Lebih' },
    { startVal: 30.0, endVal: 38.0, color: '#F43F5E', label: '≥30 Obesitas' },
  ];

  return (
    <div className="relative w-full max-w-[320px] mx-auto select-none pt-2">
      <svg viewBox="0 0 320 170" className="w-full h-auto overflow-visible">
        {/* Track Dasar Transparan */}
        <path
          d={describeArc(Math.PI, 0)}
          fill="none"
          stroke="#1F2937"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Zona Kemenkes / WHO */}
        {zones.map((zone, idx) => {
          const a1 = valueToAngle(zone.startVal);
          const a2 = valueToAngle(zone.endVal);
          const isUserInZone = clampedBMI >= zone.startVal && clampedBMI < zone.endVal;
          return (
            <path
              key={idx}
              d={describeArc(a1, a2)}
              fill="none"
              stroke={zone.color}
              strokeWidth={isUserInZone ? strokeWidth + 3 : strokeWidth - 2}
              opacity={isUserInZone ? 1 : 0.35}
              className="transition-all duration-500 ease-out"
            />
          );
        })}

        {/* Tanda Tick Titik Ambang Batas: 18.5, 23.0, 25.0, 30.0 */}
        {[18.5, 23.0, 25.0, 30.0].map((tick) => {
          const angle = valueToAngle(tick);
          const innerX = cx + (radius - 12) * Math.cos(angle);
          const innerY = cy - (radius - 12) * Math.sin(angle);
          const outerX = cx + (radius + 12) * Math.cos(angle);
          const outerY = cy - (radius + 12) * Math.sin(angle);
          return (
            <line
              key={tick}
              x1={innerX}
              y1={innerY}
              x2={outerX}
              y2={outerY}
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="2 2"
              opacity={0.7}
            />
          );
        })}

        {/* Pointer Indikator Aktif */}
        <g
          style={{
            transform: `translate(${pointerX}px, ${pointerY}px)`,
            transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <circle r="9" fill="#0B0F17" stroke="#3B82F6" strokeWidth="3" />
          <circle r="4" fill="#60A5FA" />
        </g>
      </svg>

      {/* Label Kritis di bawah Arc */}
      <div className="flex justify-between items-center text-[10px] font-mono tracking-tight text-slate-400 px-4 -mt-2">
        <span className="text-amber-400">18.5</span>
        <span className="text-emerald-400 font-bold">21.5 (Optimal)</span>
        <span className="text-yellow-400">23.0</span>
        <span className="text-orange-400">25.0</span>
        <span className="text-rose-400">30.0+</span>
      </div>
    </div>
  );
}
