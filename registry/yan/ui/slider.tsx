"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** How much moe: `"kawaii"` leaves a sparkle trail, `"subtle"` sparkles on release, `"off"` neither. */
  intensity?: YanIntensity
  /** Fine-tune the burst fired when a drag ends. */
  fx?: BurstOptions
}

/** A candy-filled slider with a heart thumb that leaves sparkles as you drag. */
function Slider({
  className,
  intensity = "kawaii",
  fx,
  value,
  defaultValue,
  min = 0,
  max = 100,
  onValueChange,
  onValueCommit,
  ...props
}: SliderProps) {
  const root = React.useRef<HTMLSpanElement>(null)
  const lastTrail = React.useRef(0)
  const thumbs = value ?? defaultValue ?? [min]

  const activeThumb = () => {
    const el = root.current
    if (!el) return null
    const active = document.activeElement
    return active && el.contains(active) && active.matches("[data-slot=slider-thumb]")
      ? active
      : el.querySelector("[data-slot=slider-thumb]")
  }

  return (
    <SliderPrimitive.Root
      ref={root}
      data-slot="slider"
      data-intensity={intensity}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      className={cn(
        "relative flex h-8 w-full touch-none items-center select-none data-[disabled]:opacity-50",
        className
      )}
      onValueChange={(v) => {
        onValueChange?.(v)
        if (intensity !== "kawaii") return
        const now = performance.now()
        if (now - lastTrail.current < 70) return
        lastTrail.current = now
        const t = activeThumb()
        if (t) burst(t, { shapes: ["sparkle", "dot"], count: 2, power: 0.35, size: 6, gravity: 260 })
      }}
      onValueCommit={(v) => {
        onValueCommit?.(v)
        if (intensity === "off") return
        const t = activeThumb()
        if (!t) return
        const kawaii = intensity === "kawaii"
        burst(t, {
          shapes: kawaii ? ["heart", "sparkle"] : ["sparkle"],
          count: kawaii ? 8 : 4,
          power: kawaii ? 0.6 : 0.4,
          size: kawaii ? 9 : 6,
          ...fx,
        })
      }}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-3.5 grow overflow-hidden rounded-full bg-muted shadow-[inset_0_2px_4px_0_oklch(0_0_0/0.12),inset_0_0_0_2px_var(--border)]"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full rounded-full bg-[linear-gradient(90deg,var(--yan-lavender),var(--primary))] shadow-[inset_0_2px_0_0_oklch(1_0_0/0.55),inset_0_-2px_0_0_oklch(0_0_0/0.08)]"
        />
      </SliderPrimitive.Track>
      {thumbs.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          className={cn(
            "grid size-7 cursor-grab place-items-center rounded-full border-[3px] border-primary bg-white outline-none",
            "shadow-[0_3px_0_0_var(--yan-sakura-edge),0_6px_10px_-2px_color-mix(in_oklch,var(--yan-sakura-edge)_55%,transparent)]",
            "transition-[scale,box-shadow] duration-200 hover:scale-110 focus-visible:ring-4 focus-visible:ring-ring/50 active:cursor-grabbing",
            intensity !== "off" && "ease-[cubic-bezier(.34,1.7,.5,1)] active:scale-125"
          )}
        >
          <svg viewBox="0 0 16 16" className="size-3 text-yan-sakura-edge" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 14.2C2.2 10.3 1 7.4 1 5.2 1 3.3 2.5 2 4.3 2 5.8 2 7.1 2.9 8 4.3 8.9 2.9 10.2 2 11.7 2 13.5 2 15 3.3 15 5.2c0 2.2-1.2 5.1-7 9Z"
            />
          </svg>
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
export type { SliderProps }
