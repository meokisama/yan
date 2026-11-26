/**
 * yan-fx: the tiny effects layer behind every Yan component.
 *
 * One fixed, click-through <canvas> overlays the page and draws short-lived
 * particles (sparkles, hearts, stars, sakura petals, bubbles) and Japanese
 * onomatopoeia stickers (ぷにっ, キラッ, ...). It is created lazily on the first
 * burst and its animation loop stops as soon as nothing is on screen.
 *
 * No dependencies. Framework-agnostic: React components call `burst()`, but
 * so can anything else.
 */

export type YanIntensity = "off" | "subtle" | "kawaii"

export type FxShape = "sparkle" | "heart" | "star" | "petal" | "bubble" | "dot"

export type FxPoint = { x: number; y: number }

export interface BurstOptions {
  /** Shapes to pick from, at random. */
  shapes?: FxShape[]
  /** Number of particles. */
  count?: number
  /** Onomatopoeia sticker drawn at the origin, e.g. "ぷにっ". */
  word?: string | null
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
  /** Downward acceleration in px/s². Bubbles always float up. */
  gravity?: number
  /** Draw a soft shockwave ring at the origin. */
  ring?: boolean
}

const DEFAULT_COLORS = ["--yan-fx-1", "--yan-fx-2", "--yan-fx-3", "--yan-fx-4", "--yan-fx-5"]
const FALLBACK_COLORS = ["#ff9cc6", "#c9a7ff", "#8fe3c0", "#ffe27a", "#9fd3ff"]
const MAX_PARTICLES = 400

/** Ready-made recipes so every component feels like part of one family. */
export const fxPresets: Record<Exclude<YanIntensity, "off">, BurstOptions> = {
  subtle: { shapes: ["sparkle", "dot"], count: 7, power: 0.7, size: 7, word: null },
  kawaii: { shapes: ["sparkle", "heart", "star", "dot"], count: 14, power: 1, size: 11, ring: true },
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

/** Fire a burst at a viewport point or at the center of an element. */
export function burst(target: FxPoint | Element, options: BurstOptions = {}) {
  if (typeof window === "undefined" || prefersReducedMotion()) return
  const point =
    target instanceof Element ? centerOf(target) : { x: target.x, y: target.y }
  engine().burst(point, options)
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

function centerOf(el: Element): FxPoint {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
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
}

type Sticker = {
  text: string
  x: number
  y: number
  t: number
  life: number
  scale: number
  vScale: number
  rot: number
  color: string
}

type Ring = { x: number; y: number; t: number; life: number; size: number; color: string }

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
  private raf = 0
  private last = 0
  private dpr = 1

  burst(origin: FxPoint, o: BurstOptions) {
    this.mount()
    const colors = resolveColors(o.colors ?? DEFAULT_COLORS)
    const shapes = o.shapes ?? ["sparkle"]
    const count = Math.min(o.count ?? 10, MAX_PARTICLES - this.particles.length)
    const power = o.power ?? 1
    const size = o.size ?? 9
    const spread = o.spread ?? Math.PI * 2
    const angle = o.angle ?? -Math.PI / 2

    for (let i = 0; i < count; i++) {
      const shape = shapes[i % shapes.length]
      const a = angle + (Math.random() - 0.5) * spread
      const speed = (140 + Math.random() * 220) * power
      const isBubble = shape === "bubble"
      const isPetal = shape === "petal"
      this.particles.push({
        shape,
        x: origin.x,
        y: origin.y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - (isBubble ? 60 : 40),
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * (isPetal ? 6 : 10),
        size: size * (0.6 + Math.random() * 0.7),
        color: colors[Math.floor(Math.random() * colors.length)],
        t: 0,
        life: 0.55 + Math.random() * 0.45 + (isPetal || isBubble ? 0.6 : 0),
        gravity: isBubble ? -140 : isPetal ? 120 : (o.gravity ?? 420),
        phase: Math.random() * Math.PI * 2,
      })
    }

    if (o.ring) {
      this.rings.push({ x: origin.x, y: origin.y, t: 0, life: 0.45, size: size * 4.2 * power, color: colors[0] })
    }

    if (o.word) {
      this.stickers.push({
        text: o.word,
        x: origin.x,
        y: origin.y - 18,
        t: 0,
        life: 0.95,
        scale: 0,
        vScale: 0,
        rot: (Math.random() - 0.5) * 0.3,
        color: resolveColors(["--yan-fx-ink"])[0] ?? "#e0569b",
      })
    }

    if (!this.raf) {
      this.last = performance.now()
      this.raf = requestAnimationFrame(this.tick)
    }
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
    const dt = Math.min((now - this.last) / 1000, 1 / 30)
    this.last = now

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)

    this.particles = this.particles.filter((p) => {
      p.t += dt
      if (p.t >= p.life) return false
      const drag = Math.exp(-3.2 * dt)
      p.vx *= drag
      p.vy = p.vy * drag + p.gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.shape === "petal") p.x += Math.sin(p.t * 5 + p.phase) * 40 * dt
      p.rot += p.vr * dt
      drawParticle(ctx, p)
      return true
    })

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

    this.stickers = this.stickers.filter((s) => {
      s.t += dt
      if (s.t >= s.life) return false
      // Under-damped spring toward scale 1: the "pop" that overshoots and settles.
      const k = 420
      const damping = 16
      s.vScale += (k * (1 - s.scale) - damping * s.vScale) * dt
      s.scale += s.vScale * dt
      s.y -= 26 * dt
      drawSticker(ctx, s)
      return true
    })

    if (this.particles.length || this.stickers.length || this.rings.length) {
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

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
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
      ctx.moveTo(0, r * 0.85)
      ctx.bezierCurveTo(-r * 1.25, -r * 0.05, -r * 0.65, -r * 1.05, 0, -r * 0.42)
      ctx.bezierCurveTo(r * 0.65, -r * 1.05, r * 1.25, -r * 0.05, 0, r * 0.85)
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
      // Sakura petal with the little notch at its tip.
      ctx.moveTo(-r * 0.28, -r)
      ctx.quadraticCurveTo(0, -r * 0.62, r * 0.28, -r)
      ctx.bezierCurveTo(r * 0.95, -r * 0.55, r * 0.6, r * 0.7, 0, r)
      ctx.bezierCurveTo(-r * 0.6, r * 0.7, -r * 0.95, -r * 0.55, -r * 0.28, -r)
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
  const alpha = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3
  const size = 26

  ctx.save()
  ctx.globalAlpha = Math.max(0, alpha)
  ctx.translate(s.x, s.y)
  ctx.rotate(s.rot)
  ctx.scale(Math.max(0, s.scale), Math.max(0, s.scale))
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
