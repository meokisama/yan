/**
 * yan-fx: the tiny effects layer behind every Yan component.
 *
 * One fixed, click-through <canvas> overlays the page and draws short-lived
 * effects in a moe key-animation vocabulary:
 *
 *   burst()       particles: sparkles, hearts, stars, petals, bubbles, cloud puffs
 *   puff()        "pofu" clouds that roll off a corner, animated on twos
 *   speedLines()  manga emphasis lines around an element
 *   bloom()       a sakura that unfolds around an element, then lets its petals go
 *   emote()       a manga emotion mark (!, ♪, Zzz) popping off an element
 *   fly()         a little comet travelling from one element to another
 *   glow()        a soft warm bloom that swells and fades on an element
 *   impact()      glow + lines + puffs: the full "it landed" beat
 *
 * plus Japanese onomatopoeia stickers (ぷにっ, キラッ, ...). The canvas is created
 * lazily and its loop stops as soon as nothing is on screen. Everything is a
 * no-op under `prefers-reduced-motion: reduce`.
 *
 * No dependencies. Framework-agnostic.
 */

export type YanIntensity = "off" | "subtle" | "kawaii"

export type FxShape = "sparkle" | "heart" | "star" | "petal" | "bubble" | "dot" | "puff"

export type FxPoint = { x: number; y: number }

export type FxTarget = FxPoint | Element

export interface BurstOptions {
  /** Shapes to pick from, in turn. */
  shapes?: FxShape[]
  /** Number of particles. */
  count?: number
  /** Onomatopoeia sticker drawn at the origin, e.g. "ぷにっ". */
  word?: string | null
  /** How the sticker arrives: `"pop"` springs up from nothing, `"slam"` lands from above like manga lettering. */
  wordStyle?: "pop" | "slam"
  /**
   * Colors to pick from. Accepts any CSS color, or a custom property name
   * like "--yan-fx-1", which is resolved against :root.
   */
  colors?: string[]
  /** Velocity multiplier. 1 = default. */
  power?: number
  /** Base particle size in CSS px. */
  size?: number
  /** Direction of the burst in radians (0 = right, -PI/2 = up). */
  angle?: number
  /** Arc the particles spread over, in radians. Full circle by default. */
  spread?: number
  /** Downward acceleration in px/s². Bubbles and puffs always float up. */
  gravity?: number
  /** Draw a soft shockwave ring at the origin. */
  ring?: boolean
  /** Draw manga emphasis lines around the origin. */
  lines?: boolean
}

const DEFAULT_COLORS = ["--yan-fx-1", "--yan-fx-2", "--yan-fx-3", "--yan-fx-4", "--yan-fx-5"]
const FALLBACK_COLORS = ["#ff9cc6", "#c9a7ff", "#8fe3c0", "#ffe27a", "#9fd3ff"]
const MAX_PARTICLES = 400

/** Ready-made recipes so every component feels like part of one family. */
export const fxPresets: Record<Exclude<YanIntensity, "off">, BurstOptions> = {
  subtle: { shapes: ["sparkle", "dot"], count: 7, power: 0.7, size: 7, word: null },
  kawaii: { shapes: ["sparkle", "heart", "star", "dot"], count: 10, power: 1, size: 11, ring: true, wordStyle: "slam" },
}

/** Words Yan reaches for when a component doesn't specify one. */
export const fxWords = ["ぷにっ", "キラッ", "ぽよん", "ふわっ", "ドキッ"]

export function pickWord(words: readonly string[] = fxWords) {
  return words[Math.floor(Math.random() * words.length)]
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  )
}

const active = () => typeof window !== "undefined" && !prefersReducedMotion()

