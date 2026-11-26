"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { burst, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type InputProps = React.ComponentProps<"input"> & {
  /** How much moe: `"kawaii"` pops a few sparkles when the field takes focus. */
  intensity?: YanIntensity
  /** Fine-tune the focus burst. */
  fx?: BurstOptions
}

/** A pill-shaped field pressed into the page, with a candy ring on focus. */
function Input({ className, type, intensity = "kawaii", fx, onFocus, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-intensity={intensity}
      className={cn(
        "h-11 w-full min-w-0 rounded-full border-2 border-input bg-card px-4 text-sm font-bold text-foreground outline-none",
        "shadow-[inset_0_2px_4px_0_rgb(0_0_0/0.07)] transition-[border-color,box-shadow] duration-200",
        "placeholder:font-medium placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground",
        "hover:border-primary focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/35",
        "file:mr-3 file:h-full file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-extrabold file:text-yan-sakura-edge",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/30",
        className
      )}
      onFocus={(e) => {
        onFocus?.(e)
        if (intensity !== "kawaii") return
        const r = e.currentTarget.getBoundingClientRect()
        burst(
          { x: r.right - 18, y: r.top + 2 },
          { shapes: ["sparkle", "dot"], count: 5, power: 0.4, size: 7, spread: Math.PI, ...fx }
        )
      }}
      {...props}
    />
  )
}

export { Input }
export type { InputProps }
