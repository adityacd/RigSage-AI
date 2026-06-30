import { processes } from 'systeminformation'
import { GAME_DB } from './gameDb'

export interface DetectedGame {
  name: string  // Display name, e.g. "Cyberpunk 2077"
  exe: string   // Actual process name, e.g. "Cyberpunk2077.exe"
}

/**
 * Scans the running process list and returns the first match found in GAME_DB.
 *
 * Why a separate polling interval (not bundled with hardware metrics):
 * si.processes() queries WMI on Windows, which can take 300–800ms. Keeping
 * it on its own 5-second timer prevents it from delaying the 2-second
 * hardware poll.
 */
export async function detectRunningGame(): Promise<DetectedGame | null> {
  try {
    const { list } = await processes()

    for (const proc of list) {
      const exeLower = proc.name.toLowerCase()
      const gameName = GAME_DB[exeLower]
      if (gameName) {
        return { name: gameName, exe: proc.name }
      }
    }

    return null
  } catch {
    // Fail silently — game detection is non-critical
    return null
  }
}
