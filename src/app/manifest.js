export default function manifest() {
  return {
    name: 'HealthEngine V3 — Kebugaran & Nutrisi Indonesia',
    short_name: 'HealthEngine',
    description: 'Aplikasi latihan beban rumahan, anatomi otot interaktif, dan panduan nutrisi harian.',
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
