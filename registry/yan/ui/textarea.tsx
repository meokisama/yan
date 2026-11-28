"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { burst, emote, puff, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type TextareaProps = React.ComponentProps<"textarea"> & {
  /**
   * How much moe. `"kawaii"`: a mochi peeks over the top edge. It dozes while
   * the field is idle, wakes on focus, watches the caret and beams while you
   * type. Keystrokes kick sparkles off the caret, a new line drops a heart
   * and deleting leaves a puff. `"subtle"` and `"off"` keep only the focus ring.
   */
  intensity?: YanIntensity
  /** Fine-tune the per-keystroke burst. */
  fx?: BurstOptions
}

type Mood = "asleep" | "awake" | "happy"

const MIRRORED = [
  "boxSizing",
  "width",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "lineHeight",
  "letterSpacing",
  "tabSize",
] as const

/** Viewport position of the text caret, measured on a hidden copy of the field that wraps the same way. */
function caretPoint(el: HTMLTextAreaElement) {
  const rect = el.getBoundingClientRect()
  const cs = getComputedStyle(el)
  const mirror = document.createElement("div")
  for (const p of MIRRORED) mirror.style[p] = cs[p]
  Object.assign(mirror.style, {
    position: "absolute",
    top: "0",
    left: "-9999px",
    visibility: "hidden",
    borderStyle: "solid",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
  })
  mirror.textContent = el.value.slice(0, el.selectionStart)
  const mark = document.createElement("span")
  mark.textContent = "​"
  mirror.appendChild(mark)
  document.body.appendChild(mirror)
  const x = rect.left + parseFloat(cs.borderLeftWidth) + mark.offsetLeft - el.scrollLeft
  const y = rect.top + parseFloat(cs.borderTopWidth) + mark.offsetTop - el.scrollTop
  mirror.remove()
  return {
    x: Math.max(rect.left + 8, Math.min(rect.right - 8, x)),
    y: Math.max(rect.top, Math.min(rect.bottom - 8, y)),
  }
}

const INK = "oklch(0.3 0.08 335)"

/** The mochi that sits behind the top edge of the field. */
function Watcher({ mood, eyes }: { mood: Mood; eyes: React.Ref<SVGGElement> }) {
  return (
    <span
      aria-hidden="true"
      data-slot="textarea-mochi"
      data-mood={mood}
      className={cn(
        "pointer-events-none absolute right-5 bottom-full h-[30px] w-12",
        "transition-[translate] duration-300 ease-[cubic-bezier(.34,1.7,.5,1)] motion-reduce:transition-none",
        // asleep: only the top of its head shows over the edge
        mood === "asleep" ? "translate-y-[58%]" : "translate-y-[3px]"
      )}
    >
      <svg
        viewBox="0 0 48 30"
        className={cn("size-full overflow-visible", mood === "happy" && "animate-[yan-pop_0.42s_ease-out] motion-reduce:animate-none")}
      >
        <path d="M3 31C3 12 13 3 24 3s21 9 21 28Z" fill="#fff" stroke="var(--yan-sakura-edge)" strokeWidth="2" />
        {/* the flower on its head */}
        <g fill="var(--yan-sakura)" stroke="var(--yan-sakura-edge)" strokeWidth="0.6">
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx="36" cy="4.4" r="2.1" transform={`rotate(${a} 36 7)`} />
          ))}
          <circle cx="36" cy="7" r="1.3" fill="var(--yan-lemon)" />
        </g>
        <ellipse cx="12.5" cy="22" rx="3.4" ry="2" fill="var(--yan-sakura)" opacity="0.75" />
        <ellipse cx="35.5" cy="22" rx="3.4" ry="2" fill="var(--yan-sakura)" opacity="0.75" />
        <g ref={eyes} className="transition-[translate] duration-150 ease-out">
          {mood === "awake" && (
            <g className="origin-center animate-[yan-blink_4s_infinite] [transform-box:fill-box] motion-reduce:animate-none">
              <ellipse cx="18" cy="17" rx="2" ry="2.7" fill={INK} />
              <ellipse cx="30" cy="17" rx="2" ry="2.7" fill={INK} />
              <circle cx="18.7" cy="16" r="0.8" fill="#fff" />
              <circle cx="30.7" cy="16" r="0.8" fill="#fff" />
            </g>
          )}
          {mood !== "awake" && (
            <path
              d={mood === "happy" ? "M15 18.4q3-3.8 6 0M27 18.4q3-3.8 6 0" : "M15 17.4q3 2.6 6 0M27 17.4q3 2.6 6 0"}
              fill="none"
              stroke={INK}
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          )}
        </g>
        <path d="M21.5 21.6q1.25 1.7 2.5 0q1.25 1.7 2.5 0" fill="none" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  )
}

