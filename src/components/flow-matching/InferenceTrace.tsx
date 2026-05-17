import { useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { line as d3line, curveCatmullRom } from 'd3-shape'
import { seedRng, gaussian2D } from './shared/random'
import { FAINT, MUTED } from './shared/colors'
import Frame from './shared/Frame'

const W = 640
const H = 380
const PAD = 24
const X_DOMAIN: [number, number] = [-3.2, 3.2]
const Y_DOMAIN: [number, number] = [-1.9, 1.9]

const MODES: ReadonlyArray<readonly [number, number]> = [
  [-1.7, 0.5],
  [1.6, 0.9],
  [0.4, -1.3],
]
const N_PATHS = 8
const SOURCE_SIGMA = 0.85
const STEP_CHOICES = [5, 20, 100] as const

function marginalVelocity(
  x: number,
  y: number,
  t: number,
  modes: ReadonlyArray<readonly [number, number]>,
): [number, number] {
  const oneMinusT = Math.max(1 - t, 1e-3)
  const var_xt = oneMinusT * oneMinusT + 0.04
  let zMax = -Infinity
  const logs: number[] = []
  for (const m of modes) {
    const dx = x - t * m[0]
    const dy = y - t * m[1]
    const l = -(dx * dx + dy * dy) / (2 * var_xt)
    logs.push(l)
    if (l > zMax) zMax = l
  }
  let Z = 0
  const ws: number[] = []
  for (const l of logs) {
    const e = Math.exp(l - zMax)
    ws.push(e)
    Z += e
  }
  let vx = 0
  let vy = 0
  for (let k = 0; k < modes.length; k++) {
    const w = ws[k] / (Z + 1e-12)
    vx += w * (modes[k][0] - x) / oneMinusT
    vy += w * (modes[k][1] - y) / oneMinusT
  }
  return [vx, vy]
}

function eulerTrace(x0: [number, number], steps: number): Array<[number, number]> {
  const dt = 1 / steps
  let x = x0[0]
  let y = x0[1]
  const out: Array<[number, number]> = [[x, y]]
  for (let i = 0; i < steps; i++) {
    const t = i * dt
    const [vx, vy] = marginalVelocity(x, y, t, MODES)
    x += vx * dt
    y += vy * dt
    out.push([x, y])
  }
  return out
}

export default function InferenceTrace() {
  const [stepIdx, setStepIdx] = useState(1) // default 20
  const steps = STEP_CHOICES[stepIdx]

  const x0s = useMemo<Array<[number, number]>>(() => {
    const rng = seedRng(23)
    return Array.from({ length: N_PATHS }, () => gaussian2D(rng, SOURCE_SIGMA))
  }, [])

  const xScale = scaleLinear().domain(X_DOMAIN).range([PAD, W - PAD])
  const yScale = scaleLinear().domain(Y_DOMAIN).range([H - PAD, PAD])

  // Reference: high-resolution trace
  const reference = useMemo(() => x0s.map((x0) => eulerTrace(x0, 200)), [x0s])
  const traces = useMemo(() => x0s.map((x0) => eulerTrace(x0, steps)), [x0s, steps])

  const lineGen = d3line<[number, number]>()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(curveCatmullRom)

  const lineStep = d3line<[number, number]>()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))

  return (
    <Frame
      caption="Sampling means solving the ODE dxₜ = vθ(xₜ, t) dt by stepping forward from a noise sample. The gray curve is the smooth flow (high-resolution reference); the black polyline is Euler with N steps. Dashed red segments show the endpoint error vs. the reference. With few steps, the polyline cuts corners through curved regions and lands off-target; with many, it tracks the smooth flow. Curved fields buy accuracy with function evaluations."
      controls={
        <div className="mt-3 flex items-center gap-3 text-xs text-primary/70">
          <span className="font-mono select-none">N steps</span>
          {STEP_CHOICES.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setStepIdx(i)}
              className={`px-2 py-0.5 rounded-sm border tabular-nums ${
                i === stepIdx
                  ? 'border-primary/60 text-primary'
                  : 'border-primary/15 text-primary/60 hover:border-primary/40'
              }`}
            >
              {s}
            </button>
          ))}
          <span className="ml-auto text-primary/45">
            {steps === 5
              ? 'coarse — visible Euler error'
              : steps === 20
                ? 'moderate — tracks the field reasonably well'
                : 'fine — close to the continuous flow'}
          </span>
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Inference trace">
        <rect x={0} y={0} width={W} height={H} fill="white" rx={2} />

        <line x1={xScale(0)} x2={xScale(0)} y1={PAD} y2={H - PAD} stroke={FAINT} strokeWidth={0.5} />
        <line x1={PAD} x2={W - PAD} y1={yScale(0)} y2={yScale(0)} stroke={FAINT} strokeWidth={0.5} />

        {/* reference smooth flow */}
        {reference.map((path, i) => (
          <path key={`r-${i}`} d={lineGen(path) ?? ''} fill="none" stroke={MUTED} strokeWidth={1} opacity={0.32} />
        ))}

        {/* Endpoint-error: line from Euler terminus to reference terminus.
            Skipped when N is fine (errors imperceptible). */}
        {steps < 100 &&
          traces.map((path, i) => {
            const ref = reference[i]
            const a = path[path.length - 1]
            const b = ref[ref.length - 1]
            const dx = a[0] - b[0]
            const dy = a[1] - b[1]
            if (Math.hypot(dx, dy) < 0.04) return null
            return (
              <line
                key={`e-${i}`}
                x1={xScale(a[0])}
                y1={yScale(a[1])}
                x2={xScale(b[0])}
                y2={yScale(b[1])}
                stroke="#d96a4a"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.7}
              />
            )
          })}

        {/* Euler trace as polyline with dots at each step */}
        {traces.map((path, i) => (
          <g key={`t-${i}`}>
            <path d={lineStep(path) ?? ''} fill="none" stroke="#1a1a1a" strokeWidth={1.2} opacity={0.85} />
            {path.map((pt, j) => (
              <circle
                key={j}
                cx={xScale(pt[0])}
                cy={yScale(pt[1])}
                r={j === 0 ? 3 : j === path.length - 1 ? 2.6 : 1.5}
                fill={j === 0 ? '#1a1a1a' : '#7c79f4'}
                opacity={j === 0 ? 1 : 0.9}
              />
            ))}
          </g>
        ))}

        {/* mode markers */}
        {MODES.map((m, i) => (
          <circle key={i} cx={xScale(m[0])} cy={yScale(m[1])} r={4} fill="white" stroke="#7c79f4" strokeWidth={1.4} />
        ))}
      </svg>
    </Frame>
  )
}
