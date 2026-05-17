// Shared palette for flow-matching visualizations.
// Matches the site palette: neutral grayscale + purple accent (#a3a2fc).
export const SOURCE_COLOR = '#1a1a1a'
export const TARGET_COLOR = '#7c79f4'
export const TARGET_COLOR_SOFT = '#a3a2fc'
export const TARGET_COLOR_ALT = '#e08158' // orange — for two-target comparisons
export const TARGET_COLOR_ALT_SOFT = '#f4b89c'
export const MUTED = '#999999'
export const FAINT = '#d9d9d9'
export const GRID = '#f0f0f0'
export const AXIS = '#cccccc'

// Velocity-magnitude ramp (low → high). Cool → warm.
const RAMP = ['#3a3a6a', '#5a6db3', '#7ea6c8', '#c8c987', '#e6a36b', '#d96a4a']

export function magnitudeColor(t: number): string {
  const x = Math.max(0, Math.min(1, t))
  const idx = x * (RAMP.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.min(RAMP.length - 1, lo + 1)
  const f = idx - lo
  return lerpHex(RAMP[lo], RAMP[hi], f)
}

function lerpHex(a: string, b: string, t: number): string {
  const pa = hexToRgb(a)
  const pb = hexToRgb(b)
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t)
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t)
  const b2 = Math.round(pa[2] + (pb[2] - pa[2]) * t)
  return `rgb(${r}, ${g}, ${b2})`
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const v = parseInt(h, 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}
