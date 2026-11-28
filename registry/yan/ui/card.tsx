"use client"

import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { burstFromEvent, impact, prefersReducedMotion, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

const colors = {
  sakura: { vars: "[--yan-c:var(--primary)] [--yan-edge:var(--yan-sakura-edge)]", fx: "--yan-fx-1" },
  lavender: { vars: "[--yan-c:var(--secondary)] [--yan-edge:var(--yan-lavender-edge)]", fx: "--yan-fx-2" },
  mint: { vars: "[--yan-c:var(--yan-mint)] [--yan-edge:var(--yan-mint-edge)]", fx: "--yan-fx-3" },
  sky: { vars: "[--yan-c:var(--yan-sky)] [--yan-edge:var(--yan-sky-edge)]", fx: "--yan-fx-5" },
  lemon: { vars: "[--yan-c:var(--yan-lemon)] [--yan-edge:var(--yan-lemon-edge)]", fx: "--yan-fx-4" },
  peach: { vars: "[--yan-c:var(--yan-peach)] [--yan-edge:var(--yan-peach-edge)]", fx: "--yan-fx-1" },
} as const

type CardColor = keyof typeof colors

type CardProps = React.ComponentProps<"div"> & {
  /** Candy colour of the rim, the wash at the top and the edge underneath. */
  color?: CardColor
  asChild?: boolean
  /**
   * Make the whole card one target: it leans toward the pointer, catches a
   * glare, sinks when pressed and bursts on click. Use with `asChild` and a
   * link or a button.
   */
  interactive?: boolean
  /**
   * How much moe, for an interactive card. `"kawaii"`: the lean, the glare, a
   * star on the corner, then a jelly wobble, emphasis lines, dust and a burst
   * on click. `"subtle"`: a lift and a few sparkles. `"off"`: none.
   */
  intensity?: YanIntensity
  /** Fine-tune the click burst of an interactive card. */
  fx?: BurstOptions
}

/** A puffy card with a candy rim and a wash of its colour across the top. */
function Card({
  className,
  color = "sakura",
  asChild = false,
  interactive = false,
  intensity = "kawaii",
  fx,
  onClick,
  onPointerMove,
  onPointerLeave,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot.Root : "div"
  const look = colors[color]
  const kawaii = interactive && intensity === "kawaii"

  return (
    <Comp
      data-slot="card"
      data-color={color}
      data-intensity={interactive ? intensity : undefined}
      className={cn(
        "relative flex flex-col gap-5 rounded-3xl py-6 text-card-foreground",
        "bg-card bg-[linear-gradient(180deg,color-mix(in_oklch,var(--yan-c)_20%,var(--card)),var(--card)_46%)]",
        "shadow-[inset_0_2px_0_0_rgb(255_255_255/0.5),inset_0_0_0_2px_var(--yan-c),0_6px_0_0_var(--yan-edge),0_22px_36px_-16px_var(--yan-edge)]",
        look.vars,
        interactive && "cursor-pointer text-left outline-none focus-visible:ring-4 focus-visible:ring-ring/50",
        interactive &&
          intensity !== "off" &&
          "transition-[translate,transform] duration-200 ease-out hover:-translate-y-1 active:translate-y-0.5 motion-reduce:transition-none",
        kawaii && [
          // leans toward the pointer: --rx / --ry are set in onPointerMove
          "[transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]",
          // the glare follows the pointer
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:mix-blend-soft-light after:transition-opacity after:duration-300 hover:after:opacity-100",
          "after:bg-[radial-gradient(16rem_circle_at_var(--gx,50%)_var(--gy,0%),rgb(255_255_255/0.7),transparent_60%)]",
          // a star pops onto the corner
          "before:pointer-events-none before:absolute before:-top-3 before:-right-2 before:z-10 before:scale-0 before:rotate-12 before:text-2xl before:leading-none before:text-yan-lemon before:content-['✦']",
          "before:[-webkit-text-stroke:1.5px_var(--yan-lemon-edge)] before:transition-[scale] before:duration-300 before:ease-[cubic-bezier(.34,1.9,.5,1)] hover:before:scale-100 motion-reduce:before:transition-none",
        ],
        className
      )}
      onPointerMove={(e: React.PointerEvent<HTMLDivElement>) => {
        onPointerMove?.(e)
        if (!kawaii || e.pointerType === "touch" || prefersReducedMotion()) return
        const el = e.currentTarget
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        el.style.setProperty("--ry", `${((px - 0.5) * 12).toFixed(2)}deg`)
        el.style.setProperty("--rx", `${((0.5 - py) * 12).toFixed(2)}deg`)
        el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`)
        el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`)
      }}
      onPointerLeave={(e: React.PointerEvent<HTMLDivElement>) => {
        onPointerLeave?.(e)
        e.currentTarget.style.removeProperty("--rx")
        e.currentTarget.style.removeProperty("--ry")
      }}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(e)
        if (!interactive || intensity === "off" || e.defaultPrevented) return
        burstFromEvent(e, {
          shapes: kawaii ? ["sparkle", "heart", "star"] : ["sparkle"],
          count: kawaii ? 12 : 4,
          power: kawaii ? 0.85 : 0.4,
          size: kawaii ? 10 : 6,
          ring: kawaii,
          colors: [look.fx, "--yan-fx-4"],
          ...fx,
        })
        if (!kawaii || prefersReducedMotion()) return
        const el = e.currentTarget
        el.animate(
          [{ scale: "1 1" }, { scale: "1.04 0.93", offset: 0.28 }, { scale: "0.98 1.04", offset: 0.6 }, { scale: "1 1" }],
          { duration: 480, easing: "ease-out" }
        )
        impact(el, { color: look.fx })
      }}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1.5 px-6", className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("text-xl leading-tight font-black", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm font-medium text-pretty text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center gap-3 px-6", className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export type { CardProps, CardColor }
