"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, type YanIntensity } from "@/lib/yan-fx"

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-4", className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full bg-muted p-1 pb-2 shadow-[inset_0_2px_4px_0_rgb(0_0_0/0.09)]",
        className
      )}
      {...props}
    />
  )
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  /** How much moe: `"kawaii"` pops the tab and a few sparkles, `"subtle"` only pops, `"off"` neither. */
  intensity?: YanIntensity
}

/** The active tab is a gummy candy sitting in a tray. */
function TabsTrigger({ className, intensity = "kawaii", onMouseDown, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-intensity={intensity}
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-extrabold whitespace-nowrap text-muted-foreground outline-none",
        "transition-colors hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        "[--yan-depth:3px] data-[state=active]:yan-candy data-[state=active]:text-primary-foreground",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        intensity !== "off" && "data-[state=active]:animate-[yan-pop_0.4s_ease-out] motion-reduce:animate-none",
        className
      )}
      onMouseDown={(e) => {
        onMouseDown?.(e)
        if (intensity !== "kawaii" || e.button !== 0 || e.currentTarget.dataset.state === "active") return
        burst(e.currentTarget, { shapes: ["sparkle", "dot"], count: 6, power: 0.5, size: 7 })
      }}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "outline-none data-[state=active]:animate-[yan-fade-up_0.3s_ease-out] motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
export type { TabsTriggerProps }
