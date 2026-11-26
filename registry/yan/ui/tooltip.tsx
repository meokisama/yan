"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import type { YanIntensity } from "@/lib/yan-fx"

function TooltipProvider({ delayDuration = 150, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Content> & {
  /** How much moe: `"kawaii"` pops in with a bounce, `"subtle"` fades, `"off"` just appears. */
  intensity?: YanIntensity
}

/** A little speech bubble that pops out of whatever it describes. */
function TooltipContent({
  className,
  sideOffset = 8,
  intensity = "kawaii",
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        data-intensity={intensity}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit max-w-64 origin-(--radix-tooltip-content-transform-origin) rounded-2xl bg-foreground px-3 py-1.5 text-xs font-extrabold text-balance text-background",
          "shadow-[0_3px_0_0_rgb(0_0_0/0.2),0_8px_16px_-6px_rgb(0_0_0/0.35)]",
          intensity === "kawaii" &&
            "animate-[yan-pop-in_0.3s_cubic-bezier(.34,1.7,.5,1)] data-[state=closed]:animate-[yan-pop-out_0.12s_ease-in] motion-reduce:animate-none",
          intensity === "subtle" &&
            "animate-[yan-fade-in_0.15s_ease-out] data-[state=closed]:animate-[yan-fade-out_0.1s_ease-in] motion-reduce:animate-none",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow width={14} height={7} className="fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
export type { TooltipContentProps }
