import { useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { FAINT, MUTED, magnitudeColor } from './shared/colors'
import TimeSlider from './shared/TimeSlider'
import Frame from './shared/Frame'

const W = 640
const H = 380
const PAD = 24
const X_DOMAIN: [number, number] = [-3, 3]
const Y_DOMAIN: [number, number] = [-1.9, 1.9]

const MODES: ReadonlyArray<readonly [number, number]> = [
  [-1.7, 0.5],
  [1.6, 0.9],
  [0.4, -1.3],
]
const GRID_X = 26
const GRID_Y = 16
const ARROW_MAX = 14
const MAG_CAP = 3.2

// Closed-form marginal velocity field for OT flow from N(0,I) to a Gaussian
// mixture: a posterior-weighted average of the conditional velocities
// (m − x)/(1 − t). The modes carry a small σ_target² = 0.04 (the +0.04 in
// var_xt) so the posterior stays well-conditioned as t → 1; with true point
// masses the weights saturate and the field blows up near the endpoint.
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

export default function VelocityField() {
  const [t, setT] = useState(0.2)
  const [playing, setPlaying] = useState(false)
  const [colorByMag, setColorByMag] = useState(true)

  const xScale = scaleLinear().domain(X_DOMAIN).range([PAD, W - PAD])
  const yScale = scaleLinear().domain(Y_DOMAIN).range([H - PAD, PAD])

  const arrows = useMemo(() => {
    const out: Array<{
      x: number
      y: number
      vx: number
      vy: number
      mag: number
    }> = []
    for (let i = 0; i < GRID_X; i++) {
      for (let j = 0; j < GRID_Y; j++) {
        const x = X_DOMAIN[0] + ((i + 0.5) / GRID_X) * (X_DOMAIN[1] - X_DOMAIN[0])
        const y = Y_DOMAIN[0] + ((j + 0.5) / GRID_Y) * (Y_DOMAIN[1] - Y_DOMAIN[0])
        out.push({ x, y, vx: 0, vy: 0, mag: 0 })
      }
    }
    return out
  }, [])

  const tClamped = Math.min(t, 0.96)
  const evaluated = arrows.map((a) => {
    const [vx, vy] = marginalVelocity(a.x, a.y, tClamped, MODES)
    const mag = Math.hypot(vx, vy)
    return { ...a, vx, vy, mag }
  })

  return (
    <Frame
      caption="The marginal velocity field vₜ(x) plotted across space, evaluated at each time t. Each arrow tells a particle which way to move to stay on the flow. Toggle the color to map arrow length to velocity magnitude."
      controls={
        <>
          <TimeSlider
            t={t}
            setT={setT}
            playing={playing}
            setPlaying={setPlaying}
            loopSeconds={6}
          />
          <div className="mt-2">
            <label className="inline-flex items-center gap-2 text-xs text-primary/70 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={colorByMag}
                onChange={(e) => setColorByMag(e.target.checked)}
                className="accent-primary"
              />
              Color arrows by magnitude
            </label>
          </div>
        </>
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Velocity field"
      >
        <rect x={0} y={0} width={W} height={H} fill="white" rx={2} />

        {/* axes */}
        <line
          x1={xScale(0)}
          x2={xScale(0)}
          y1={PAD}
          y2={H - PAD}
          stroke={FAINT}
          strokeWidth={0.5}
        />
        <line
          x1={PAD}
          x2={W - PAD}
          y1={yScale(0)}
          y2={yScale(0)}
          stroke={FAINT}
          strokeWidth={0.5}
        />

        {/* arrows */}
        <defs>
          <marker
            id="arrowhead-mag"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="context-stroke" />
          </marker>
        </defs>
        {evaluated.map((a, i) => {
          const m = Math.min(a.mag, MAG_CAP)
          const x1 = xScale(a.x)
          const y1 = yScale(a.y)
          // Map the (unit-length) velocity direction into pixel space.
          const dxp = xScale(a.x + a.vx) - x1
          const dyp = yScale(a.y + a.vy) - y1
          const lenp = Math.hypot(dxp, dyp)
          const targetLen = (m / MAG_CAP) * ARROW_MAX
          const k = lenp > 0 ? targetLen / lenp : 0
          const xe = x1 + dxp * k
          const ye = y1 + dyp * k
          const color = colorByMag ? magnitudeColor(m / MAG_CAP) : MUTED
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={xe}
              y2={ye}
              stroke={color}
              strokeWidth={1.1}
              markerEnd="url(#arrowhead-mag)"
              opacity={0.85}
            />
          )
        })}

        {/* mode markers */}
        {MODES.map((m, i) => (
          <circle
            key={i}
            cx={xScale(m[0])}
            cy={yScale(m[1])}
            r={3}
            fill="#7c79f4"
            opacity={0.8}
          />
        ))}
      </svg>
    </Frame>
  )
}
