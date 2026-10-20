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
  CheckCircle2,
  ChevronRight,
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

function ToastCard({ item, index, onDismiss, onAction }) {
  const reduce = useReducedMotion();
  const tone = TONE_STYLES[item.tone] ?? TONE_STYLES.neutral;
  const ToneIcon = tone.icon;
  const offset = index * STACK_PEEK;
  const actionable = typeof item.onAction === 'function';
  const [expanded, setExpanded] = useState(false);

  // Island choreography: land as a pill, then breathe open into a card.
  useEffect(() => {
    if (reduce) return undefined;
    const timer = setTimeout(() => setExpanded(true), 140);
    return () => clearTimeout(timer);
  }, [reduce]);

  const open = reduce || expanded;
  const actionLabel = item.actionLabel || item.text;

  return (
    <motion.li
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -40, scale: 0.96 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: offset, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -40, scale: 0.96 }}
      transition={motionTokens.spring.morph}
      style={{ zIndex: 100 - index, transformOrigin: 'top center' }}
      className="pointer-events-auto w-full [grid-area:1/1]"
    >
      <motion.div
        initial={{ borderRadius: 9999 }}
        animate={{ borderRadius: open ? 28 : 9999 }}
        transition={motionTokens.spring.morph}
        className={`relative w-full overflow-hidden rounded-[28px] border bg-slate-900/95 shadow-2xl backdrop-blur-xl ${tone.borderClass} ${tone.glowClass}`}
      >
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 p-3 pr-14 text-left"
        >
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone.iconClass}`}
          >
            {item.icon ?? <ToneIcon size={17} strokeWidth={2.2} />}
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-slate-100">
              {item.text}
            </p>

            <motion.div
              initial={false}
              animate={{
                height: open ? 'auto' : 0,
                opacity: open ? 1 : 0,
              }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      height: {
                        duration: motionTokens.duration.standard,
                        ease: motionTokens.ease.standard,
                      },
                      opacity: {
                        duration: motionTokens.duration.fast,
                        ease: motionTokens.ease.standard,
                      },
                    }
              }
              className="overflow-hidden"
            >
              {item.description ? (
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-400">
                  {item.description}
                </p>
              ) : null}

              {actionable && item.actionLabel ? (
                <span className="mt-2 inline-flex items-center gap-0.5 text-xs font-semibold text-blue-400">
                  {item.actionLabel}
                  <ChevronRight
                    aria-hidden="true"
                    size={14}
                    strokeWidth={2.6}
                  />
                </span>
              ) : null}
            </motion.div>
          </div>
        </div>

        {actionable ? (
          <button
            type="button"
            onClick={onAction}
            className="absolute inset-0 rounded-[28px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-400"
            aria-label={actionLabel}
          />
        ) : null}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDismiss();
          }}
          className="absolute right-1.5 top-1.5 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          aria-label="Tutup notifikasi"
        >
          <X size={16} strokeWidth={2.4} />
        </button>
      </motion.div>
    </motion.li>
  );
}

export function ToastProvider({
  children,
  position = 'top-center',
  maxToasts = DEFAULT_MAX_TOASTS,
}) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  // `true` only after hydration, so the portal never causes a mismatch.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

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

  const contextValue = useMemo(
    () => ({ toast, dismiss, toasts }),
    [toast, dismiss, toasts]
  );

  const portal =
    mounted && typeof document !== 'undefined'
      ? createPortal(
          <div
            className={`pointer-events-none fixed z-[220] w-[min(420px,calc(100vw-24px))] pt-[env(safe-area-inset-top)] ${
              POSITION_CLASSES[position] ?? POSITION_CLASSES['top-center']
            }`}
          >
            <motion.ol
              className="grid w-full items-start"
              aria-label="Notifikasi aplikasi"
            >
              <AnimatePresence initial={false}>
                {toasts.map((item, index) => (
                  <ToastCard
                    key={item.id}
                    item={item}
                    index={index}
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
