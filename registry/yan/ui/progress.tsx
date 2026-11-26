"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  /** How much moe: `"kawaii"` animates candy stripes and celebrates at 100%. */
  intensity?: YanIntensity
  /** Sticker shown when the bar fills up (kawaii only). `false` hides it. */
  sfx?: string | false
  /** Fine-tune the burst fired at 100%. */
  fx?: BurstOptions
}

/** A candy-cane progress bar that throws a little party when it fills up. */
function Progress({
  className,
  value,
  max = 100,
  intensity = "kawaii",
  sfx = "やった！",
  fx,
  ...props
}: ProgressProps) {
  const fill = React.useRef<HTMLDivElement>(null)
  const pct = Math.max(0, Math.min(100, ((value ?? 0) / max) * 100))
  const prev = React.useRef(pct)

  React.useEffect(() => {
    const was = prev.current
    prev.current = pct
    if (pct < 100 || was >= 100 || intensity === "off" || !fill.current) return
    const el = fill.current
    const kawaii = intensity === "kawaii"
    // Let the bar finish growing, then pop at its tip.
    const t = setTimeout(() => {
      const r = el.getBoundingClientRect()
      burst(
        { x: r.right - 8, y: r.top + r.height / 2 },
        {
          shapes: kawaii ? ["star", "heart", "sparkle"] : ["sparkle"],
          count: kawaii ? 18 : 6,
          power: kawaii ? 0.9 : 0.5,
          size: kawaii ? 10 : 6,
          ring: kawaii,
          word: kawaii && sfx ? sfx : null,
          ...fx,
        }
      )
    }, 380)
    return () => clearTimeout(t)
  }, [pct, intensity, sfx, fx])

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-intensity={intensity}
      value={value}
      max={max}
      className={cn(
        "relative h-5 w-full overflow-hidden rounded-full bg-muted p-[3px] shadow-[inset_0_2px_4px_0_oklch(0_0_0/0.12),inset_0_0_0_2px_var(--border)]",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        ref={fill}
        data-slot="progress-indicator"
        className={cn(
          "yan-stripes h-full min-w-3.5 rounded-full bg-primary shadow-[inset_0_-2px_0_0_oklch(0_0_0/0.08)]",
          "transition-[width] duration-500 motion-reduce:transition-none",
          intensity !== "off" && "ease-[cubic-bezier(.34,1.4,.5,1)]",
          intensity === "kawaii" && "animate-[yan-stripes_0.9s_linear_infinite] motion-reduce:animate-none",
          pct === 0 && "opacity-0"
        )}
        style={{ width: `${pct}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
export type { ProgressProps }
