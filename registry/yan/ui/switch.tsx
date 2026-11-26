"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, emote, prefersReducedMotion, puff, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  /**
   * How much moe. `"kawaii"`: the mochi smears across, slams the far end and
   * splashes, then wakes with a "！" (or dozes off with "Zzz"). `"subtle"`: a
   * small stretch and a few sparkles. `"off"`: a plain switch.
   */
  intensity?: YanIntensity
  /** Fine-tune the splash fired when the thumb lands. */
  fx?: BurstOptions
}

/** A switch whose thumb is a tiny mochi: asleep when off, wide awake when on. */
function Switch({ className, intensity = "kawaii", fx, onCheckedChange, ...props }: SwitchProps) {
  const thumb = React.useRef<HTMLSpanElement>(null)

  const land = (checked: boolean) => {
    const el = thumb.current
    if (!el || intensity === "off" || prefersReducedMotion()) return
    const kawaii = intensity === "kawaii"

    // Smear: stretch along the direction of travel, squash on the slam, settle.
    el.animate(
      kawaii
        ? [
            { scale: "1 1", offset: 0 },
            { scale: "1.75 0.72", offset: 0.3 },
            { scale: "0.78 1.2", offset: 0.58 },
            { scale: "1.08 0.94", offset: 0.8 },
            { scale: "1 1", offset: 1 },
          ]
        : [{ scale: "1 1" }, { scale: "1.2 0.9" }, { scale: "1 1" }],
      { duration: kawaii ? 430 : 240, easing: "ease-out" }
    )

    setTimeout(
      () => {
        if (!el.isConnected) return
        const r = el.getBoundingClientRect()
        // The far end of the track, where the mochi hits.
        const wall = { x: checked ? r.right + 3 : r.left - 3, y: r.top + r.height / 2 }
        if (!kawaii) {
          if (checked) burst(wall, { shapes: ["sparkle"], count: 4, power: 0.4, size: 6, ...fx })
          return
        }
        burst(wall, {
          shapes: checked ? ["heart", "dot", "sparkle"] : ["dot", "bubble"],
          count: checked ? 8 : 5,
          power: 0.55,
          size: 8,
          angle: checked ? 0 : Math.PI,
          spread: 2,
          colors: checked ? ["--yan-fx-1", "--yan-fx-4"] : ["--yan-fx-2", "--yan-fx-5"],
          ...fx,
        })
        puff({ x: wall.x, y: r.bottom }, { count: 2, size: 8, angle: checked ? -0.5 : -Math.PI + 0.5, spread: 0.8 })
        emote(el, checked ? "！" : "Zzz", { side: checked ? "right" : "left", color: checked ? "--yan-fx-ink" : "--yan-fx-2" })
      },
      kawaii ? 190 : 120
    )
  }

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-intensity={intensity}
      className={cn(
        "peer group/switch relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full outline-none",
        "bg-muted shadow-[inset_0_2px_5px_0_rgb(0_0_0/0.14),inset_0_0_0_2px_var(--border)]",
        "focus-visible:ring-4 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onCheckedChange={(checked) => {
        onCheckedChange?.(checked)
        land(checked)
      }}
      {...props}
    >
      {/* The colour floods out from under the mochi instead of fading in. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 rounded-full bg-primary shadow-[inset_0_2px_5px_0_var(--yan-sakura-edge),inset_0_0_0_2px_var(--yan-sakura-edge)]",
          "[clip-path:circle(0%_at_1rem_50%)] group-data-[state=checked]/switch:[clip-path:circle(140%_at_1rem_50%)]",
          intensity !== "off" && "transition-[clip-path] duration-500 ease-out motion-reduce:transition-none"
        )}
      />
      <SwitchPrimitive.Thumb
        ref={thumb}
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none relative grid h-6 w-6 translate-x-1 place-items-center rounded-full bg-white",
          "shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.06),0_2px_0_0_rgb(0_0_0/0.12),0_3px_6px_0_rgb(0_0_0/0.16)]",
          "data-[state=checked]:translate-x-7",
          intensity !== "off" &&
            "transition-[translate] duration-200 ease-[cubic-bezier(.5,0,.2,1)] motion-reduce:transition-none"
        )}
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          {/* asleep */}
          <g
            className="opacity-100 transition-opacity duration-200 group-data-[state=checked]/switch:opacity-0"
            fill="none"
            stroke="oklch(0.62 0.05 335)"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M6.5 12.5 q1.75 1.6 3.5 0 M14 12.5 q1.75 1.6 3.5 0" />
          </g>
          {/* awake */}
          <g className="opacity-0 transition-opacity duration-200 group-data-[state=checked]/switch:opacity-100">
            <ellipse cx="5.4" cy="14.6" rx="2.2" ry="1.3" fill="oklch(0.82 0.14 355)" opacity="0.7" />
            <ellipse cx="18.6" cy="14.6" rx="2.2" ry="1.3" fill="oklch(0.82 0.14 355)" opacity="0.7" />
            <ellipse cx="8.3" cy="11.4" rx="1.5" ry="2" fill="oklch(0.3 0.08 335)" />
            <ellipse cx="15.7" cy="11.4" rx="1.5" ry="2" fill="oklch(0.3 0.08 335)" />
            <circle cx="8.8" cy="10.7" r="0.6" fill="#fff" />
            <circle cx="16.2" cy="10.7" r="0.6" fill="#fff" />
            <path
              d="M10.2 14.6 q0.9 1.3 1.8 0 q0.9 1.3 1.8 0"
              fill="none"
              stroke="oklch(0.3 0.08 335)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
export type { SwitchProps }