function centerOf(el: Element): FxPoint {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

const pointOf = (t: FxTarget): FxPoint => (t instanceof Element ? centerOf(t) : { x: t.x, y: t.y })

/* ------------------------------------------------------------------------ */
/* Public effects                                                            */
/* ------------------------------------------------------------------------ */

/** Fire a burst at a viewport point or at the center of an element. */
export function burst(target: FxTarget, options: BurstOptions = {}) {
  if (!active()) return
  engine().burst(pointOf(target), options)
}

/**
 * Burst for a pointer/keyboard activation: uses the pointer position when the
 * event came from a pointer, the element's center otherwise (Enter / Space).
 */
export function burstFromEvent(
  event: { clientX?: number; clientY?: number; detail?: number; currentTarget: EventTarget | null },
  options: BurstOptions = {}
) {
  const el = event.currentTarget instanceof Element ? event.currentTarget : null
  const fromPointer =
    event.detail !== 0 && typeof event.clientX === "number" && event.clientX + (event.clientY ?? 0) > 0
  if (fromPointer) burst({ x: event.clientX!, y: event.clientY! }, options)
  else if (el) burst(el, options)
}

export interface PuffOptions {
  count?: number
  /** Direction the clouds roll in, radians (0 = right, -PI/2 = up). */
  angle?: number
  spread?: number
  size?: number
  power?: number
  /** Outline color. CSS color or custom property name. */
  color?: string
}

/** "Pofu": little cumulus clouds that roll away and dissolve. */
export function puff(target: FxTarget, o: PuffOptions = {}) {
  burst(target, {
    shapes: ["puff"],
    count: o.count ?? 3,
    angle: o.angle ?? -Math.PI / 2,
    spread: o.spread ?? 1.2,
    size: o.size ?? 11,
    power: o.power ?? 0.6,
    colors: [o.color ?? "--yan-fx-1"],
  })
}

export interface LinesOptions {
  color?: string
  count?: number
  /** How far the lines reach out, in px. */
  reach?: number
}

/** Manga emphasis lines radiating around an element (or a point), redrawn each frame like hand-inked cels. */
export function speedLines(target: FxTarget, o: LinesOptions = {}) {
  if (!active()) return
  let c: FxPoint
  let rx = 14
  let ry = 14
  if (target instanceof Element) {
    const r = target.getBoundingClientRect()
    c = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    rx = r.width / 2 + 10
    ry = r.height / 2 + 10
  } else c = target
  const color = resolveColors([o.color ?? "--yan-fx-1"])[0]
  const n = o.count ?? Math.round(Math.min(26, 12 + (rx + ry) / 14))
  const reach = o.reach ?? 26

  engine().draw(0.26, (ctx, t, k) => {
    const rnd = seeded(Math.floor(t * 22) + 1)
    ctx.fillStyle = color
    ctx.globalAlpha = 1 - k * k
    ctx.beginPath()
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rnd() * 0.34
      const inner = 1 + rnd() * 0.14 + k * 0.3
      const px = Math.cos(a) * rx * inner
      const py = Math.sin(a) * ry * inner
      const d = Math.hypot(px, py) || 1
      const ux = px / d
      const uy = py / d
      const len = reach * (0.45 + rnd()) * (1 - k * 0.4)
      const half = len * (0.06 + rnd() * 0.05)
      const fx = px + ux * len
      const fy = py + uy * len
      ctx.moveTo(c.x + px, c.y + py)
      ctx.lineTo(c.x + fx - uy * half, c.y + fy + ux * half)
      ctx.lineTo(c.x + fx + uy * half, c.y + fy - ux * half)
      ctx.closePath()
    }
    ctx.fill()
  })
}

/**
 * A sakura blooms around the target: five petals unfold from behind it, sway
 * for a moment, then let go and drift down.
 */
