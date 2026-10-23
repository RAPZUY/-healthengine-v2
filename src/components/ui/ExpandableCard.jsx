'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { motionTokens } from '@/components/ui/motion-primitives';

/**
 * Kartu dengan lipatan inline (bukan modal). Header selalu terlihat, panel
 * konten memuai dengan tinggi terukur + kurva ease-out yang singkat supaya
 * terasa seperti kartu yang dibuka, bukan halaman yang melompat.
 *
 * Catatan aksesibilitas: trigger utama adalah <button>, dan `headerAction`
 * dirender sebagai elemen saudara (bukan di dalam button) agar tombol aksi
 * seperti Swap tidak menghasilkan nested button.
 */
export default function ExpandableCard({
  header,
  children,
  headerAction,
  visibleContent,
  expanded,
  onToggle,
  defaultExpanded = false,
  className = '',
  headerClassName = '',
  contentClassName = '',
  expandLabel = 'Buka detail',
  collapseLabel = 'Tutup detail',
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;
  const reduce = useReducedMotion();
  const contentRef = useRef(null);
  const measuredHeight = useRef(0);
  const height = useMotionValue(0);
  const panelId = useId();

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.(!isExpanded);
      return;
    }
    setInternalExpanded((previous) => !previous);
  };

  // Ukur tinggi natural konten dan ikuti perubahan ukuran (mis. teks membungkus
  // ulang saat viewport berubah) tanpa mengunci tinggi ke nilai lama.
  useEffect(() => {
    const element = contentRef.current;
    if (!element) return undefined;

    const syncHeight = () => {
      measuredHeight.current = element.getBoundingClientRect().height;
      if (isExpanded) {
        if (reduce) {
          height.set(measuredHeight.current);
        } else {
          animate(height, measuredHeight.current, {
            duration: motionTokens.duration.standard,
            ease: motionTokens.ease.standard,
          });
        }
      }
    };

    syncHeight();

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(syncHeight);
      observer.observe(element);
    }
    window.addEventListener('resize', syncHeight);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, [isExpanded, height, reduce]);

  useEffect(() => {
    if (reduce) {
      height.set(isExpanded ? measuredHeight.current : 0);
      return undefined;
    }

    const controls = animate(height, isExpanded ? measuredHeight.current : 0, {
      duration: motionTokens.duration.standard,
      ease: motionTokens.ease.standard,
    });

    return () => controls.stop();
  }, [isExpanded, height, reduce]);

  return (
    <div
      className={`surface-card overflow-hidden rounded-2xl transition-colors duration-200 ${className}`}
    >
      <div className={`flex items-stretch ${headerClassName}`}>
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          aria-label={`${isExpanded ? collapseLabel : expandLabel}`}
          className="flex min-h-11 flex-1 touch-manipulation items-start gap-3 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-500 sm:px-6 sm:py-5"
        >
          <span className="min-w-0 flex-1">{header}</span>
          <span className="surface-chip mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400">
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: motionTokens.duration.fast, ease: motionTokens.ease.standard }
              }
              className="flex items-center justify-center"
            >
              <ChevronDown size={15} strokeWidth={2.4} aria-hidden="true" />
            </motion.span>
          </span>
        </button>

        {headerAction ? (
          <div className="flex shrink-0 items-start py-3 pr-4 sm:py-4 sm:pr-5">{headerAction}</div>
        ) : null}
      </div>

      {visibleContent ? (
        <div className="border-t border-[var(--app-card-border)] px-5 py-4 sm:px-6">
          {visibleContent}
        </div>
      ) : null}

      <motion.div
        id={panelId}
        style={{ height }}
        aria-hidden={!isExpanded}
        inert={!isExpanded ? true : undefined}
        className="overflow-hidden"
      >
        <div
          ref={contentRef}
          className={`px-5 pb-5 sm:px-6 sm:pb-6 ${contentClassName}`}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
