// src/lib/config.ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? 'http://194.164.148.133:8003' : 'http://194.164.148.133:8003');
