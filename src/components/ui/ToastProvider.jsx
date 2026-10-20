'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from 'lucide-react';
import { motionTokens } from './motion-primitives';

const ToastContext = createContext(null);

const STACK_PEEK = 10;
const DEFAULT_DURATION = 4800;
const DEFAULT_MAX_TOASTS = 3;

const noopSubscribe = () => () => {};

const TONE_STYLES = {
  neutral: {
    icon: Info,
    iconClass: 'bg-slate-800 text-slate-200',
    borderClass: 'border-slate-700/80',
    glowClass: 'shadow-slate-950/60',
  },
  success: {
    icon: CheckCircle2,
    iconClass: 'bg-emerald-500/15 text-emerald-400',
    borderClass: 'border-emerald-500/30',
    glowClass: 'shadow-emerald-950/30',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'bg-amber-500/15 text-amber-400',
    borderClass: 'border-amber-500/30',
    glowClass: 'shadow-amber-950/30',
  },
  danger: {
    icon: XCircle,
    iconClass: 'bg-rose-500/15 text-rose-400',
    borderClass: 'border-rose-500/30',
    glowClass: 'shadow-rose-950/30',
  },
};

const POSITION_CLASSES = {
  'top-center': 'top-3 left-1/2 -translate-x-1/2',
  'top-right': 'top-3 right-3',
  'bottom-center': 'bottom-3 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-3 right-3',
};

function ToastCard({
  item,
  index,
  isExpanded,
  onExpand,
  onCollapse,
  onHoverStart,
  onHoverEnd,
  onDismiss,
  onAction,
}) {
  const reduce = useReducedMotion();
  const tone = TONE_STYLES[item.tone] ?? TONE_STYLES.neutral;
  const ToneIcon = tone.icon;
  const offset = index * STACK_PEEK;
  const scale = isExpanded ? 1 : Math.max(0.88, 1 - index * 0.04);
  const hasDetails = Boolean(item.description || item.actionLabel);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isExpanded) onCollapse();
      else onExpand();
    }
  };

  return (
    <motion.li
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: -64, scale: 0.9 }
      }
      animate={
        reduce
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: offset,
              scale,
            }
      }
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -64, scale: 0.9 }}
      transition={motionTokens.spring.morph}
      style={{ zIndex: 100 - index, transformOrigin: 'top center' }}
      className="pointer-events-auto w-full [grid-area:1/1]"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <div
        role="status"
        aria-live="polite"
        tabIndex={0}
        onClick={() => (isExpanded ? onCollapse() : onExpand())}
        onKeyDown={handleKeyDown}
        className={`relative w-full overflow-hidden rounded-full border bg-slate-900/95 text-left shadow-2xl backdrop-blur-xl transition-[border-radius,border-color,background-color] duration-300 ${
          isExpanded ? 'rounded-3xl' : 'rounded-full'
        } ${tone.borderClass} ${tone.glowClass} ${
          hasDetails ? 'cursor-pointer' : ''
        }`}
      >
        <div className="flex min-h-13 items-center gap-3 px-3.5 py-1.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone.iconClass}`}
          >
            {item.icon ?? <ToneIcon size={17} strokeWidth={2.2} />}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-snug text-slate-100">
              {item.text}
            </p>
            {!isExpanded && hasDetails ? (
              <p className="mt-0.5 truncate text-xs text-slate-500">
                Ketuk untuk detail
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDismiss();
            }}
            onKeyDown={(event) => event.stopPropagation()}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-label="Tutup notifikasi"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && hasDetails ? (
            <motion.div
              initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{
                duration: motionTokens.duration.standard,
                ease: motionTokens.ease.standard,
              }}
              className="overflow-hidden"
            >
              <div className="space-y-3 px-4 pb-4 pt-1">
                {item.description ? (
                  <p className="text-xs leading-relaxed text-slate-300">
                    {item.description}
                  </p>
                ) : null}

                {item.actionLabel ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onAction();
                    }}
                    onKeyDown={(event) => event.stopPropagation()}
                    className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 text-xs font-semibold text-slate-100 transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight size={15} strokeWidth={2.4} />
                  </button>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}