export function bloom(target: FxTarget, o: { color?: string; size?: number } = {}) {
  if (!active()) return
  const c = pointOf(target)
  const half =
    target instanceof Element
      ? Math.max(target.getBoundingClientRect().width, target.getBoundingClientRect().height) / 2
      : 12
  const r = o.size ?? half * 0.8
  const [color, light] = resolveColors([o.color ?? "--yan-fx-1", "--yan-sakura"])
  const tilt = (Math.random() - 0.5) * 0.5
  const e = engine()
  let released = false

  e.draw(0.95, (ctx, t) => {
    const leaving = Math.max(0, (t - 0.55) / 0.4)
    if (leaving > 0 && !released) {
      released = true
      e.burst(c, { shapes: ["petal"], count: 5, power: 0.38, size: r * 0.8, colors: [color, light] })
      e.burst(c, { shapes: ["sparkle"], count: 3, power: 0.5, size: 7, colors: ["--yan-fx-4"] })
    }
    for (let i = 0; i < 5; i++) {
      // each petal opens a beat after the one before it
      const u = Math.min(1, Math.max(0, (t - i * 0.045) / 0.3))
      const open = easeOutBack(u) * (1 - leaving)
      if (open <= 0.02) continue
      const a = -Math.PI / 2 + (i / 5) * Math.PI * 2 + tilt + Math.sin(t * 7 + i) * 0.05
      const pr = r * open
      const d = half * 0.9 + pr * 0.82
      ctx.save()
      ctx.globalAlpha = 0.95 * (1 - leaving)
      ctx.translate(c.x + Math.cos(a) * d, c.y + Math.sin(a) * d)
      ctx.rotate(a + Math.PI / 2)
      ctx.fillStyle = color
      ctx.beginPath()
      tracePetal(ctx, pr)
      ctx.fill()
      // a paler heart to the petal, so it reads as soft rather than flat
      ctx.globalAlpha *= 0.55
      ctx.fillStyle = "#ffffff"
      ctx.translate(0, -pr * 0.12)
      ctx.beginPath()
      tracePetal(ctx, pr * 0.5)
      ctx.fill()
      ctx.restore()
    }
  })
}

/** A manga emotion mark ("！", "♪", "Zzz", "♡") that pops off the corner of an element and drifts up. */
export function emote(
  target: FxTarget,
  glyph: string,
  o: { color?: string; size?: number; side?: "left" | "right" } = {}
) {
  if (!active()) return
  const side = o.side ?? "right"
  let p: FxPoint
  if (target instanceof Element) {
    const r = target.getBoundingClientRect()
    p = { x: side === "right" ? r.right - 1 : r.left + 1, y: r.top - 5 }
  } else p = { x: target.x, y: target.y }
  engine().sticker({
    text: glyph,
    x: p.x,
    y: p.y,
    size: o.size ?? 17,
    life: 0.95,
    rise: 30,
    rot: (side === "right" ? 1 : -1) * (0.16 + Math.random() * 0.14),
    color: resolveColors([o.color ?? "--yan-fx-ink"])[0],
    slam: false,
  })
}

/** A little comet (a heart by default) that arcs from one place to another and pops on arrival. */
export function fly(
  from: FxTarget,
  to: FxTarget,
  o: { color?: string; size?: number; duration?: number; onArrive?: () => void; arrive?: BurstOptions } = {}
) {
  if (!active()) {
    o.onArrive?.()
    return
  }
  const a = pointOf(from)
  const b = pointOf(to)
  const dist = Math.hypot(b.x - a.x, b.y - a.y)
  const ctrl = { x: (a.x + b.x) / 2 + (b.y - a.y) * 0.25, y: (a.y + b.y) / 2 - Math.max(24, dist * 0.35) }
  const color = resolveColors([o.color ?? "--yan-fx-1"])[0]
  const size = o.size ?? 9
  const e = engine()
  let lastTrail = 0

  e.draw(
    o.duration ?? Math.min(0.55, 0.28 + dist / 1400),
    (ctx, t, k) => {
      const u = k * k * (3 - 2 * k)
      const v = 1 - u
      const x = v * v * a.x + 2 * v * u * ctrl.x + u * u * b.x
      const y = v * v * a.y + 2 * v * u * ctrl.y + u * u * b.y
      if (t - lastTrail > 0.03) {
        lastTrail = t
        e.burst({ x, y }, { shapes: ["dot", "sparkle"], count: 1, power: 0.12, size: 5, gravity: 80, colors: [color] })
      }
      ctx.translate(x, y)
      ctx.rotate(Math.sin(t * 22) * 0.3)
      ctx.fillStyle = color
      ctx.beginPath()
      traceHeart(ctx, size * (0.8 + 0.4 * Math.sin(k * Math.PI)))
      ctx.fill()
    },
    () => {
      e.burst(b, { shapes: ["heart", "sparkle"], count: 7, power: 0.55, size: 8, ring: true, colors: [color], ...o.arrive })
      o.onArrive?.()
    }
  )
}

