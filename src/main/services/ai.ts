import Anthropic from '@anthropic-ai/sdk'

export interface HardwareInput {
  cpuUsage: number
  cpuTemp: number | null
  gpuUsage: number | null
  gpuTemp: number | null
  ramUsedGB: number
  ramTotalGB: number
}

export interface Recommendation {
  title: string
  why: string
  where: string
  estimatedGain: string
  priority: 1 | 2 | 3
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function getRecommendations(
  hw: HardwareInput,
  gameName: string
): Promise<Recommendation[]> {
  const prompt = `You are a PC performance advisor. Based on the hardware metrics below, give 3-5 actionable recommendations to improve performance or stability in ${gameName}.

Hardware right now:
- CPU usage: ${hw.cpuUsage}%${hw.cpuTemp != null ? `, temp: ${hw.cpuTemp}°C` : ''}
- GPU usage: ${hw.gpuUsage != null ? `${hw.gpuUsage}%` : 'unknown'}${hw.gpuTemp != null ? `, temp: ${hw.gpuTemp}°C` : ''}
- RAM: ${hw.ramUsedGB} GB used / ${hw.ramTotalGB} GB total

Return ONLY a JSON array (no markdown, no explanation) where each element has:
- "title": short action title (max 8 words)
- "why": one sentence explaining why this helps given the current metrics
- "where": exactly where in the OS or game to make the change (Settings > ... or specific menu path)
- "estimatedGain": concrete expected improvement (e.g. "+5-10 FPS", "-8°C", "30% less stuttering")
- "priority": 1 (critical), 2 (recommended), or 3 (optional)

Sort by priority ascending. Be specific to the game and the current metric values.`

  const stream = await client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    thinking: { type: 'adaptive' },
    messages: [{ role: 'user', content: prompt }]
  })

  const response = await stream.finalMessage()

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in Claude response')
  }

  const raw = textBlock.text.trim()
  const jsonStart = raw.indexOf('[')
  const jsonEnd = raw.lastIndexOf(']')
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error(`Unexpected response format: ${raw.slice(0, 200)}`)
  }

  return JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as Recommendation[]
}
