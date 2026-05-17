import { useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { seedRng } from './shared/random'
import { FAINT, SOURCE_COLOR, TARGET_COLOR } from './shared/colors'
import Frame from './shared/Frame'

const W = 640
const H = 360
const PAD = 30
const X_DOMAIN: [number, number] = [-3.4, 3.4]
const Y_DOMAIN: [number, number] = [-1.6, 1.6]
const N_PAIRS = 22
const MAX_REFLOW = 5

type Pt = [number, number]
type Pair = { x0: Pt; x1: Pt }

function segmentsCross(a1: Pt, a2: Pt, b1: Pt, b2: Pt): boolean {
  const d = (p: Pt, q: Pt, r: Pt) =>
    (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])
  const d1 = d(b1, b2, a1)
  const d2 = d(b1, b2, a2)
  const d3 = d(a1, a2, b1)
  const d4 = d(a1, a2, b2)
  return (
    ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
  )
}

// Run greedy decrossing to completion, recording every swap. We then replay
// fractions of that swap log to build intermediate stages — otherwise the
// 2D-bipartite matching converges to zero crossings in a single sweep and
// every stage after the first looks identical.
function recordSwaps(pairs: Pair[]): Array<[number, number]> {
  const out = pairs.map((p) => ({ x0: p.x0, x1: p.x1 }))
  const swaps: Array<[number, number]> = []
  let changed = true
  let safety = 0
  const cap = N_PAIRS * N_PAIRS * 4
  while (changed && safety < cap) {
    changed = false
    safety++
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        if (segmentsCross(out[i].x0, out[i].x1, out[j].x0, out[j].x1)) {
          swaps.push([i, j])
          const tmp = out[i].x1
          out[i].x1 = out[j].x1
          out[j].x1 = tmp
          changed = true
        }
      }
    }
  }
  return swaps
}

function reflowSteps(initial: Pair[], n: number): Pair[][] {
  const clone = (ps: Pair[]) => ps.map((p) => ({ x0: p.x0, x1: p.x1 }))
  const swaps = recordSwaps(initial)
  const stages: Pair[][] = [clone(initial)]
  for (let stage = 1; stage <= n; stage++) {
    const limit = Math.round((stage / n) * swaps.length)
    const cur = clone(initial)
    for (let k = 0; k < limit; k++) {
      const [i, j] = swaps[k]
      const tmp = cur[i].x1
      cur[i].x1 = cur[j].x1
      cur[j].x1 = tmp
    }
    stages.push(cur)
  }
  return stages
}

export default function ReflowDemo() {
  const [iter, setIter] = useState(0)

  const stages = useMemo(() => {
    const rng = seedRng(17)
    const sources: Pt[] = []
    const targets: Pt[] = []
    for (let i = 0; i < N_PAIRS; i++) {
      const sx = -2.6 + (i + 0.5) * (5.2 / N_PAIRS) + (rng() - 0.5) * 0.15
      const sy = -1.1 + (rng() - 0.5) * 0.3
      sources.push([sx, sy])
      const tx = -2.4 + (i + 0.5) * (4.8 / N_PAIRS) + (rng() - 0.5) * 0.15
      const ty = 1.0 + (rng() - 0.5) * 0.3
      targets.push([tx, ty])
    }
    // shuffle targets to create random initial coupling
    const order = sources.map((_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      const tmp = order[i]
      order[i] = order[j]
      order[j] = tmp
    }
    const initial: Pair[] = sources.map((s, i) => ({ x0: s, x1: targets[order[i]] }))
    return reflowSteps(initial, MAX_REFLOW)
  }, [])

  const pairs = stages[iter]
  const xScale = scaleLinear().domain(X_DOMAIN).range([PAD, W - PAD])
  const yScale = scaleLinear().domain(Y_DOMAIN).range([H - PAD, PAD])

  const crossings = useMemo(() => {
    let c = 0
    for (let i = 0; i < pairs.length; i++) {
      for (let j = i + 1; j < pairs.length; j++) {
        if (segmentsCross(pairs[i].x0, pairs[i].x1, pairs[j].x0, pairs[j].x1)) c++
      }
    }
    return c
  }, [pairs])

  return (
    <Frame
      caption="A geometric stand-in for Rectified Flow's reflow trick. Independent (x₀, x₁) sampling creates crossings — and crossings produce curved marginal trajectories. Here we decross segments directly; in a real model, reflow integrates the trained ODE to produce new (x₀, x₁) pairs that are then used to retrain. The visual effect — fewer crossings, straighter transport — is the same."
      controls={
        <div className="mt-3 flex items-center gap-3 text-xs text-primary/70 flex-wrap">
          <span className="font-mono select-none">Reflow</span>
          {Array.from({ length: MAX_REFLOW + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIter(i)}
              className={`w-7 h-7 inline-flex items-center justify-center rounded-sm border tabular-nums ${
                i === iter
                  ? 'border-primary/60 text-primary'
                  : 'border-primary/15 text-primary/60 hover:border-primary/40'
              }`}
            >
              {i}
            </button>
          ))}
          <span className="ml-auto text-primary/50 tabular-nums">
            crossings: {crossings}
          </span>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Reflow demo">
        <rect x={0} y={0} width={W} height={H} fill="white" rx={2} />

        {/* dashed reference lines for the two distributions */}
        <line
          x1={PAD}
          x2={W - PAD}
          y1={yScale(-1.1)}
          y2={yScale(-1.1)}
          stroke={FAINT}
          strokeDasharray="2 4"
        />
        <line
          x1={PAD}
          x2={W - PAD}
          y1={yScale(1.0)}
          y2={yScale(1.0)}
          stroke={FAINT}
          strokeDasharray="2 4"
        />

        <text x={PAD + 4} y={yScale(-1.1) + 14} fontSize="10" fill="#999">
          p₀
        </text>
        <text x={PAD + 4} y={yScale(1.0) - 6} fontSize="10" fill="#999">
          p₁
        </text>

        {/* pair lines */}
        {pairs.map((p, i) => (
          <line
            key={i}
            x1={xScale(p.x0[0])}
            y1={yScale(p.x0[1])}
            x2={xScale(p.x1[0])}
            y2={yScale(p.x1[1])}
            stroke="#1a1a1a"
            strokeWidth={0.9}
            opacity={0.5}
          />
        ))}
        {/* source markers */}
        {pairs.map((p, i) => (
          <circle key={`s-${i}`} cx={xScale(p.x0[0])} cy={yScale(p.x0[1])} r={2.4} fill={SOURCE_COLOR} />
        ))}
        {/* target markers */}
        {pairs.map((p, i) => (
          <circle key={`t-${i}`} cx={xScale(p.x1[0])} cy={yScale(p.x1[1])} r={2.4} fill={TARGET_COLOR} />
        ))}
      </svg>
    </Frame>
  )
}