/**
 * A soft bloom: the element warms up a little and settles back, like a blush.
 * Deliberately eased and gentle. Yan never hard-flashes.
 */
export function glow(el: Element, duration = 460) {
  if (!active() || !("animate" in el)) return
  el.animate(
    [
      { filter: "brightness(1) saturate(1)" },
      { filter: "brightness(1.12) saturate(1.12)", offset: 0.35 },
      { filter: "brightness(1) saturate(1)" },
    ],
    { duration, easing: "ease-in-out" }
  )
}

/** The full "it landed" beat: a soft glow, emphasis lines and clouds rolling off both ends. */
export function impact(el: Element, o: { color?: string; glow?: boolean; lines?: boolean } = {}) {
  if (!active()) return
  if (o.glow !== false) glow(el)
  if (o.lines !== false) speedLines(el, { color: o.color })
  const r = el.getBoundingClientRect()
  const y = r.bottom - Math.min(8, r.height / 3)
  puff({ x: r.left + 6, y }, { angle: -Math.PI * 0.9, spread: 0.7, count: 2, color: o.color })
  puff({ x: r.right - 6, y }, { angle: -Math.PI * 0.1, spread: 0.7, count: 2, color: o.color })
}

/* ------------------------------------------------------------------------ */
/* Engine                                                                    */
/* ------------------------------------------------------------------------ */

type Particle = {
  shape: FxShape
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  size: number
  color: string
  t: number
  life: number
  gravity: number
  phase: number
  // puffs are drawn "on twos": position and size only update every other frame
  step: number
  dx: number
  dy: number
}

type Sticker = {
  text: string
  x: number
  y: number
  t: number
  life: number
  size: number
  rise: number
  scale: number
  vScale: number
  rot: number
  color: string
  slam: boolean
}

type Ring = { x: number; y: number; t: number; life: number; size: number; color: string }

type Drawing = {
  t: number
  life: number
  draw: (ctx: CanvasRenderingContext2D, t: number, k: number) => void
  end?: () => void
}

let instance: FxEngine | null = null

function engine() {
  if (!instance) instance = new FxEngine()
  return instance
}

class FxEngine {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private particles: Particle[] = []
  private stickers: Sticker[] = []
  private rings: Ring[] = []
  private drawings: Drawing[] = []
  private raf = 0
  private last = 0
  private dpr = 1