/** A soft, roomy field that grows with its text, with a mochi who keeps you company while you write. */
function Textarea({ className, intensity = "kawaii", fx, onInput, onFocus, onBlur, ...props }: TextareaProps) {
  const last = React.useRef(0)
  const calm = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const eyes = React.useRef<SVGGElement>(null)
  const [mood, setMood] = React.useState<Mood>("asleep")

  React.useEffect(() => () => clearTimeout(calm.current), [])

  /** Turn the mochi's eyes toward a point in the viewport. */
  const look = (point: { x: number; y: number }) => {
    const el = eyes.current
    const svg = el?.ownerSVGElement
    if (!el || !svg) return
    const r = svg.getBoundingClientRect()
    const dx = Math.max(-2, Math.min(2, (point.x - (r.left + r.width / 2)) / 70))
    const dy = Math.max(-0.5, Math.min(1.8, (point.y - r.bottom) / 40))
    el.style.translate = `${dx.toFixed(2)}px ${dy.toFixed(2)}px`
  }

  const field = (
    <textarea
      data-slot="textarea"
      data-intensity={intensity}
      className={cn(
        "relative field-sizing-content min-h-24 w-full min-w-0 rounded-3xl border-2 border-input bg-card px-4 py-3 text-base font-bold text-foreground outline-none sm:text-sm",
        "shadow-[inset_0_2px_4px_0_rgb(0_0_0/0.07)] transition-[border-color,box-shadow] duration-200",
        "placeholder:font-medium placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground",
        "hover:border-primary focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/35",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/30",
        className
      )}
      onFocus={(e) => {
        onFocus?.(e)
        if (intensity !== "kawaii") return
        setMood("awake")
        const svg = eyes.current?.ownerSVGElement
        if (svg) emote(svg, "！", { size: 14 })
      }}
      onBlur={(e) => {
        onBlur?.(e)
        if (intensity !== "kawaii") return
        clearTimeout(calm.current)
        setMood("asleep")
        if (eyes.current) eyes.current.style.translate = ""
      }}
      onInput={(e) => {
        onInput?.(e)
        if (intensity !== "kawaii") return
        const point = caretPoint(e.currentTarget)
        look(point)
        setMood("happy")
        clearTimeout(calm.current)
        calm.current = setTimeout(() => setMood("awake"), 900)

        const now = performance.now()
        if (now - last.current < 45) return
        last.current = now
        const kind = (e.nativeEvent as InputEvent).inputType ?? ""
        if (kind.startsWith("delete")) puff(point, { count: 1, size: 6, power: 0.35, color: "--yan-fx-2" })
        else
          burst(point, {
            shapes: kind === "insertLineBreak" ? ["heart"] : ["sparkle", "heart", "dot"],
            count: 2,
            power: 0.38,
            size: 7,
            angle: -Math.PI / 2,
            spread: 1.3,
            gravity: 300,
            ...fx,
          })
      }}
      {...props}
    />
  )

  if (intensity !== "kawaii") return field

  // The mochi comes first so the field paints over its lower half.
  return (
    <div data-slot="textarea-wrap" className="relative isolate flex w-full">
      <Watcher mood={mood} eyes={eyes} />
      {field}
    </div>
  )
}

export { Textarea }
export type { TextareaProps }
