"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { bloom, burst, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  /**
   * How much moe. `"kawaii"`: the box pops and a sakura blooms around it, then
   * lets its petals drift away. `"subtle"`: a few sparkles. `"off"`: neither.
   */
  intensity?: YanIntensity
  /** Fine-tune the sparkles fired when the box is checked. In kawaii mode, passing it adds a burst to the bloom. */
  fx?: BurstOptions
}

/** A gummy checkbox. Tick it and a sakura blooms around it. */
function Checkbox({ className, intensity = "kawaii", fx, onCheckedChange, ...props }: CheckboxProps) {
  const ref = React.useRef<HTMLButtonElement>(null)

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="checkbox"
      data-intensity={intensity}
      className={cn(
        "peer group/checkbox relative grid size-6 shrink-0 cursor-pointer place-items-center rounded-[0.6rem] outline-none",
        "border-2 border-input bg-card shadow-[inset_0_2px_3px_0_rgb(0_0_0/0.07)] transition-[border-color,background-color,box-shadow] duration-200",
        "hover:border-primary focus-visible:ring-4 focus-visible:ring-ring/50",
        "data-[state=checked]:yan-candy data-[state=checked]:border-transparent data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "[--yan-c:var(--primary)] [--yan-depth:3px] [--yan-edge:var(--yan-sakura-edge)]",
        intensity === "kawaii" && "data-[state=checked]:animate-[yan-pop_0.42s_ease-out] motion-reduce:animate-none",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      onCheckedChange={(checked) => {
        onCheckedChange?.(checked)
        const el = ref.current
        if (checked !== true || intensity === "off" || !el) return
        if (intensity === "subtle") {
          burst(el, { shapes: ["sparkle"], count: 4, power: 0.4, size: 6, ...fx })
          return
        }
        bloom(el)
        if (fx) burst(el, { shapes: ["sparkle"], count: 6, power: 0.5, size: 7, ...fx })
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator forceMount data-slot="checkbox-indicator" className="grid place-items-center">
        <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
          <path
            d="M3.2 8.6 6.6 11.8 12.8 4.8"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            className="[stroke-dashoffset:1] transition-[stroke-dashoffset] duration-300 ease-out group-data-[state=checked]/checkbox:[stroke-dashoffset:0] group-data-[state=unchecked]/checkbox:opacity-0"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
export type { CheckboxProps }
