// Seeded deterministic RNG (Mulberry32). Identical output across renders/SSR.
export function seedRng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Box–Muller standard normal from two uniforms.
export function gaussian(rng: () => number): number {
  const u = Math.max(rng(), 1e-12)
  const v = rng()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function gaussian2D(rng: () => number, sigma = 1, cx = 0, cy = 0): [number, number] {
  return [cx + sigma * gaussian(rng), cy + sigma * gaussian(rng)]
}

// Sample from a 2D Gaussian mixture given component means + a shared sigma.
export function mixture2D(
  rng: () => number,
  modes: ReadonlyArray<readonly [number, number]>,
  sigma = 0.35,
): [number, number] {
  const m = modes[Math.floor(rng() * modes.length)]
  return [m[0] + sigma * gaussian(rng), m[1] + sigma * gaussian(rng)]
}

export type Pt = readonly [number, number]
