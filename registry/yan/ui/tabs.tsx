"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { prefersReducedMotion, puff, type YanIntensity } from "@/lib/yan-fx"

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-4", className)} {...props} />
}

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & {
  /**
   * How much moe. `"kawaii"`: the candy stretches toward the new tab like
   * pulled mochi, snaps over and lands in a puff. `"subtle"`: it slides.
   * `"off"`: it jumps.
   */
  intensity?: YanIntensity
}

type Box = { top: number; right: number; bottom: number; left: number }

/** A tray of tabs. One gummy candy lives in it and travels to whichever tab is active. */
function TabsList({ className, children, intensity = "kawaii", ...props }: TabsListProps) {
  const list = React.useRef<HTMLDivElement>(null)
  const candy = React.useRef<HTMLSpanElement>(null)
  const box = React.useRef<Box | null>(null)

  React.useEffect(() => {
    const el = list.current
    const pill = candy.current
    if (!el || !pill) return

    const place = (animate: boolean) => {
      const tab = el.querySelector<HTMLElement>("[data-slot=tabs-trigger][data-state=active]")
      if (!tab) {
        pill.style.opacity = "0"
        return
      }
      const next: Box = {
        top: tab.offsetTop,
        left: tab.offsetLeft,
        right: el.clientWidth - tab.offsetLeft - tab.offsetWidth,
        bottom: el.clientHeight - tab.offsetTop - tab.offsetHeight,
      }
      const prev = box.current
      box.current = next
      const moved = !!prev && (prev.left !== next.left || prev.top !== next.top)
      const lively = animate && moved && intensity !== "off" && !prefersReducedMotion()

      if (!lively) pill.style.transition = "none"
      else if (intensity === "subtle") pill.style.transition = ["top", "right", "bottom", "left"].map((p) => `${p} 0.25s ease-out`).join(", ")
      else {
        // Mochi stretch: the leading edge shoots ahead, the trailing edge snaps after it.
        const lead = "0.2s cubic-bezier(.3,.9,.3,1)"
        const trail = "0.36s cubic-bezier(.34,1.6,.5,1) 0.07s"
        const forward = next.left > prev!.left || next.top > prev!.top
        pill.style.transition = forward
          ? `right ${lead}, bottom ${lead}, left ${trail}, top ${trail}`
          : `left ${lead}, top ${lead}, right ${trail}, bottom ${trail}`
      }
      pill.style.opacity = "1"
      pill.style.top = `${next.top}px`
      pill.style.left = `${next.left}px`
      pill.style.right = `${next.right}px`
      pill.style.bottom = `${next.bottom}px`

      if (lively && intensity === "kawaii") {
        const forward = next.left >= prev!.left
        setTimeout(() => {
          if (!tab.isConnected) return
          const r = tab.getBoundingClientRect()
          puff(
            { x: forward ? r.right - 4 : r.left + 4, y: r.bottom - 2 },
            { count: 2, size: 8, angle: forward ? -0.4 : -Math.PI + 0.4, spread: 0.9 }
          )
        }, 260)
      }
    }

    place(false)
    const mo = new MutationObserver(() => place(true))
    mo.observe(el, { attributes: true, attributeFilter: ["data-state"], subtree: true })
    const ro = new ResizeObserver(() => place(false))
    ro.observe(el)
    return () => {
      mo.disconnect()
      ro.disconnect()
    }
  }, [intensity])

  return (
    <TabsPrimitive.List
      ref={list}
      data-slot="tabs-list"
      data-intensity={intensity}
      className={cn(
        "relative isolate inline-flex w-fit items-center gap-1 rounded-full bg-muted p-1 pb-2 shadow-[inset_0_2px_4px_0_rgb(0_0_0/0.09)]",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:rounded-3xl",
        className
      )}
      {...props}
    >
      <span
        ref={candy}
        aria-hidden="true"
        data-slot="tabs-candy"
        className="yan-candy pointer-events-none absolute -z-10 rounded-full opacity-0 [--yan-depth:3px]"
      />
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-extrabold whitespace-nowrap text-muted-foreground outline-none",
        "transition-colors duration-200 hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:text-primary-foreground data-[state=active]:[text-shadow:0_1px_0_rgb(255_255_255/0.4)]",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
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
export type { TabsListProps }
