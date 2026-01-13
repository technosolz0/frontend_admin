// src/lib/config.ts

// Application modes
export enum AppMode {
  DEV = 'dev',
  TEST = 'test',
  LIVE = 'live'
}

// Get current app mode from environment or default to live
export const CURRENT_APP_MODE: AppMode = (process.env.NEXT_PUBLIC_APP_MODE as AppMode) || AppMode.LIVE;

// Dynamic API base URL based on current app mode
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api.serwex.in';


// Helper function to get current environment
export const getCurrentEnvironment = (): string => CURRENT_APP_MODE;

// Function to set app mode (for runtime switching if needed)
export const setAppMode = (mode: AppMode): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('app_mode', mode);
    console.log(`🔄 Frontend Admin - App mode changed to: ${mode}`);
    // Note: In a real app, you might need to reload or update state
  }
};

// Function to get app mode from localStorage (fallback to env)
export const getAppMode = (): AppMode => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('app_mode') as AppMode;
    if (stored && Object.values(AppMode).includes(stored)) {
      return stored;
    }
  }
  return CURRENT_APP_MODE;
};
