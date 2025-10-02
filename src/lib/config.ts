// src/lib/config.ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? 'https://api.serwex.in' : 'https://api.serwex.in');
