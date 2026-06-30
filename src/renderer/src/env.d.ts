/// <reference types="vite/client" />

// Mirrors HardwareMetrics in src/main/index.ts and src/preload/index.ts.
// Keeping this in sync is the only "duplication" in the project — it's the
// price of having separate TypeScript compilation contexts for main vs renderer.
interface HardwareMetrics {
  cpu: { usage: number; speed: number; temp: number | null }
  ram: { used: number; total: number }
  gpu: { name: string; load: number | null } | null
  game: { name: string; exe: string } | null
}

// Augments the global Window interface so TypeScript knows about window.api
// (which is injected by the preload script via contextBridge).
declare global {
  interface Window {
    api: {
      onMetricsUpdate: (callback: (metrics: HardwareMetrics) => void) => () => void
    }
  }
}
