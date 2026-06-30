import { contextBridge, ipcRenderer } from 'electron'
import type { IpcRendererEvent } from 'electron'

// This shape must stay in sync with HardwareMetrics in src/main/index.ts
// and the declaration in src/renderer/src/env.d.ts
export interface HardwareMetrics {
  cpu: { usage: number; speed: number; temp: number | null }
  ram: { used: number; total: number }
  gpu: { name: string; load: number | null } | null
}

/**
 * contextBridge.exposeInMainWorld is the ONLY safe way to pass data from
 * the Node.js preload context into the sandboxed renderer (React app).
 *
 * Everything listed under 'api' becomes window.api in the renderer.
 * Nothing else from Node.js or Electron leaks across this boundary.
 */
contextBridge.exposeInMainWorld('api', {
  /**
   * Subscribe to live hardware metrics sent from the main process.
   *
   * Usage in React:
   *   useEffect(() => {
   *     const unsub = window.api.onMetricsUpdate(data => setMetrics(data))
   *     return unsub  // removes the listener on unmount
   *   }, [])
   */
  onMetricsUpdate: (callback: (metrics: HardwareMetrics) => void): (() => void) => {
    const handler = (_e: IpcRendererEvent, data: HardwareMetrics) => callback(data)
    ipcRenderer.on('metrics-update', handler)
    // Return a cleanup function so React effects can unsubscribe properly
    return () => ipcRenderer.removeListener('metrics-update', handler)
  }
})
