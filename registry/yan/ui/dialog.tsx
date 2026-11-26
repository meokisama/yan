"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, puff, speedLines, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[rgb(60_16_56/0.45)] backdrop-blur-sm",
        "data-[state=open]:animate-[yan-fade-in_0.2s_ease-out] data-[state=closed]:animate-[yan-fade-out_0.15s_ease-in] motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  /**
   * How much moe. `"kawaii"`: the card drops in, squashes as it lands, kicks
   * dust out of both bottom corners and throws stars off the top. `"subtle"`
   * fades. `"off"` just appears.
   */
  intensity?: YanIntensity
  /** Fine-tune the burst fired when the dialog opens (kawaii only). */
  fx?: BurstOptions
  /** Hide the round close button in the corner. */
  hideClose?: boolean
}

/** A puffy card that bounces onto the page. */
function DialogContent({
  className,
  children,
  intensity = "kawaii",
  fx,
  hideClose = false,
  onOpenAutoFocus,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-intensity={intensity}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-[2rem] bg-card p-7 text-card-foreground outline-none",
          "shadow-[inset_0_2px_0_0_rgb(255_255_255/0.5),inset_0_0_0_2px_var(--primary),0_8px_0_0_var(--yan-sakura-edge),0_30px_60px_-20px_var(--yan-sakura-edge)]",
          intensity === "kawaii" &&
            "data-[state=open]:animate-[yan-drop-in_0.5s_ease-out] data-[state=closed]:animate-[yan-pop-out_0.15s_ease-in] motion-reduce:animate-none",
          intensity === "subtle" &&
            "data-[state=open]:animate-[yan-fade-in_0.2s_ease-out] data-[state=closed]:animate-[yan-fade-out_0.15s_ease-in] motion-reduce:animate-none",
          className
        )}
        onOpenAutoFocus={(e) => {
          onOpenAutoFocus?.(e)
          const el = e.currentTarget
          if (intensity !== "kawaii" || !(el instanceof HTMLElement)) return
          // 45% into yan-drop-in is the frame where the card hits the floor.
          setTimeout(() => {
            if (!el.isConnected) return
            const r = el.getBoundingClientRect()
            speedLines(el, { reach: 34 })
            puff({ x: r.left + 14, y: r.bottom }, { count: 3, size: 13, angle: -Math.PI * 0.88, spread: 0.6 })
            puff({ x: r.right - 14, y: r.bottom }, { count: 3, size: 13, angle: -Math.PI * 0.12, spread: 0.6 })
            burst(
              { x: r.left + r.width / 2, y: r.top },
              { shapes: ["star", "sparkle", "heart"], count: 12, power: 0.85, size: 10, spread: Math.PI * 1.1, ...fx }
            )
          }, 225)
        }}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-4 right-4 grid size-8 cursor-pointer place-items-center rounded-full text-muted-foreground outline-none transition-[background-color,color,rotate] duration-300 hover:rotate-90 hover:bg-accent hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/50"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2 pr-8", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-2xl leading-tight font-black", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm font-medium text-pretty text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
export type { DialogContentProps }
