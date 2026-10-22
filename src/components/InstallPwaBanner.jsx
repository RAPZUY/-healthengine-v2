'use client';

import React, { useState, useEffect } from 'react';

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Cek apakah sudah berjalan dalam mode standalone (sudah terinstal)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandaloneMode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- display-mode is only readable on the client after hydration
      setIsStandalone(true);
      return;
    }

    // 2. Deteksi perangkat iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // 3. Tangani event beforeinstallprompt (Android / Chrome Desktop)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Jika sudah terinstal atau ditutup user, jangan render
  if (isStandalone || dismissed) {
    return null;
  }

  // Jika di Android/Chrome dan belum ada prompt siap & bukan iOS, sembunyikan banner
  if (!deferredPrompt && !isIOS) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setDismissed(true);
      }
    } else if (isIOS) {
      setShowIOSGuide((prev) => !prev);
    }
  };

  return (
    <div className="surface-card mb-4 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="accent-pill flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg">
            📲
          </div>
          <div className="min-w-0 pt-0.5">
            <h4 className="text-sm font-bold leading-snug text-slate-100">
              Pasang Aplikasi HealthEngine
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Akses cepat tanpa browser dan tetap terbuka saat offline.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 transition-colors hover:text-slate-100"
          aria-label="Tutup banner instalasi"
        >
          ✕
        </button>
      </div>

      <button
        type="button"
        onClick={handleInstallClick}
        aria-expanded={isIOS ? showIOSGuide : undefined}
        className="accent-solid mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition active:scale-[0.99]"
      >
        {isIOS ? 'Lihat Cara Pasang di iPhone' : 'Pasang di HP'}
      </button>

      {/* Petunjuk instalasi khusus Safari iOS */}
      {showIOSGuide && isIOS && (
        <div className="mt-3 space-y-1.5 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
          <p className="font-semibold text-emerald-400">
            Cara Pasang di iPhone / iPad (Safari):
          </p>
          <ol className="list-inside list-decimal space-y-1 leading-relaxed text-slate-300">
            <li>
              Ketuk tombol <strong className="text-slate-100">Share</strong> (ikon
              kotak dengan panah ke atas) di menu Safari bawah.
            </li>
            <li>
              Gulir ke bawah dan pilih opsi{' '}
              <strong className="text-slate-100">
                &quot;Tambahkan ke Layar Utama&quot;
              </strong>{' '}
              (Add to Home Screen).
            </li>
            <li>
              Ketuk <strong className="text-slate-100">&quot;Tambah&quot;</strong>{' '}
              di pojok kanan atas.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
