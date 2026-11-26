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

const tints = {
  sakura: { c: "--primary", edge: "--yan-sakura-edge", text: "data-[state=active]:text-primary-foreground" },
  lavender: { c: "--secondary", edge: "--yan-lavender-edge", text: "data-[state=active]:text-secondary-foreground" },
  mint: { c: "--yan-mint", edge: "--yan-mint-edge", text: "data-[state=active]:text-yan-mint-foreground" },
  sky: { c: "--yan-sky", edge: "--yan-sky-edge", text: "data-[state=active]:text-yan-sky-foreground" },
  lemon: { c: "--yan-lemon", edge: "--yan-lemon-edge", text: "data-[state=active]:text-yan-lemon-foreground" },
  peach: { c: "--yan-peach", edge: "--yan-peach-edge", text: "data-[state=active]:text-yan-peach-foreground" },
} as const

type TabsColor = keyof typeof tints

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
      const tint = tints[tab.dataset.color as TabsColor] ?? tints.sakura
      pill.style.setProperty("--yan-c", `var(${tint.c})`)
      pill.style.setProperty("--yan-edge", `var(${tint.edge})`)
      pill.style.opacity = "1"
      pill.style.top = `${next.top}px`
      pill.style.left = `${next.left}px`
      pill.style.right = `${next.right}px`
      pill.style.bottom = `${next.bottom}px`

      if (lively && intensity === "kawaii") {
        tab.animate([{ scale: "1" }, { scale: "0.84", offset: 0.3 }, { scale: "1.12", offset: 0.65 }, { scale: "1" }], {
          duration: 420,
          delay: 110,
          easing: "ease-out",
        })
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
        "relative isolate inline-flex w-fit items-center gap-1 rounded-full bg-muted p-1.5 pb-2.5",
        "shadow-[inset_0_0_0_2px_var(--border),inset_0_3px_5px_0_rgb(0_0_0/0.1)]",
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
      >
        <svg
          viewBox="0 0 16 16"
          className={cn(
            "absolute -top-2 right-1 size-4 fill-yan-lemon stroke-yan-lemon-edge",
            intensity === "kawaii" && "animate-[yan-twinkle_1.8s_ease-in-out_infinite] motion-reduce:animate-none"
          )}
        >
          <path
            d="M8 1c.6 3.6 1.4 5.4 6 7-4.6 1.6-5.4 3.4-6 7-.6-3.6-1.4-5.4-6-7 4.6-1.6 5.4-3.4 6-7Z"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </TabsPrimitive.List>
  )
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  /** The candy takes this colour while the tab is active. */
  color?: TabsColor
}

function TabsTrigger({ className, color = "sakura", onPointerDown, onKeyDown, onBlur, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-color={color}
      // Radix calls focus() on mousedown, which Chrome treats as keyboard focus: mark pointer focus to hide the ring.
      onPointerDown={(e) => {
        e.currentTarget.dataset.pointer = ""
        onPointerDown?.(e)
      }}
      onKeyDown={(e) => {
        delete e.currentTarget.dataset.pointer
        onKeyDown?.(e)
      }}
      onBlur={(e) => {
        delete e.currentTarget.dataset.pointer
        onBlur?.(e)
      }}
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-extrabold whitespace-nowrap text-muted-foreground outline-none",
        "transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
        "not-data-pointer:focus-visible:ring-4 not-data-pointer:focus-visible:ring-ring/50",
        "data-[state=inactive]:hover:bg-foreground/[0.07] data-[state=inactive]:hover:text-foreground data-[state=inactive]:active:bg-foreground/[0.12]",
        "data-[state=active]:[text-shadow:0_1px_0_rgb(255_255_255/0.4)]",
        tints[color].text,
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
export type { TabsListProps, TabsTriggerProps, TabsColor }
