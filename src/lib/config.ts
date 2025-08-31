// src/lib/config.ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? 'http://localhost:8000' : 'http://127.0.0.1:8000');
