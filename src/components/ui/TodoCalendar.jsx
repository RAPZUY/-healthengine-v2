'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { AutoHeight, MorphingText } from './motion-primitives';

const FOLLOW_SPRING = { stiffness: 420, damping: 40, mass: 0.8 };

function startOfDay(input) {
  const date = new Date(input);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(input, amount) {
  const date = startOfDay(input);
  date.setDate(date.getDate() + amount);
  return date;
}

function toDateKey(input) {
  const date = startOfDay(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateKey(key) {
  if (!key || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return startOfDay(new Date());
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getWeekStart(input, weekStartsOn) {
  const date = startOfDay(input);
  const difference = (date.getDay() - weekStartsOn + 7) % 7;
  return addDays(date, -difference);
}

function buildWeek(input, weekStartsOn) {
  const start = getWeekStart(input, weekStartsOn);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

function buildMonth(input, weekStartsOn) {
  const first = new Date(input.getFullYear(), input.getMonth(), 1);
  const start = getWeekStart(first, weekStartsOn);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

function isSameMonth(a, b) {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
  );
}

/**
 * Real-time DOM measurement + two springs. The highlight is not a CSS class
 * that teleports between cells; it is a box that chases the active cell.
 */
function useBoxFollower(containerRef, getTarget, measureKey) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const [visible, setVisible] = useState(false);

  const getTargetRef = useRef(getTarget);

  useEffect(() => {
    getTargetRef.current = getTarget;
  }, [getTarget]);

  const springX = useSpring(x, FOLLOW_SPRING);
  const springY = useSpring(y, FOLLOW_SPRING);
  const springWidth = useSpring(width, FOLLOW_SPRING);
  const springHeight = useSpring(height, FOLLOW_SPRING);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const target = getTargetRef.current?.();

    if (!container || !target) {
      x.set(0);
      y.set(0);
      width.set(0);
      height.set(0);
      setVisible(false);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    x.set(targetRect.left - containerRect.left);
    y.set(targetRect.top - containerRect.top);
    width.set(targetRect.width);
    height.set(targetRect.height);
    setVisible(true);
  }, [containerRef, height, width, x, y]);

  useEffect(() => {
    measure();

    const container = containerRef.current;
    let observer;
    if (container && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => measure());
      observer.observe(container);
      const target = getTargetRef.current?.();
      if (target) observer.observe(target);
    }

    window.addEventListener('resize', measure);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [containerRef, measure, measureKey]);

  return {
    x: springX,
    y: springY,
    width: springWidth,
    height: springHeight,
    visible,
  };
}

function DayFollower({ follower, variant = 'hover' }) {
  const className =
    variant === 'selected'
      ? 'border shadow-lg shadow-black/20'
      : 'border border-slate-700/60 bg-slate-800/70';

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 z-0 rounded-xl ${className}`}
      style={{
        x: follower.x,
        y: follower.y,
        width: follower.width,
        height: follower.height,
        opacity: follower.visible ? 1 : 0,
        backgroundColor:
          variant === 'selected' ? 'var(--app-selected-bg)' : undefined,
        borderColor:
          variant === 'selected' ? 'var(--app-selected-bg)' : undefined,
      }}
    />
  );
}

export default function TodoCalendar({
  selectedDate,
  onSelectDate,
  items = [],
  onItemClick,
  addTodoAction = null,
  locale = 'id-ID',
  weekStartsOn = 1,
  className = '',
}) {
  const reduce = useReducedMotion();
  const [internalSelected, setInternalSelected] = useState(() =>
    toDateKey(new Date())
  );
  const selectedKey = selectedDate ?? internalSelected;
  const selected = useMemo(() => fromDateKey(selectedKey), [selectedKey]);

  const [viewDate, setViewDate] = useState(() => fromDateKey(selectedKey));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState(null);

  const gridRef = useRef(null);
  const cellRefs = useRef(new Map());

  const todayKey = toDateKey(new Date());
  const selectedDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }).format(selected),
    [locale, selected]
  );
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
      }).format(viewDate),
    [locale, viewDate]
  );

  const shortWeekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'short' }),
    [locale]
  );
  const longDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [locale]
  );

  const weekdayLabels = useMemo(() => {
    const reference = getWeekStart(new Date(), weekStartsOn);
    return Array.from({ length: 7 }, (_, index) =>
      shortWeekdayFormatter.format(addDays(reference, index))
    );
  }, [shortWeekdayFormatter, weekStartsOn]);

  const visibleDays = useMemo(
    () =>
      calendarOpen
        ? buildMonth(viewDate, weekStartsOn)
        : buildWeek(selected, weekStartsOn),
    [calendarOpen, selected, viewDate, weekStartsOn]
  );

  const selectDay = (day) => {
    const key = toDateKey(day);
    if (selectedDate == null) setInternalSelected(key);
    onSelectDate?.(key);
    if (calendarOpen) setViewDate(startOfDay(day));
  };

  const goToPreviousMonth = () => {
    setViewDate((previous) => {
      const next = new Date(previous.getFullYear(), previous.getMonth() - 1, 1);
      return next;
    });
  };

  const goToNextMonth = () => {
    setViewDate((previous) => {
      const next = new Date(previous.getFullYear(), previous.getMonth() + 1, 1);
      return next;
    });
  };

  const goToToday = () => {
    const today = startOfDay(new Date());
    selectDay(today);
    setViewDate(today);
  };

  const toggleCalendar = () => {
    if (!calendarOpen) setViewDate(fromDateKey(selectedKey));
    setCalendarOpen((previous) => !previous);
  };

  const getSelectedTarget = useCallback(() => {
    const element = cellRefs.current.get(selectedKey);
    if (element && !element.isConnected) {
      cellRefs.current.delete(selectedKey);
      return null;
    }
    return element ?? null;
  }, [selectedKey]);
  const getHoveredTarget = useCallback(() => {
    if (!hoveredKey || hoveredKey === selectedKey) return null;
    const element = cellRefs.current.get(hoveredKey);
    if (element && !element.isConnected) {
      cellRefs.current.delete(hoveredKey);
      return null;
    }
    return element ?? null;
  }, [hoveredKey, selectedKey]);

  const selectedFollower = useBoxFollower(
    gridRef,
    getSelectedTarget,
    `selected-${selectedKey}-${calendarOpen ? 'month' : 'week'}-${viewDate.getFullYear()}-${viewDate.getMonth()}`
  );
  const hoverFollower = useBoxFollower(
    gridRef,
    getHoveredTarget,
    `hover-${hoveredKey ?? 'none'}-${calendarOpen ? 'month' : 'week'}`
  );

  const setCellRef = useCallback((element) => {
    if (!element) return;
    const key = element.dataset.dateKey;
    if (key) cellRefs.current.set(key, element);
  }, []);

  return (
    <section
      className={`surface-card w-full max-w-[34rem] overflow-hidden rounded-3xl p-5 text-slate-100 sm:p-6 ${className}`}
      aria-label="Kalender agenda"
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-4 border-b border-[var(--app-card-border)] px-1 pb-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <CalendarDays size={18} strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-slate-400">
              {calendarOpen ? 'Agenda bulanan' : 'Agenda mingguan'}
            </p>
            <p className="truncate text-sm font-bold text-slate-100">
              <MorphingText
                value={calendarOpen ? monthLabel : selectedDateLabel}
              />
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 self-center">
          {addTodoAction}
          <button
            type="button"
            onClick={toggleCalendar}
            className="surface-chip flex min-h-11 min-w-11 items-center justify-center gap-0.5 rounded-xl text-slate-400 transition hover:border-slate-600 hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-expanded={calendarOpen}
            aria-label={
              calendarOpen
                ? 'Ciutkan kalender ke satu minggu'
                : 'Buka kalender satu bulan penuh'
            }
          >
            <CalendarDays size={17} strokeWidth={2.2} />
            {calendarOpen ? (
              <ChevronUp size={12} strokeWidth={2.6} />
            ) : (
              <ChevronDown size={12} strokeWidth={2.6} />
            )}
          </button>
        </div>
      </header>

      {/* Month navigation — only while expanded */}
      <AutoHeight>
        {calendarOpen ? (
          <div className="mb-2 mt-3 flex items-center gap-1">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="surface-chip flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-400 transition hover:border-slate-600 hover:text-slate-200"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft size={18} strokeWidth={2.3} />
            </button>

            <p className="min-w-0 flex-1 text-center text-xs font-semibold text-slate-300">
              <MorphingText value={monthLabel} />
            </p>

            <button
              type="button"
              onClick={goToNextMonth}
              className="surface-chip flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-400 transition hover:border-slate-600 hover:text-slate-200"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight size={18} strokeWidth={2.3} />
            </button>

            <button
              type="button"
              onClick={goToToday}
              className="min-h-11 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/15"
            >
              Hari Ini
            </button>
          </div>
        ) : null}
      </AutoHeight>

      {/* Week strip / full month grid */}
      <AutoHeight>
        <div className="mt-4">
          <div className="mb-1 grid grid-cols-7 gap-0.5">
            {weekdayLabels.map((label, index) => (
              <span
                key={`${label}-${index}`}
                className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {label}
              </span>
            ))}
          </div>

          <div
            ref={gridRef}
            className="relative grid grid-cols-7 gap-0.5"
          >
            <DayFollower follower={hoverFollower} variant="hover" />
            <DayFollower follower={selectedFollower} variant="selected" />

            {visibleDays.map((day) => {
              const key = toDateKey(day);
              const isSelected = key === selectedKey;
              const isToday = key === todayKey;
              const isOutside = calendarOpen && !isSameMonth(day, viewDate);
              const isRestDay = day.getDay() === 0 || day.getDay() === 3;

              return (
                <button
                  key={key}
                  ref={setCellRef}
                  data-date-key={key}
                  type="button"
                  onClick={() => selectDay(day)}
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onFocus={() => setHoveredKey(key)}
                  onBlur={() => setHoveredKey(null)}
                  aria-pressed={isSelected}
                  aria-label={longDateFormatter.format(day)}
                  className={`relative z-10 flex min-h-11 w-full flex-col items-center justify-center rounded-xl text-xs transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                    isSelected
                      ? 'text-[var(--app-selected-fg)]'
                      : isOutside
                        ? 'text-slate-600'
                        : isRestDay
                          ? 'text-slate-500'
                          : 'text-slate-300'
                  } ${isToday && !isSelected ? 'ring-1 ring-emerald-400/40' : ''}`}
                >
                  <span className="font-mono text-sm font-semibold leading-none">
                    {day.getDate()}
                  </span>
                  {isToday ? (
                    <span
                      className={`absolute bottom-1 h-1 w-1 rounded-full ${
                        isSelected ? 'bg-[var(--app-selected-fg)]' : 'bg-emerald-400'
                      }`}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </AutoHeight>

      {/* Daily agenda */}
      <div className="mt-3 border-t border-[var(--app-card-border)] pt-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-100">
            <Sparkles size={14} className="text-blue-400" />
            Agenda
            <span className="surface-chip rounded-full px-1.5 py-0.5 text-xs font-mono text-slate-400">
              {items.length}
            </span>
          </h3>
          <span className="truncate text-xs text-slate-400">
            {selectedDateLabel}
          </span>
        </div>

        <AutoHeight key={`agenda-${selectedKey}-${items.length}`}>
          {items.length === 0 ? (
            <div className="surface-inset flex min-h-11 items-center gap-2 rounded-2xl border-dashed px-3 text-xs text-slate-500">
              <CalendarDays size={16} />
              Tidak ada agenda untuk tanggal ini.
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <motion.button
                  key={item.id ?? `${selectedKey}-${index}`}
                  type="button"
                  onClick={() => onItemClick?.(item)}
                  initial={
                    reduce ? { opacity: 0 } : { opacity: 0, y: 6 }
                  }
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.18,
                    delay: index * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="surface-inset flex min-h-11 w-full items-start gap-3 rounded-2xl p-3 text-left transition hover:border-slate-600 active:scale-[0.995]"
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      item.completed
                        ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400'
                        : 'surface-chip text-transparent'
                    }`}
                    aria-hidden="true"
                  >
                    {item.completed ? (
                      <Check size={14} strokeWidth={3} />
                    ) : null}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-semibold leading-snug ${
                        item.completed
                          ? 'text-slate-500 line-through'
                          : 'text-slate-100'
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.description ? (
                      <span
                        className={`mt-0.5 block text-xs leading-relaxed ${
                          item.completed ? 'text-slate-600' : 'text-slate-400'
                        }`}
                      >
                        {item.description}
                      </span>
                    ) : null}
                  </span>

                  <span className="mt-1 shrink-0 text-slate-600" aria-hidden="true">
                    <ChevronRight size={15} />
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </AutoHeight>
      </div>
    </section>
  );
}
