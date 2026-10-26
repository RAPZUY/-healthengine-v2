/**
 * Aturan nama panggilan HealthEngine: huruf alfabet murni, 3-6 karakter.
 * Dipakai bersama oleh kartu Beranda dan Modal Edit Profil supaya validasi
 * tidak pernah berbeda di dua tempat.
 */
export const USER_NAME_PATTERN = /^[a-zA-Z]{3,6}$/;

export const sanitizeUserName = (value) =>
  String(value ?? '')
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 6);
