'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

/**
 * Shared motion language for HealthEngine V3.
 * Every spring / duration in the app should come from this object so the
 * interface keeps one physical personality.
 */
export const motionTokens = {
  duration: {
    fast: 0.18,
    standard: 0.28,
    considered: 0.38,
  },
  ease: {
    standard: [0.16, 1, 0.3, 1],
  },
  spring: {
    smooth: { type: 'spring', stiffness: 380, damping: 36, mass: 0.8 },
    morph: { type: 'spring', stiffness: 420, damping: 38, mass: 0.8 },
  },
};

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* -------------------------------------------------------------------------- */
/* MorphingText                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Soft vertical crossfade for a changing label. Used for month names and
 * contextual captions where a hard text swap would feel abrupt.
 */
export function MorphingText({ value, className = '', textClassName = '' }) {
  const reduce = useReducedMotion();
  const label = value == null ? '' : String(value);

  return (
    <span className={`relative inline-flex overflow-hidden align-bottom ${className}`}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={label}
          initial={reduce ? { opacity: 0 } : { y: '70%', opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { y: '0%', opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: '-70%', opacity: 0 }}
          transition={motionTokens.spring.smooth}
          className={`inline-block whitespace-nowrap ${textClassName}`}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* RollingNumber                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Per-digit odometer. Each digit column slides vertically when its value
 * changes, which makes `-` / `+` controls feel physical instead of teleporting.
 */
export function RollingNumber({
  value,
  className = '',
  digitClassName = '',
  locale = 'id-ID',
  maximumFractionDigits = 0,
  minimumFractionDigits = 0,
  prefix = '',
  suffix = '',
  ariaLabel,
}) {
  const numericValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const reduce = useReducedMotion();
  const [previousValue, setPreviousValue] = useState(numericValue);
  const [direction, setDirection] = useState(1);

  // Adjust state during render when the prop changes (React's documented
  // derived-state pattern) so the first paint already knows the direction.
  if (previousValue !== numericValue) {
    setDirection(numericValue > previousValue ? 1 : -1);
    setPreviousValue(numericValue);
  }

  const formatted = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        maximumFractionDigits,
        minimumFractionDigits,
      }).format(numericValue),
    [numericValue, locale, maximumFractionDigits, minimumFractionDigits]
  );

  const characters = Array.from(formatted);

  return (
    <span className={`inline-flex items-baseline tabular-nums ${className}`}>
      <span className="sr-only">{ariaLabel ?? formatted}</span>
      {prefix ? <span aria-hidden="true">{prefix}</span> : null}
      <span aria-hidden="true" className="inline-flex items-baseline">
        {characters.map((character, index) => {
          if (!/\d/.test(character)) {
            return (
              <span
                key={`separator-${index}-${character}`}
                className="inline-flex h-[1.15em] items-center justify-center"
              >
                {character}
              </span>
            );
          }

          return (
            <span
              key={`digit-slot-${index}`}
              className={`relative inline-flex h-[1.15em] w-[0.62em] items-center justify-center overflow-hidden ${digitClassName}`}
            >
              <AnimatePresence initial={false}>
                <motion.span
                  key={`digit-${index}-${character}`}
                  initial={
                    reduce
                      ? { opacity: 0 }
                      : { y: direction > 0 ? '100%' : '-100%', opacity: 0.2 }
                  }
                  animate={reduce ? { opacity: 1 } : { y: '0%', opacity: 1 }}
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : {
                          y: direction > 0 ? '-100%' : '100%',
                          opacity: 0.2,
                        }
                  }
                  transition={motionTokens.spring.smooth}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {character}
                </motion.span>
              </AnimatePresence>
            </span>
          );
        })}
      </span>
      {suffix ? (
        <span aria-hidden="true" className="ml-1">
          {suffix}
        </span>
      ) : null}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* TextReveal                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Quiet line-by-line reveal for validation copy and contextual help.
 */
export function TextReveal({
  text,
  lines,
  className = '',
  lineClassName = '',
}) {
  const reduce = useReducedMotion();
  const content = lines ?? (text == null ? [] : String(text).split('\n'));

  return (
    <div className={className} role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {content
          .filter((line) => line != null && String(line).length > 0)
          .map((line, index) => (
            <motion.p
              key={`${index}-${line}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{
                duration: motionTokens.duration.fast,
                delay: index * 0.04,
                ease: motionTokens.ease.standard,
              }}
              className={lineClassName}
            >
              {line}
            </motion.p>
          ))}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* AutoHeight                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Measures its child and animates the wrapper height. Used for the calendar
 * collapse/expand and for swapping agenda lists without a hard jump.
 */
export function AutoHeight({
  children,
  className = '',
  innerClassName = '',
  duration = motionTokens.duration.standard,
}) {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const reduce = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const element = innerRef.current;
    if (!element) return undefined;

    const measure = () => {
      setHeight(element.getBoundingClientRect().height);
    };

    measure();

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure);
      observer.observe(element);
    }
    window.addEventListener('resize', measure);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ height }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration, ease: motionTokens.ease.standard }
      }
      style={{ overflow: 'hidden' }}
      className={className}
    >
      <div ref={innerRef} className={`flow-root ${innerClassName}`}>
        {children}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Button                                                                     */
/* -------------------------------------------------------------------------- */

const BUTTON_TONES = {
  primary: {
    filled:
      'bg-blue-600 text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500',
    bordered:
      'border border-blue-500/40 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10',
    text: 'text-blue-400 hover:text-blue-300',
  },
  secondary: {
    filled:
      'border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700',
    bordered:
      'border border-slate-700 bg-slate-950/60 text-slate-300 hover:bg-slate-800',
    text: 'text-slate-400 hover:text-slate-200',
  },
};

const BUTTON_SIZES = {
  small: 'min-h-11 px-3 text-xs gap-1.5',
  medium: 'min-h-11 px-4 text-sm gap-2',
  large: 'min-h-12 px-5 text-base gap-2.5',
};

export function Button({
  variant = 'filled',
  tone = 'primary',
  size = 'medium',
  icon,
  label,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const reduce = useReducedMotion();
  const toneSet = BUTTON_TONES[tone] ?? BUTTON_TONES.primary;

  return (
    <motion.button
      type={type}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={motionTokens.spring.smooth}
      className={`inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-xl font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${toneSet[variant]} ${BUTTON_SIZES[size]} ${className}`}
      {...props}
    >
      {icon ? <span className="flex shrink-0 items-center">{icon}</span> : null}
      {label ?? children}
    </motion.button>
  );
}
