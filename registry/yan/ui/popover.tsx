"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, puff, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverClose(props: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Content> & {
  /**
   * How much moe. `"kawaii"`: the bubble lands like jelly with two puffs and a
   * spray of stars, wears a twinkling star on its corner, and leaves in a
   * cloud. `"subtle"` fades. `"off"` just appears.
   */
  intensity?: YanIntensity
  /** Fine-tune the burst fired when the popover opens (kawaii only). */
  fx?: BurstOptions
  /** Hide the little tail that points at the trigger. */
  hideArrow?: boolean
}

/** Mounted with the bubble: plays its entrance, and a cloud where it stood when it goes. */
function PopoverPop({ fx }: { fx?: BurstOptions }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  // read once: an inline `fx` object must not replay the entrance on every render
  const options = React.useRef(fx)

  // a layout effect, so its cleanup still finds the bubble in the page
  React.useLayoutEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    const t = setTimeout(() => {
      const r = el.getBoundingClientRect()
      const side = el.dataset.side
      // the edge of the bubble that faces its trigger
      const x = side === "left" ? r.right : side === "right" ? r.left : r.left + r.width / 2
      const y = side === "bottom" ? r.top : side === "top" ? r.bottom : r.top + r.height / 2
      puff({ x: x - 16, y }, { count: 2, size: 9, angle: -Math.PI * 0.8, spread: 0.7 })
      puff({ x: x + 16, y }, { count: 2, size: 9, angle: -Math.PI * 0.2, spread: 0.7 })
      burst(
        { x: r.right - 6, y: r.top + 4 },
        {
          shapes: ["star", "sparkle", "dot"],
          count: 9,
          power: 0.6,
          size: 9,
          colors: ["--yan-fx-4", "--yan-fx-1", "--yan-fx-2"],
          ...options.current,
        }
      )
    }, 150)
    return () => {
      clearTimeout(t)
      const r = el.getBoundingClientRect()
      if (r.width) puff({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, { count: 4, size: 13, power: 0.7, spread: Math.PI * 2 })
    }
  }, [])

  return (
    <span ref={ref} aria-hidden="true" className="pointer-events-none absolute -top-3.5 -right-2.5">
      <svg
        viewBox="0 0 16 16"
        className="size-7 animate-[yan-twinkle_1.8s_ease-in-out_infinite] fill-yan-lemon stroke-yan-lemon-edge motion-reduce:animate-none"
      >
        <path d="M8 1c.6 3.6 1.4 5.4 6 7-4.6 1.6-5.4 3.4-6 7-.6-3.6-1.4-5.4-6-7 4.6-1.6 5.4-3.4 6-7Z" strokeWidth="1.1" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

/** A puffy speech bubble that pops out of its trigger. */
function PopoverContent({
  className,
  children,
  align = "center",
  sideOffset = 12,
  intensity = "kawaii",
  fx,
  hideArrow = false,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        data-intensity={intensity}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 max-w-[calc(100vw-2rem)] origin-(--radix-popover-content-transform-origin) rounded-3xl border-2 border-primary p-5 text-sm text-popover-foreground outline-none",
          "bg-popover bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_14%,var(--popover)),var(--popover)_55%)]",
          "shadow-[inset_0_2px_0_0_rgb(255_255_255/0.6),0_6px_0_0_var(--yan-sakura-edge),0_24px_40px_-16px_var(--yan-sakura-edge)]",
          intensity === "kawaii" &&
            "data-[state=open]:animate-[yan-jelly-in_0.45s_ease-out] data-[state=closed]:animate-[yan-pop-out_0.12s_ease-in] motion-reduce:animate-none",
          intensity === "subtle" &&
            "data-[state=open]:animate-[yan-fade-in_0.15s_ease-out] data-[state=closed]:animate-[yan-fade-out_0.1s_ease-in] motion-reduce:animate-none",
          className
        )}
        {...props}
      >
        {children}
        {intensity === "kawaii" && <PopoverPop fx={fx} />}
        {!hideArrow && <PopoverPrimitive.Arrow width={18} height={9} className="fill-primary" />}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverAnchor, PopoverClose, PopoverContent }
export type { PopoverContentProps }
