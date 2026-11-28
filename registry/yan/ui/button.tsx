"use client"

import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  burstFromEvent,
  fxPresets,
  impact,
  pickWord,
  prefersReducedMotion,
  type BurstOptions,
  type YanIntensity,
} from "@/lib/yan-fx"

const candy =
  "yan-candy hover:-translate-y-0.5 hover:brightness-[1.04] data-[pressed]:yan-candy-pressed data-[pressed]:translate-y-[4px] data-[pressed]:brightness-100"

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-extrabold tracking-wide select-none",
    "transition-[background-color,color,box-shadow,translate,filter] duration-150 outline-none",
    "focus-visible:ring-4 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-4 aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: `${candy} bg-(--yan-c)`,
        destructive: `${candy} bg-destructive text-destructive-foreground [--yan-c:var(--destructive)] [--yan-edge:var(--yan-coral-edge)]`,
        outline:
          "border-2 border-(--yan-c) bg-card text-foreground shadow-[0_4px_0_0_var(--yan-c)] hover:-translate-y-0.5 hover:bg-accent data-[pressed]:translate-y-[3px] data-[pressed]:shadow-[0_1px_0_0_var(--yan-c)]",
        ghost: "text-foreground hover:bg-accent data-[pressed]:bg-accent",
        link: "rounded-md text-yan-sakura-edge underline decoration-primary/0 decoration-wavy underline-offset-4 hover:decoration-primary",
      },
      size: {
        sm: "h-8 px-4 text-xs [--yan-depth:3px] has-[>svg]:px-3",
        default: "h-10 px-6 text-sm [--yan-depth:4px] has-[>svg]:px-5",
        lg: "h-13 px-9 text-base [--yan-depth:6px] has-[>svg]:px-7",
        icon: "size-10 [--yan-depth:4px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/** Each candy colour: its surface and edge, its ink, and the burst colours that match it. */
const colors = {
  sakura: {
    tint: "[--yan-c:var(--primary)] [--yan-edge:var(--yan-sakura-edge)]",
    ink: "text-primary-foreground",
    fx: ["--yan-fx-1", "--yan-fx-4", "--yan-fx-2"],
  },
  lavender: {
    tint: "[--yan-c:var(--secondary)] [--yan-edge:var(--yan-lavender-edge)]",
    ink: "text-secondary-foreground",
    fx: ["--yan-fx-2", "--yan-fx-5", "--yan-fx-1"],
  },
  mint: {
    tint: "[--yan-c:var(--yan-mint)] [--yan-edge:var(--yan-mint-edge)]",
    ink: "text-yan-mint-foreground",
    fx: ["--yan-fx-3", "--yan-fx-5", "--yan-fx-4"],
  },
  sky: {
    tint: "[--yan-c:var(--yan-sky)] [--yan-edge:var(--yan-sky-edge)]",
    ink: "text-yan-sky-foreground",
    fx: ["--yan-fx-5", "--yan-fx-2", "--yan-fx-4"],
  },
  lemon: {
    tint: "[--yan-c:var(--yan-lemon)] [--yan-edge:var(--yan-lemon-edge)]",
    ink: "text-yan-lemon-foreground",
    fx: ["--yan-fx-4", "--yan-fx-1", "--yan-fx-3"],
  },
  peach: {
    tint: "[--yan-c:var(--yan-peach)] [--yan-edge:var(--yan-peach-edge)]",
    ink: "text-yan-peach-foreground",
    fx: ["--yan-fx-1", "--yan-fx-4"],
  },
}

type ButtonColor = keyof typeof colors

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Candy colour of the `default` and `outline` variants. */
    color?: ButtonColor
    asChild?: boolean
    /**
     * How much moe. `"kawaii"` squishes like mochi, then lands with a soft
     * glow, emphasis lines, rolling clouds, sparkles and a slammed-in
     * onomatopoeia sticker; `"subtle"` keeps a small bounce and a few
     * sparkles; `"off"` behaves like a plain button.
     */
    intensity?: YanIntensity
    /** Onomatopoeia shown on click in kawaii mode. `false` hides it. */
    sfx?: string | false
    /** Fine-tune the click burst (merged over the intensity preset). */
    fx?: BurstOptions
  }

function Button({
  className,
  variant = "default",
  color = "sakura",
  size = "default",
  asChild = false,
  intensity = "kawaii",
  sfx,
  fx,
  onClick,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  const pressAnim = React.useRef<Animation | null>(null)
  const squishes = intensity !== "off" && !["link", "ghost"].includes(variant ?? "")

  const press = (el: HTMLElement) => {
    el.dataset.pressed = ""
    if (!squishes || prefersReducedMotion()) return
    const squash = intensity === "kawaii" ? "1.07 0.88" : "1.02 0.96"
    pressAnim.current?.cancel()
    pressAnim.current = el.animate([{ scale: "1 1" }, { scale: squash }], {
      duration: 110,
      easing: "cubic-bezier(.3,.7,.4,1)",
      fill: "forwards",
    })
  }

  const release = (el: HTMLElement) => {
    if (!("pressed" in el.dataset)) return
    delete el.dataset.pressed
    if (!squishes || prefersReducedMotion()) return
    const from = intensity === "kawaii" ? "1.07 0.88" : "1.02 0.96"
    pressAnim.current?.cancel()
    pressAnim.current = null
    // Jelly release: overshoot the other way, then settle. ぷるん.
    el.animate(
      intensity === "kawaii"
        ? [
            { scale: from },
            { scale: "0.94 1.08" },
            { scale: "1.03 0.97" },
            { scale: "0.99 1.01" },
            { scale: "1 1" },
          ]
        : [{ scale: from }, { scale: "0.99 1.01" }, { scale: "1 1" }],
      { duration: intensity === "kawaii" ? 520 : 240, easing: "ease-out" }
    )
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-intensity={intensity}
      className={cn(
        buttonVariants({ variant, size }),
        variant !== "destructive" && colors[color].tint,
        variant === "default" && colors[color].ink,
        className
      )}
      onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(e)
        if (e.button === 0 && !e.defaultPrevented) press(e.currentTarget)
      }}
      onPointerUp={(e: React.PointerEvent<HTMLButtonElement>) => {
        onPointerUp?.(e)
        release(e.currentTarget)
      }}
      onPointerLeave={(e: React.PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(e)
        release(e.currentTarget)
      }}
      onPointerCancel={(e: React.PointerEvent<HTMLButtonElement>) => {
        onPointerCancel?.(e)
        release(e.currentTarget)
      }}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        if (e.defaultPrevented || intensity === "off") return
        const preset = fxPresets[intensity]
        const word =
          intensity === "kawaii" && sfx !== false ? (sfx ?? pickWord()) : null
        const palette =
          variant === "destructive" ? ["--yan-fx-1", "--yan-fx-4"] : variant === "default" || variant === "outline" ? colors[color].fx : undefined
        burstFromEvent(e, { ...preset, colors: palette, word, ...fx })
        // Kawaii candy buttons get the full beat: a soft glow, emphasis
        // lines and clouds rolling off both ends.
        if (intensity === "kawaii" && squishes) impact(e.currentTarget, { color: palette?.[0] })
      }}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps, ButtonColor }