  burst(origin: FxPoint, o: BurstOptions) {
    this.mount()
    const colors = resolveColors(o.colors ?? DEFAULT_COLORS)
    const shapes = o.shapes ?? ["sparkle"]
    const count = Math.max(0, Math.min(o.count ?? 10, MAX_PARTICLES - this.particles.length))
    const power = o.power ?? 1
    const size = o.size ?? 9
    const spread = o.spread ?? Math.PI * 2
    const angle = o.angle ?? -Math.PI / 2

    for (let i = 0; i < count; i++) {
      const shape = shapes[i % shapes.length]
      const a = angle + (Math.random() - 0.5) * spread
      const isBubble = shape === "bubble"
      const isPetal = shape === "petal"
      const isPuff = shape === "puff"
      const speed = (isPuff ? 70 + Math.random() * 90 : 140 + Math.random() * 220) * power
      this.particles.push({
        shape,
        x: origin.x,
        y: origin.y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - (isPuff ? 0 : isBubble ? 60 : 40),
        rot: Math.random() * Math.PI * 2,
        vr: isPuff ? 0 : (Math.random() - 0.5) * (isPetal ? 6 : 10),
        size: size * (isPuff ? 0.75 + Math.random() * 0.5 : 0.6 + Math.random() * 0.7),
        color: colors[Math.floor(Math.random() * colors.length)],
        t: 0,
        life: isPuff ? 0.42 + Math.random() * 0.22 : 0.55 + Math.random() * 0.45 + (isPetal || isBubble ? 0.6 : 0),
        gravity: isPuff ? -50 : isBubble ? -140 : isPetal ? 120 : (o.gravity ?? 420),
        phase: Math.random() * Math.PI * 2,
        step: -1,
        dx: origin.x,
        dy: origin.y,
      })
    }

    if (o.ring) {
      this.rings.push({ x: origin.x, y: origin.y, t: 0, life: 0.45, size: size * 4.2 * power, color: colors[0] })
    }

    if (o.lines) speedLines(origin, { color: o.colors?.[0] })

    if (o.word) {
      this.sticker({
        text: o.word,
        x: origin.x,
        y: origin.y - 20,
        size: 26,
        life: 0.95,
        rise: 26,
        rot: (Math.random() - 0.5) * 0.36,
        color: resolveColors(["--yan-fx-ink"])[0] ?? "#e0569b",
        slam: o.wordStyle === "slam",
      })
    }

    this.wake()
  }

  sticker(s: Omit<Sticker, "t" | "scale" | "vScale">) {
    this.mount()
    this.stickers.push({ ...s, t: 0, scale: s.slam ? 2.3 : 0, vScale: 0 })
    this.wake()
  }

  draw(life: number, draw: Drawing["draw"], end?: () => void) {
    this.mount()
    this.drawings.push({ t: 0, life, draw, end })
    this.wake()
  }

  private wake() {
    if (this.raf) return
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  private mount() {
    if (this.canvas?.isConnected) return
    const c = document.createElement("canvas")
    c.setAttribute("aria-hidden", "true")
    c.dataset.yanFx = ""
    Object.assign(c.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "2147483647",
    })
    document.body.appendChild(c)
    this.canvas = c
    this.ctx = c.getContext("2d")
    this.resize()
    window.addEventListener("resize", this.resize)
  }

  private resize = () => {
    if (!this.canvas) return
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = Math.round(window.innerWidth * this.dpr)
    this.canvas.height = Math.round(window.innerHeight * this.dpr)
  }

  private tick = (now: number) => {
    const ctx = this.ctx
    if (!ctx || !this.canvas) return
    const dt = Math.max(0, Math.min((now - this.last) / 1000, 1 / 30))
    this.last = now

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)

    // Drawings may add particles (fly) or finish and fire callbacks, so walk a copy.
    const drawings = this.drawings
    this.drawings = []
    for (const d of drawings) {
      d.t += dt
      if (d.t >= d.life) {
        d.end?.()
        continue
      }
      ctx.save()
      d.draw(ctx, d.t, d.t / d.life)
      ctx.restore()
      this.drawings.push(d)
    }

    this.rings = this.rings.filter((r) => {
      r.t += dt
      if (r.t >= r.life) return false
      const k = r.t / r.life
      const e = 1 - Math.pow(1 - k, 3)
      ctx.save()
      ctx.globalAlpha = (1 - k) * 0.8
      ctx.strokeStyle = r.color
      ctx.lineWidth = 1 + (1 - k) * 5
      ctx.beginPath()
      ctx.arc(r.x, r.y, 6 + r.size * e, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
      return true
    })

    this.particles = this.particles.filter((p) => {
      p.t += dt
      if (p.t >= p.life) return false
      const drag = Math.exp(-(p.shape === "puff" ? 4.2 : 3.2) * dt)
      p.vx *= drag
      p.vy = p.vy * drag + p.gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.shape === "petal") p.x += Math.sin(p.t * 5 + p.phase) * 40 * dt
      p.rot += p.vr * dt
      drawParticle(ctx, p)
      return true
    })

