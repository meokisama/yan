"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  /** How much moe: `"kawaii"` bounces and pops hearts, `"subtle"` a few sparkles, `"off"` neither. */
  intensity?: YanIntensity
  /** Fine-tune the burst fired when the switch turns on. */
  fx?: BurstOptions
}

/** A switch whose thumb is a tiny mochi: asleep when off, wide awake when on. */
function Switch({ className, intensity = "kawaii", fx, onCheckedChange, ...props }: SwitchProps) {
  const thumb = React.useRef<HTMLSpanElement>(null)

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-intensity={intensity}
      className={cn(
        "peer group/switch relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full outline-none",
        "bg-muted shadow-[inset_0_2px_5px_0_oklch(0_0_0/0.14),inset_0_0_0_2px_var(--border)] transition-[background-color,box-shadow] duration-300",
        "data-[state=checked]:bg-primary data-[state=checked]:shadow-[inset_0_2px_5px_0_color-mix(in_oklch,var(--yan-sakura-edge)_70%,transparent),inset_0_0_0_2px_var(--yan-sakura-edge)]",
        "focus-visible:ring-4 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onCheckedChange={(checked) => {
        onCheckedChange?.(checked)
        if (!checked || intensity === "off" || !thumb.current) return
        const kawaii = intensity === "kawaii"
        // Wait a beat so the burst comes from where the thumb lands.
        setTimeout(() => {
          if (thumb.current)
            burst(thumb.current, {
              shapes: kawaii ? ["heart", "sparkle"] : ["sparkle"],
              count: kawaii ? 9 : 4,
              power: kawaii ? 0.62 : 0.45,
              size: kawaii ? 9 : 6,
              ...fx,
            })
        }, 140)
      }}
      {...props}
    >
      <SwitchPrimitive.Thumb
        ref={thumb}
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none grid h-6 w-6 translate-x-1 place-items-center rounded-full bg-white",
          "shadow-[inset_0_-2px_0_0_oklch(0_0_0/0.06),0_2px_0_0_oklch(0_0_0/0.12),0_3px_6px_0_oklch(0_0_0/0.16)]",
          "transition-[translate,width] duration-300 group-active/switch:w-7",
          "data-[state=checked]:translate-x-7 group-active/switch:data-[state=checked]:translate-x-6",
          intensity === "kawaii" && "duration-500 ease-[cubic-bezier(.34,1.7,.5,1)]"
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
