export default function manifest() {
  return {
    name: 'HealthEngine V4.1 — Kebugaran, Nutrisi & Lari',
    short_name: 'HealthEngine',
    description:
      'Latihan beban rumahan, timer istirahat, verifikasi gerakan, pencatat lari, dan panduan nutrisi harian dengan tema gelap atau terang.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
  };
}