    this.stickers = this.stickers.filter((s) => {
      s.t += dt
      if (s.t >= s.life) return false
      // Spring toward scale 1. "pop" starts at 0 and overshoots; "slam" starts big and lands hard.
      const k = s.slam ? 560 : 420
      const damping = s.slam ? 21 : 16
      s.vScale += (k * (1 - s.scale) - damping * s.vScale) * dt
      s.scale += s.vScale * dt
      if (!s.slam || s.t > 0.16) s.y -= s.rise * dt
      drawSticker(ctx, s)
      return true
    })

    if (this.particles.length || this.stickers.length || this.rings.length || this.drawings.length) {
      this.raf = requestAnimationFrame(this.tick)
    } else {
      this.raf = 0
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }
}

/* ------------------------------------------------------------------------ */
/* Drawing                                                                   */
/* ------------------------------------------------------------------------ */

function easeOutBack(x: number) {
  const c1 = 1.9
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

/** Small deterministic PRNG, so a "hand-drawn" frame stays stable for as long as it is held. */
function seeded(seed: number) {
  let s = (seed * 2654435761) >>> 0
  return () => {
    s ^= s << 13
    s >>>= 0
    s ^= s >> 17
    s ^= s << 5
    s >>>= 0
    return s / 4294967296
  }
}

function traceHeart(ctx: CanvasRenderingContext2D, r: number) {
  ctx.moveTo(0, r * 0.85)
  ctx.bezierCurveTo(-r * 1.25, -r * 0.05, -r * 0.65, -r * 1.05, 0, -r * 0.42)
  ctx.bezierCurveTo(r * 0.65, -r * 1.05, r * 1.25, -r * 0.05, 0, r * 0.85)
}

/** Sakura petal: notched tip at the top, pointed base at the bottom. */
function tracePetal(ctx: CanvasRenderingContext2D, r: number) {
  ctx.moveTo(-r * 0.28, -r)
  ctx.quadraticCurveTo(0, -r * 0.62, r * 0.28, -r)
  ctx.bezierCurveTo(r * 0.95, -r * 0.55, r * 0.6, r * 0.7, 0, r)
  ctx.bezierCurveTo(-r * 0.6, r * 0.7, -r * 0.95, -r * 0.55, -r * 0.28, -r)
}

const PUFF_LOBES = [
  [0, 0, 1],
  [-0.78, 0.16, 0.62],
  [0.74, 0.2, 0.66],
  [0.1, -0.52, 0.62],
] as const

function drawPuff(ctx: CanvasRenderingContext2D, p: Particle) {
  // Hold each drawing for two frames (~14 fps): the cel-animation look.
  const step = Math.floor(p.t * 14)
  if (step !== p.step) {
    p.step = step
    p.dx = p.x
    p.dy = p.y
  }
  const k = step / 14 / p.life
  const grow = easeOutBack(Math.min(k / 0.22, 1))
  const fade = k > 0.45 ? Math.max(0, 1 - (k - 0.45) / 0.55) : 1
  const r = p.size * grow * (0.3 + 0.7 * fade)
  if (r < 0.6) return

  ctx.save()
  ctx.translate(p.dx, p.dy)
  ctx.rotate(p.rot)
  ctx.globalAlpha = Math.min(1, fade * 2.2)
  ctx.strokeStyle = p.color
  ctx.lineWidth = 3
  ctx.beginPath()
  for (const [x, y, s] of PUFF_LOBES) {
    ctx.moveTo(x * r + r * s, y * r)
    ctx.arc(x * r, y * r, r * s, 0, Math.PI * 2)
  }
  ctx.stroke()
  ctx.fillStyle = "#ffffff"
  ctx.fill()
  ctx.restore()
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  if (p.shape === "puff") return drawPuff(ctx, p)

  const k = p.t / p.life
  const pop = easeOutBack(Math.min(p.t / 0.18, 1))
  const r = p.size * pop * (1 - k * 0.45)
  if (r <= 0.2) return
  const twinkle = p.shape === "sparkle" ? 0.75 + 0.25 * Math.sin(p.t * 30 + p.phase) : 1

  ctx.save()
  ctx.globalAlpha = (1 - k * k) * twinkle
  ctx.translate(p.x, p.y)
  ctx.rotate(p.shape === "heart" ? Math.sin(p.t * 8 + p.phase) * 0.35 : p.rot)
  ctx.fillStyle = p.color
  ctx.strokeStyle = p.color
  ctx.lineJoin = "round"
  ctx.lineCap = "round"
  ctx.beginPath()

  switch (p.shape) {
    case "sparkle":
      // Four-point "kira" star with pinched, curved sides.
      ctx.moveTo(0, -r)
      ctx.quadraticCurveTo(r * 0.12, -r * 0.12, r, 0)
      ctx.quadraticCurveTo(r * 0.12, r * 0.12, 0, r)
      ctx.quadraticCurveTo(-r * 0.12, r * 0.12, -r, 0)
      ctx.quadraticCurveTo(-r * 0.12, -r * 0.12, 0, -r)
      ctx.fill()
      break
    case "heart":
      traceHeart(ctx, r)
      ctx.fill()
      break
    case "star": {
      // Chubby five-point star: filled, then stroked with round joins.
      for (let i = 0; i < 10; i++) {
        const rr = i % 2 ? r * 0.5 : r
        const a = (i * Math.PI) / 5 - Math.PI / 2
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr)
      }
      ctx.closePath()
      ctx.lineWidth = r * 0.35
      ctx.fill()
      ctx.stroke()
      break
    }
    case "petal":
      tracePetal(ctx, r)
      ctx.fill()
      break
    case "bubble":
      ctx.lineWidth = Math.max(1.5, r * 0.16)
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.globalAlpha *= 0.9
      ctx.fillStyle = "#ffffff"
      ctx.arc(-r * 0.38, -r * 0.38, r * 0.22, 0, Math.PI * 2)
      ctx.fill()
      break
    case "dot":
      ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2)
      ctx.fill()
      break
  }
  ctx.restore()
}

