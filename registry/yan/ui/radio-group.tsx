"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, fly, prefersReducedMotion, puff, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

const RadioGroupContext = React.createContext<YanIntensity>("kawaii")

type RadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  /**
   * How much moe. `"kawaii"`: the old radio lets go in a puff, a heart flies
   * to the one you chose and a gumdrop plops in with a ring of hearts.
   * `"subtle"`: it pops in with a few sparkles. `"off"`: it just moves.
   */
  intensity?: YanIntensity
  /** Fine-tune the burst fired where the heart lands. */
  fx?: BurstOptions
}

/** The radio wobbles as the gumdrop lands in it. */
function wobble(el: Element) {
  if (prefersReducedMotion()) return
  el.animate([{ scale: "1 1" }, { scale: "1.25 0.8", offset: 0.3 }, { scale: "0.9 1.12", offset: 0.6 }, { scale: "1 1" }], {
    duration: 420,
    easing: "ease-out",
  })
}

function RadioGroup({ className, intensity = "kawaii", fx, onValueChange, ref, ...props }: RadioGroupProps) {
  const root = React.useRef<HTMLDivElement | null>(null)

  return (
    <RadioGroupContext.Provider value={intensity}>
      <RadioGroupPrimitive.Root
        ref={(el) => {
          root.current = el
          if (typeof ref === "function") ref(el)
          else if (ref) ref.current = el
        }}
        data-slot="radio-group"
        data-intensity={intensity}
        className={cn("grid gap-3", className)}
        onValueChange={(value) => {
          onValueChange?.(value)
          if (intensity === "off") return
          const items = [...(root.current?.querySelectorAll<HTMLButtonElement>("[data-slot=radio-group-item]") ?? [])]
          const to = items.find((item) => item.value === value)
          // still the old state here: the DOM updates after this handler
          const from = items.find((item) => item.dataset.state === "checked")
          if (!to) return
          if (intensity === "subtle") {
            burst(to, { shapes: ["sparkle"], count: 4, power: 0.4, size: 6, ...fx })
            return
          }
          const land: BurstOptions = { shapes: ["heart", "dot", "sparkle"], count: 8, power: 0.55, size: 7, ring: true, ...fx }
          if (from && from !== to && !prefersReducedMotion()) {
            puff(from, { count: 1, size: 6, power: 0.35 })
            fly(from, to, { size: 6, arrive: land, onArrive: () => wobble(to) })
          } else {
            // nothing to fly from: wait for the plop, then burst
            setTimeout(() => {
              if (!to.isConnected) return
              burst(to, land)
              wobble(to)
            }, 240)
          }
        }}
        {...props}
      />
    </RadioGroupContext.Provider>
  )
}

/** A round radio. The chosen one holds a little gumdrop. */
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const intensity = React.useContext(RadioGroupContext)

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer relative grid size-6 shrink-0 cursor-pointer place-items-center rounded-full outline-none",
        "border-2 border-input bg-card shadow-[inset_0_2px_3px_0_rgb(0_0_0/0.07)]",
        "hover:border-primary focus-visible:ring-4 focus-visible:ring-ring/50 data-[state=checked]:border-primary data-[state=checked]:bg-accent",
        intensity !== "off" &&
          "transition-[border-color,background-color,scale] duration-200 ease-[cubic-bezier(.34,1.7,.5,1)] hover:scale-110 motion-reduce:transition-none",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={cn(
          "yan-candy relative block size-3.5 rounded-full [--yan-depth:1.5px]",
          // 0.26s: about how long the heart takes to fly over
          intensity === "kawaii" && "animate-[yan-plop_0.42s_ease-out_0.26s_both] motion-reduce:animate-none",
          intensity === "subtle" && "animate-[yan-pop-in_0.2s_ease-out] motion-reduce:animate-none"
        )}
      />
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
export type { RadioGroupProps }
