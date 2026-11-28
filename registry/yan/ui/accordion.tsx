"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, prefersReducedMotion, puff, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type AccordionFx = { intensity: YanIntensity; fx?: BurstOptions }

const AccordionContext = React.createContext<AccordionFx>({ intensity: "kawaii" })

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root> & {
  /**
   * How much moe. `"kawaii"`: the bud on the row blooms into a sakura, the row
   * wobbles like jelly and petals fall into the panel as it unfolds.
   * `"subtle"`: the bud blooms and the panel unfolds with a few sparkles.
   * `"off"`: it just opens.
   */
  intensity?: YanIntensity
  /** Fine-tune the burst that falls from the flower when an item opens. */
  fx?: BurstOptions
}

function Accordion({ className, intensity = "kawaii", fx, ...props }: AccordionProps) {
  const value = React.useMemo(() => ({ intensity, fx }), [intensity, fx])
  return (
    <AccordionContext.Provider value={value}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-intensity={intensity}
        className={cn("flex w-full flex-col gap-3", className)}
        {...props}
      />
    </AccordionContext.Provider>
  )
}

/** One row. It rises onto a candy edge while it is open. */
function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const { intensity } = React.useContext(AccordionContext)
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "rounded-3xl bg-card text-card-foreground shadow-[inset_0_0_0_2px_var(--border)]",
        "data-[state=open]:bg-[linear-gradient(180deg,color-mix(in_oklch,var(--primary)_16%,var(--card)),var(--card)_70%)]",
        "data-[state=open]:shadow-[inset_0_2px_0_0_rgb(255_255_255/0.5),inset_0_0_0_2px_var(--primary),0_6px_0_0_var(--yan-sakura-edge),0_20px_30px_-16px_var(--yan-sakura-edge)]",
        intensity !== "off" && "transition-[box-shadow] duration-200 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

const PETALS = [0, 72, 144, 216, 288]

function AccordionTrigger({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const { intensity, fx } = React.useContext(AccordionContext)
  const flower = React.useRef<HTMLSpanElement>(null)
  const lively = intensity !== "off"

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-4 rounded-3xl px-5 py-4 text-left text-sm font-extrabold outline-none",
          "focus-visible:ring-4 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={(e) => {
          onClick?.(e)
          const el = flower.current
          // still the old state here: it flips after this handler
          const opening = e.currentTarget.dataset.state === "closed"
          if (e.defaultPrevented || intensity === "off" || !el) return
          if (!opening) {
            if (intensity === "kawaii") puff(el, { count: 1, size: 7, power: 0.4 })
            return
          }
          if (intensity === "subtle") {
            burst(el, { shapes: ["sparkle"], count: 3, power: 0.35, size: 6, ...fx })
            return
          }
          if (!prefersReducedMotion())
            e.currentTarget
              .closest("[data-slot=accordion-item]")
              ?.animate(
                [{ scale: "1 1" }, { scale: "1.015 0.96", offset: 0.3 }, { scale: "0.995 1.02", offset: 0.62 }, { scale: "1 1" }],
                { duration: 460, easing: "ease-out" }
              )
          // let the flower open first, then drop its petals into the panel
          setTimeout(() => {
            if (!el.isConnected) return
            burst(el, {
              shapes: ["petal", "petal", "sparkle"],
              colors: ["--yan-fx-1", "--yan-sakura", "--yan-fx-4"],
              count: 7,
              power: 0.4,
              size: 8,
              angle: Math.PI / 2,
              spread: 2,
              ...fx,
            })
          }, 180)
        }}
        {...props}
      >
        <span className="min-w-0">{children}</span>
        <span
          ref={flower}
          aria-hidden="true"
          className={cn(
            "yan-candy relative grid size-8 shrink-0 place-items-center rounded-full [--yan-depth:2px]",
            lively &&
              "transition-[scale] duration-300 ease-[cubic-bezier(.34,1.7,.5,1)] group-hover/trigger:scale-110 group-data-[state=open]/trigger:scale-115 motion-reduce:transition-none"
          )}
        >
          {/* a bud while closed, a sakura while open */}
          <svg
            viewBox="0 0 24 24"
            className={cn(
              "size-6 -rotate-90 group-data-[state=open]/trigger:rotate-0",
              lively && "transition-[rotate] duration-500 ease-[cubic-bezier(.34,1.5,.5,1)] motion-reduce:transition-none"
            )}
          >
            {PETALS.map((angle, i) => (
              <g key={angle} transform={`rotate(${angle} 12 12)`}>
                <path
                  d="M12 12C8.6 9.4 8.8 4.6 11 2.6l1 1.2 1-1.2c2.2 2 2.4 6.8-1 9.4Z"
                  fill="#fff"
                  style={{ transitionDelay: lively ? `${i * 45}ms` : undefined }}
                  className={cn(
                    "origin-center scale-[0.42] [transform-box:view-box] group-data-[state=open]/trigger:scale-100",
                    lively && "transition-[scale] duration-300 ease-[cubic-bezier(.34,1.7,.5,1)] motion-reduce:transition-none"
                  )}
                />
              </g>
            ))}
            <circle
              cx="12"
              cy="12"
              r="2.2"
              className={cn(
                "origin-center scale-0 fill-yan-lemon stroke-yan-lemon-edge [transform-box:view-box] group-data-[state=open]/trigger:scale-100",
                lively && "transition-[scale] delay-200 duration-300 ease-[cubic-bezier(.34,1.7,.5,1)] motion-reduce:transition-none"
              )}
            />
          </svg>
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const { intensity } = React.useContext(AccordionContext)
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "group/content overflow-hidden text-sm font-medium text-muted-foreground",
        intensity !== "off" &&
          "data-[state=open]:animate-[yan-accordion-down_0.3s_ease-out] data-[state=closed]:animate-[yan-accordion-up_0.2s_ease-in] motion-reduce:animate-none"
      )}
      {...props}
    >
      <div
        className={cn(
          "px-5 pb-5 text-pretty",
          intensity === "kawaii" &&
            "group-data-[state=open]/content:animate-[yan-fade-up_0.4s_ease-out_0.08s_both] motion-reduce:animate-none",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
export type { AccordionProps }
