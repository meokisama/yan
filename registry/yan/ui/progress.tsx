"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, prefersReducedMotion, puff, speedLines, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  /**
   * How much moe. `"kawaii"`: a tiny mochi rides the leading edge, rolling
   * forward and kicking up clouds, then jumps for joy at 100%. `"subtle"`:
   * the mochi rides quietly and sparkles at 100%. `"off"`: a plain bar.
   */
  intensity?: YanIntensity
  /** Sticker shown when the bar fills up (kawaii only). `false` hides it. */
  sfx?: string | false
  /** Fine-tune the burst fired at 100%. */
  fx?: BurstOptions
}

/** A candy-cane progress bar with a mochi riding the front of it. */
function Progress({
  className,
  value,
  max = 100,
  intensity = "kawaii",
  sfx = "やった！",
  fx,
  ...props
}: ProgressProps) {
  const rider = React.useRef<HTMLSpanElement>(null)
  const pct = Math.max(0, Math.min(100, ((value ?? 0) / max) * 100))
  const prev = React.useRef(pct)
  const done = pct >= 100

  React.useEffect(() => {
    const was = prev.current
    prev.current = pct
    const el = rider.current
    if (!el || pct === was || intensity === "off" || prefersReducedMotion()) return
    const kawaii = intensity === "kawaii"
    const forward = pct > was
    const timers: ReturnType<typeof setTimeout>[] = []

    if (kawaii) {
      // Roll along with the bar...
      el.animate([{ rotate: "0deg" }, { rotate: forward ? "360deg" : "-360deg" }], {
        duration: 520,
        easing: "cubic-bezier(.3,.7,.3,1)",
      })
      // ...and kick up dust behind.
      for (const delay of [60, 220]) {
        timers.push(
          setTimeout(() => {
            const r = el.getBoundingClientRect()
            puff(
              { x: forward ? r.left + 2 : r.right - 2, y: r.bottom - 3 },
              { count: 1, size: 8, power: 0.5, angle: forward ? -Math.PI * 0.85 : -Math.PI * 0.15, spread: 0.6 }
            )
          }, delay)
        )
      }
    }

    if (pct >= 100 && was < 100) {
      timers.push(
        setTimeout(() => {
          if (kawaii) {
            el.animate(
              [
                { translate: "0 0", scale: "1 1" },
                { translate: "0 -16px", scale: "0.9 1.12", offset: 0.35 },
                { translate: "0 0", scale: "1.2 0.8", offset: 0.7 },
                { translate: "0 0", scale: "1 1" },
              ],
              { duration: 520, easing: "ease-out" }
            )
            speedLines(el)
          }
          burst(el, {
            shapes: kawaii ? ["star", "heart", "sparkle"] : ["sparkle"],
            count: kawaii ? 16 : 6,
            power: kawaii ? 0.9 : 0.5,
            size: kawaii ? 10 : 6,
            ring: kawaii,
            word: kawaii && sfx ? sfx : null,
            wordStyle: "slam",
            ...fx,
          })
        }, 480)
      )
    }
    return () => timers.forEach(clearTimeout)
  }, [pct, intensity, sfx, fx])

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-intensity={intensity}
      value={value}
      max={max}
      className={cn(
        "relative h-5 w-full rounded-full bg-muted p-[3px] shadow-[inset_0_2px_4px_0_rgb(0_0_0/0.12),inset_0_0_0_2px_var(--border)]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "yan-stripes relative h-full min-w-3.5 rounded-full bg-primary shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.08)]",
          "transition-[width] duration-500 motion-reduce:transition-none",
          intensity !== "off" && "ease-[cubic-bezier(.34,1.4,.5,1)]",
          intensity === "kawaii" && !done && "animate-[yan-stripes_0.9s_linear_infinite] motion-reduce:animate-none"
        )}
        style={{ width: `${pct}%` }}
      >
        {intensity !== "off" && (
          <span
            ref={rider}
            aria-hidden="true"
            className="absolute top-1/2 -right-2.5 -mt-3.5 grid size-7 place-items-center rounded-full bg-white shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.06),0_2px_0_0_var(--yan-sakura-edge),0_4px_8px_-2px_var(--yan-sakura-edge)]"
          >
            <svg viewBox="0 0 24 24" className="size-6">
              <ellipse cx="5.6" cy="14.4" rx="2.2" ry="1.3" fill="oklch(0.82 0.14 355)" opacity="0.7" />
              <ellipse cx="18.4" cy="14.4" rx="2.2" ry="1.3" fill="oklch(0.82 0.14 355)" opacity="0.7" />
              {done ? (
                <path
                  d="M6.4 12 q2 -2.6 4 0 M13.6 12 q2 -2.6 4 0"
                  fill="none"
                  stroke="oklch(0.3 0.08 335)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <ellipse cx="8.4" cy="11.4" rx="1.4" ry="1.9" fill="oklch(0.3 0.08 335)" />
                  <ellipse cx="15.6" cy="11.4" rx="1.4" ry="1.9" fill="oklch(0.3 0.08 335)" />
                </>
              )}
              <path
                d="M10.2 14.4 q0.9 1.3 1.8 0 q0.9 1.3 1.8 0"
                fill="none"
                stroke="oklch(0.3 0.08 335)"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
export type { ProgressProps }
