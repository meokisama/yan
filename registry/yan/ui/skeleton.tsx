"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { burst, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type SkeletonProps = React.ComponentProps<"div"> & {
  /**
   * How much moe. `"kawaii"`: cotton-candy colours drift across with a glint,
   * and the content pops in with sparkles when `loaded` turns true.
   * `"subtle"`: a slow pulse, then a fade. `"off"`: a still block, then a swap.
   */
  intensity?: YanIntensity
  /**
   * Pass it to let the skeleton do the swap: `false` shows the placeholder,
   * `true` shows `children`. `className` then styles the placeholder only.
   */
  loaded?: boolean
  /** Fine-tune the burst fired when the content arrives. */
  fx?: BurstOptions
}

/** A soft placeholder block. Size and round it with `className`. */
function Skeleton({ className, intensity = "kawaii", loaded, fx, children, ...props }: SkeletonProps) {
  const content = React.useRef<HTMLDivElement>(null)
  const was = React.useRef(loaded)
  // kept in a ref: an inline `fx` object must not replay the reveal
  const options = React.useRef(fx)

  React.useEffect(() => {
    options.current = fx
  })

  React.useEffect(() => {
    const arrived = loaded === true && was.current === false
    was.current = loaded
    if (!arrived || intensity === "off" || !content.current) return
    burst(
      content.current,
      intensity === "kawaii"
        ? { shapes: ["sparkle", "star", "dot"], count: 9, power: 0.6, size: 8, colors: ["--yan-fx-4", "--yan-fx-1", "--yan-fx-5"], ...options.current }
        : { shapes: ["sparkle"], count: 3, power: 0.35, size: 6, ...options.current }
    )
  }, [loaded, intensity])

  if (loaded)
    return (
      <div
        ref={content}
        data-slot="skeleton-content"
        className={cn(
          intensity === "kawaii" && "animate-[yan-jelly-in_0.45s_ease-out] motion-reduce:animate-none",
          intensity === "subtle" && "animate-[yan-fade-in_0.25s_ease-out] motion-reduce:animate-none"
        )}
        {...props}
      >
        {children}
      </div>
    )

  return (
    <div
      data-slot="skeleton"
      data-intensity={intensity}
      className={cn(
        "rounded-2xl bg-muted",
        intensity === "kawaii" && [
          // a glint over three candy colours; both layers tile, so yan-shimmer loops without a seam
          "bg-[linear-gradient(100deg,transparent_35%,var(--shine)_50%,transparent_65%),linear-gradient(100deg,var(--a),var(--b),var(--c),var(--a))] bg-[length:200%_100%]",
          "[--a:color-mix(in_oklch,var(--yan-sakura)_42%,var(--muted))] [--b:color-mix(in_oklch,var(--yan-lavender)_42%,var(--muted))] [--c:color-mix(in_oklch,var(--yan-sky)_42%,var(--muted))]",
          "[--shine:rgb(255_255_255/0.75)] dark:[--shine:rgb(255_255_255/0.16)]",
          "animate-[yan-shimmer_2.2s_linear_infinite] motion-reduce:animate-none",
        ],
        intensity === "subtle" && "animate-pulse motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
export type { SkeletonProps }
