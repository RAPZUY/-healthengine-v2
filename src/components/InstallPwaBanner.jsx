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
    <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-emerald-950/40 border border-blue-500/30 p-3.5 mb-4 shadow-lg shadow-black/40">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-lg shrink-0">
            📲
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-100 truncate">
              Pasang Aplikasi HealthEngine
            </h4>
            <p className="text-xs text-slate-400 truncate">
              Akses cepat tanpa browser & offline-ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="min-h-11 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition active:scale-95 flex items-center gap-1.5"
          >
            <span>Pasang di HP</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="min-h-11 min-w-11 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center justify-center text-sm"
            aria-label="Tutup banner instalasi"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Petunjuk instalasi khusus Safari iOS */}
      {showIOSGuide && isIOS && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-1.5">
          <p className="font-semibold text-emerald-400">Cara Pasang di iPhone / iPad (Safari):</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed">
            <li>Ketuk tombol <strong className="text-white">Share</strong> (ikon kotak dengan panah ke atas) di menu Safari bawah.</li>
            <li>Gulir ke bawah dan pilih opsi <strong className="text-white">&quot;Tambahkan ke Layar Utama&quot;</strong> (Add to Home Screen).</li>
            <li>Ketuk <strong className="text-white">&quot;Tambah&quot;</strong> di pojok kanan atas.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
