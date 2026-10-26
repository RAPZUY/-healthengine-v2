'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
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
  ChevronDown,
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

function ToastCard({ item, index, onDismiss, onAction, onOpenChange }) {
  const reduce = useReducedMotion();
  const tone = TONE_STYLES[item.tone] ?? TONE_STYLES.neutral;
  const ToneIcon = tone.icon;
  const offset = index * STACK_PEEK;
  const actionable = typeof item.onAction === 'function';
  const island = Boolean(item.island);
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const panelId = useId();

  // Island default: stay a slim capsule until the user asks for the details.
  // Regular toasts keep the old choreography (land as a pill, then breathe open).
  useEffect(() => {
    if (island) return undefined;
    if (reduce) return undefined;
    const timer = setTimeout(() => setExpanded(true), 140);
    return () => clearTimeout(timer);
  }, [island, reduce]);

  const open = island ? expanded : reduce || expanded;
  const actionLabel = item.actionLabel || item.text;

  // While the island is open it must not disappear under the user's finger,
  // so the provider pauses the auto-dismiss timer and resumes it on collapse.
  const setOpen = useCallback(
    (next) => {
      setExpanded(next);
      onOpenChange?.(next, item.duration);
    },
    [item.duration, onOpenChange]
  );

  useEffect(() => {
    if (!island || !open) return undefined;

    const handlePointerDown = (event) => {
      if (cardRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [island, open, setOpen]);

  const title = island ? item.collapsedText || item.text : item.text;

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
        ref={cardRef}
        data-toast-island={island ? 'true' : undefined}
        initial={false}
        animate={{ borderRadius: open ? 24 : 9999 }}
        transition={motionTokens.spring.morph}
        className={`relative w-full overflow-hidden border bg-slate-900/95 shadow-2xl backdrop-blur-xl ${tone.borderClass} ${tone.glowClass}`}
      >
        {island ? (
          <>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls={panelId}
              className="flex min-h-12 w-full touch-manipulation items-center gap-3 py-1.5 pl-3 pr-14 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-400"
            >
              <span
                aria-hidden="true"
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone.iconClass}`}
              >
                {item.icon ?? <ToneIcon size={16} strokeWidth={2.2} />}
              </span>

              <span
                role="status"
                aria-live="polite"
                className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-100"
              >
                {title}
              </span>

              <motion.span
                aria-hidden="true"
                animate={{ rotate: open ? 180 : 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        duration: motionTokens.duration.fast,
                        ease: motionTokens.ease.standard,
                      }
                }
                className="flex shrink-0 items-center justify-center text-slate-500"
              >
                <ChevronDown size={16} strokeWidth={2.4} />
              </motion.span>
            </button>

            <div
              id={panelId}
              aria-hidden={!open}
              inert={!open ? true : undefined}
              className="overflow-hidden"
            >
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
                <div className="space-y-3 px-3 pb-3">
                  {item.description ? (
                    <p className="text-xs leading-relaxed text-slate-300">
                      {item.description}
                    </p>
                  ) : null}

                  {actionable ? (
                    <button
                      type="button"
                      onClick={onAction}
                      className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-3 text-xs font-bold text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                    >
                      {actionLabel}
                      <ChevronRight
                        aria-hidden="true"
                        size={14}
                        strokeWidth={2.6}
                      />
                    </button>
                  ) : null}
                </div>
              </motion.div>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDismiss();
          }}
          className="absolute right-1 top-0.5 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
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
  // Island yang sedang terbuka tidak boleh dijadwalkan tutup, termasuk saat
  // toast dengan id sama dipicu ulang (mis. tombol agenda ditekan dua kali).
  const openIslandsRef = useRef(new Set());

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
      openIslandsRef.current.delete(id);
      setToasts((previous) => previous.filter((item) => item.id !== id));
    },
    [clearTimer]
  );

  const scheduleDismiss = useCallback(
    (id, duration) => {
      clearTimer(id);
      if (openIslandsRef.current.has(id)) return;
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
        collapsedText: payload.collapsedText ?? '',
        description: payload.description ?? '',
        icon: payload.icon ?? null,
        tone: payload.tone ?? 'neutral',
        island: Boolean(payload.island),
        actionLabel: payload.actionLabel ?? '',
        onAction: payload.onAction ?? null,
        duration: payload.duration ?? DEFAULT_DURATION,
      };

      setToasts((previous) => [
        item,
        ...previous.filter((entry) => entry.id !== id),
      ].slice(0, maxToasts));

      if (!openIslandsRef.current.has(id)) {
        scheduleDismiss(id, item.duration);
      }
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

  const handleOpenChange = useCallback(
    (id, open, duration) => {
      if (open) {
        openIslandsRef.current.add(id);
        clearTimer(id);
        return;
      }
      openIslandsRef.current.delete(id);
      scheduleDismiss(id, duration);
    },
    [clearTimer, scheduleDismiss]
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
                    onOpenChange={(open) => handleOpenChange(item.id, open, item.duration)}
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
