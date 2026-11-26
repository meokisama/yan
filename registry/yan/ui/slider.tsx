"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, emote, prefersReducedMotion, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /**
   * How much moe. `"kawaii"`: the thumb stretches like pulled mochi the faster
   * you drag, sheds hearts behind it and snaps back with a "ぴたっ" on release.
   * `"subtle"`: a light stretch and sparkles on release. `"off"`: neither.
   */
  intensity?: YanIntensity
  /** Fine-tune the burst fired when a drag ends. */
  fx?: BurstOptions
}

/** A candy-filled slider whose heart thumb stretches with speed. */
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
  const last = React.useRef({ v: 0, t: 0, trail: 0 })
  const stretch = React.useRef<Animation | null>(null)
  const thumbs = value ?? defaultValue ?? [min]

  const activeThumb = () => {
    const el = root.current
    if (!el) return null
    const active = document.activeElement
    return active && el.contains(active) && active.matches("[data-slot=slider-thumb]")
      ? active
      : el.querySelector("[data-slot=slider-thumb]")
  }

  const move = (v: number) => {
    const now = performance.now()
    const prev = last.current
    const dt = Math.max(8, now - prev.t)
    // Speed as "fraction of the track per second".
    const speed = prev.t ? (v - prev.v) / (max - min || 1) / (dt / 1000) : 0
    last.current = { v, t: now, trail: prev.trail }
    if (intensity === "off" || prefersReducedMotion()) return

    const thumb = activeThumb()
    const ball = thumb?.firstElementChild
    if (!thumb || !ball) return
    const kawaii = intensity === "kawaii"
    const s = Math.min(kawaii ? 0.7 : 0.25, Math.abs(speed) * (kawaii ? 0.5 : 0.2))
    if (s > 0.04) {
      // Teardrop: long in the direction of travel, thin across, lagging behind.
      stretch.current?.cancel()
      stretch.current = ball.animate(
        [
          { scale: `${1 + s} ${1 - s * 0.45}`, translate: `${-Math.sign(speed) * s * 9}px 0` },
          { scale: `${1 - s * 0.25} ${1 + s * 0.2}`, translate: "0 0", offset: 0.55 },
          { scale: "1 1", translate: "0 0" },
        ],
        { duration: 420, easing: "ease-out" }
      )
    }
    if (kawaii && now - prev.trail > 60 && Math.abs(speed) > 0.25) {
      last.current.trail = now
      burst(thumb, {
        shapes: Math.abs(speed) > 1.2 ? ["heart", "sparkle"] : ["sparkle", "dot"],
        count: Math.abs(speed) > 1.2 ? 3 : 2,
        power: 0.4,
        size: 7,
        gravity: 220,
        // thrown out behind the thumb
        angle: speed > 0 ? Math.PI : 0,
        spread: 1.3,
      })
    }
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
        const el = activeThumb()
        const i = el ? Array.from(root.current?.querySelectorAll("[data-slot=slider-thumb]") ?? []).indexOf(el) : 0
        move(v[Math.max(0, i)] ?? v[0])
      }}
      onValueCommit={(v) => {
        onValueCommit?.(v)
        last.current.t = 0
        if (intensity === "off") return
        const t = activeThumb()
        if (!t) return
        const kawaii = intensity === "kawaii"
        burst(t, {
          shapes: kawaii ? ["heart", "sparkle"] : ["sparkle"],
          count: kawaii ? 7 : 4,
          power: kawaii ? 0.55 : 0.4,
          size: kawaii ? 9 : 6,
          ring: kawaii,
          ...fx,
        })
        if (kawaii) emote(t, "ぴたっ", { size: 13 })
      }}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-3.5 grow overflow-hidden rounded-full bg-muted shadow-[inset_0_2px_4px_0_rgb(0_0_0/0.12),inset_0_0_0_2px_var(--border)]"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full rounded-full bg-[linear-gradient(90deg,var(--yan-lavender),var(--primary))] shadow-[inset_0_2px_0_0_rgb(255_255_255/0.55),inset_0_-2px_0_0_rgb(0_0_0/0.08)]"
        />
      </SliderPrimitive.Track>
      {thumbs.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          className={cn(
            "group/thumb block size-7 cursor-grab rounded-full outline-none active:cursor-grabbing",
            "transition-[scale] duration-200 hover:scale-110",
            intensity !== "off" && "ease-[cubic-bezier(.34,1.7,.5,1)] active:scale-125"
          )}
        >
          {/* The visible ball is separate from the positioned thumb so it can stretch freely. */}
          <span
            className={cn(
              "grid size-full place-items-center rounded-full border-[3px] border-primary bg-white",
              "shadow-[0_3px_0_0_var(--yan-sakura-edge),0_6px_10px_-2px_var(--yan-sakura-edge)]",
              "group-focus-visible/thumb:ring-4 group-focus-visible/thumb:ring-ring/50"
            )}
          >
            <svg viewBox="0 0 16 16" className="size-3 text-yan-sakura-edge" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 14.2C2.2 10.3 1 7.4 1 5.2 1 3.3 2.5 2 4.3 2 5.8 2 7.1 2.9 8 4.3 8.9 2.9 10.2 2 11.7 2 13.5 2 15 3.3 15 5.2c0 2.2-1.2 5.1-7 9Z"
              />
            </svg>
          </span>
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
export type { SliderProps }