export function ToastProvider({
  children,
  position = 'top-center',
  maxToasts = DEFAULT_MAX_TOASTS,
}) {
  const [toasts, setToasts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const timersRef = useRef(new Map());
  const canHoverRef = useRef(false);

  // `true` only after hydration, so the portal never causes a mismatch.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => {
      canHoverRef.current = query.matches;
    };
    sync();
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, []);

  const clearTimer = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id) => {
      clearTimer(id);
      setToasts((previous) => previous.filter((item) => item.id !== id));
      setExpandedId((previous) => (previous === id ? null : previous));
    },
    [clearTimer]
  );

  const scheduleDismiss = useCallback(
    (id, duration) => {
      clearTimer(id);
      if (!duration || duration <= 0) return;
      const timer = setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    },
    [clearTimer, dismiss]
  );

  const toast = useCallback(
    (options = {}) => {
      const payload = typeof options === 'string' ? { text: options } : options;
      const id =
        payload.id ??
        `he-toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const item = {
        id,
        text: payload.text ?? 'Notifikasi',
        description: payload.description ?? '',
        icon: payload.icon ?? null,
        tone: payload.tone ?? 'neutral',
        actionLabel: payload.actionLabel ?? '',
        onAction: payload.onAction ?? null,
        duration: payload.duration ?? DEFAULT_DURATION,
      };

      setToasts((previous) => [
        item,
        ...previous.filter((entry) => entry.id !== id),
      ].slice(0, maxToasts));

      setExpandedId(null);
      scheduleDismiss(id, item.duration);
      return id;
    },
    [maxToasts, scheduleDismiss]
  );

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    },
    []
  );

  const orderedToasts = useMemo(() => {
    if (!expandedId) return toasts;
    const index = toasts.findIndex((item) => item.id === expandedId);
    if (index <= 0) return toasts;
    return [
      toasts[index],
      ...toasts.slice(0, index),
      ...toasts.slice(index + 1),
    ];
  }, [toasts, expandedId]);

  const expand = useCallback(
    (id) => {
      clearTimer(id);
      setExpandedId(id);
    },
    [clearTimer]
  );

  const collapse = useCallback(
    (id, duration) => {
      setExpandedId((previous) => (previous === id ? null : previous));
      scheduleDismiss(id, duration ?? DEFAULT_DURATION);
    },
    [scheduleDismiss]
  );

  const handleHoverStart = useCallback(
    (id) => {
      if (!canHoverRef.current) return;
      expand(id);
    },
    [expand]
  );

  const handleHoverEnd = useCallback(
    (id, duration) => {
      if (!canHoverRef.current) return;
      collapse(id, duration);
    },
    [collapse]
  );

  const contextValue = useMemo(
    () => ({ toast, dismiss, toasts }),
    [toast, dismiss, toasts]
  );

  const portal =
    mounted && typeof document !== 'undefined'
      ? createPortal(
          <div
            className={`pointer-events-none fixed z-50 w-[min(420px,calc(100vw-24px))] pt-[env(safe-area-inset-top)] ${
              POSITION_CLASSES[position] ?? POSITION_CLASSES['top-center']
            }`}
          >
            <motion.ol
              className="grid w-full items-start"
              aria-label="Notifikasi aplikasi"
            >
              <AnimatePresence initial={false}>
                {orderedToasts.map((item, index) => (
                  <ToastCard
                    key={item.id}
                    item={item}
                    index={index}
                    isExpanded={expandedId === item.id}
                    onExpand={() => expand(item.id)}
                    onCollapse={() => collapse(item.id, item.duration)}
                    onHoverStart={() => handleHoverStart(item.id)}
                    onHoverEnd={() => handleHoverEnd(item.id, item.duration)}
                    onDismiss={() => dismiss(item.id)}
                    onAction={() => {
                      if (typeof item.onAction === 'function') item.onAction();
                      dismiss(item.id);
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.ol>
          </div>,
          document.body
        )
      : null;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portal}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast harus digunakan di dalam <ToastProvider>.');
  }
  return context;
}