let fontFamily: string | null = null

function stickerFont() {
  if (fontFamily === null) {
    const custom = getComputedStyle(document.documentElement)
      .getPropertyValue("--yan-font-fx")
      .trim()
    fontFamily =
      (custom ? custom + ", " : "") +
      '"M PLUS Rounded 1c", "Zen Maru Gothic", "Hiragino Maru Gothic ProN", ui-rounded, system-ui, sans-serif'
  }
  return fontFamily
}

function drawSticker(ctx: CanvasRenderingContext2D, s: Sticker) {
  const k = s.t / s.life
  const fadeOut = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3
  const fadeIn = s.slam ? Math.min(1, s.t / 0.05) : 1
  const size = s.size
  const scale = Math.max(0, s.scale)

  ctx.save()
  ctx.globalAlpha = Math.max(0, fadeOut * fadeIn)
  ctx.translate(s.x, s.y)
  ctx.rotate(s.rot)
  ctx.scale(scale, scale)
  ctx.font = `900 ${size}px ${stickerFont()}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.lineJoin = "round"

  // Sticker look: thick white outline with a soft drop shadow, then the fill.
  ctx.shadowColor = "rgba(120, 40, 90, 0.28)"
  ctx.shadowOffsetY = 3
  ctx.shadowBlur = 6
  ctx.lineWidth = size * 0.42
  ctx.strokeStyle = "#ffffff"
  ctx.strokeText(s.text, 0, 0)
  ctx.shadowColor = "transparent"
  ctx.shadowBlur = 0
  ctx.fillStyle = s.color
  ctx.fillText(s.text, 0, 0)
  ctx.restore()
}

function resolveColors(list: string[]): string[] {
  if (typeof document === "undefined") return FALLBACK_COLORS
  const style = getComputedStyle(document.documentElement)
  return list.map((c, i) =>
    c.startsWith("--")
      ? style.getPropertyValue(c).trim() || FALLBACK_COLORS[i % FALLBACK_COLORS.length]
      : c
  )
}
