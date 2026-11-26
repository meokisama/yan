"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, puff, type YanIntensity } from "@/lib/yan-fx"

type ToastVariant = "default" | "success" | "error"

type ToastOptions = {
  title: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  /** Milliseconds before it leaves by itself. */
  duration?: number
  /** Onomatopoeia sticker shown as the toast lands (kawaii only). `false` hides it. */
  sfx?: string | false
}

type ToastItem = ToastOptions & { id: number; open: boolean }

/* A tiny store, so `toast()` works from anywhere: event handlers, effects, non-React code. */
const MAX_VISIBLE = 4
const EMPTY: ToastItem[] = []
let items: ToastItem[] = EMPTY
let nextId = 0
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

/** Show a toast. Needs one `<Toaster />` mounted somewhere in the app. */
function toast(options: ToastOptions | string) {
  const id = ++nextId
  const o = typeof options === "string" ? { title: options } : options
  items = [...items, { ...o, id, open: true }].slice(-MAX_VISIBLE)
  emit()
  return id
}
toast.success = (title: React.ReactNode, o?: Omit<ToastOptions, "title" | "variant">) =>
  toast({ ...o, title, variant: "success" })
toast.error = (title: React.ReactNode, o?: Omit<ToastOptions, "title" | "variant">) =>
  toast({ ...o, title, variant: "error" })
toast.dismiss = (id: number) => {
  items = items.map((t) => (t.id === id ? { ...t, open: false } : t))
  emit()
}

function remove(id: number) {
  items = items.filter((t) => t.id !== id)
  emit()
}

const INK = "oklch(0.3 0.08 335)"

/** The candy mark is a tiny face that reacts to the news. */
const faces: Record<ToastVariant, React.ReactNode> = {
  // content: round eyes, ω mouth
  default: (
    <>
      <ellipse cx="8.2" cy="10.6" rx="1.5" ry="2" fill={INK} />
      <ellipse cx="15.8" cy="10.6" rx="1.5" ry="2" fill={INK} />
      <path d="M10 14.2 q1 1.5 2 0 q1 1.5 2 0" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  // delighted: ^ ^ eyes, open smile
  success: (
    <>
      <path d="M6 11.6 q2.2 -3 4.4 0 M13.6 11.6 q2.2 -3 4.4 0" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.6 13.8 q2.4 3.4 4.8 0 Z" fill={INK} />
    </>
  ),
  // flustered: > < eyes, wobbly mouth, sweat drop
  error: (
    <>
      <path d="M6.2 9 l3.4 2 l-3.4 2 M17.8 9 l-3.4 2 l3.4 2" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.4 15.6 q1.3 -1.6 2.6 0 q1.3 1.6 2.6 0" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M20 3.6 q2.2 3.2 0 4.4 q-2.2 -1.2 0 -4.4 Z" fill="#8fd0ff" stroke="#fff" strokeWidth="0.6" />
    </>
  ),
}

const looks: Record<ToastVariant, { tint: string; sfx: string; colors: string[] }> = {
  default: {
    tint: "[--yan-c:var(--yan-sakura)] [--yan-edge:var(--yan-sakura-edge)]",
    sfx: "ぽんっ",
    colors: ["--yan-fx-1", "--yan-fx-2", "--yan-fx-4"],
  },
  success: {
    tint: "[--yan-c:var(--yan-mint)] [--yan-edge:var(--yan-mint-edge)]",
    sfx: "やった！",
    colors: ["--yan-fx-3", "--yan-fx-4", "--yan-fx-5"],
  },
  error: {
    tint: "[--yan-c:var(--destructive)] [--yan-edge:var(--yan-coral-edge)]",
    sfx: "あわわ",
    colors: ["--yan-fx-1", "--yan-fx-4"],
  },
}

function ToastCard({ item, intensity }: { item: ToastItem; intensity: YanIntensity }) {
  const mark = React.useRef<HTMLSpanElement>(null)
  const card = React.useRef<HTMLLIElement>(null)
  const look = looks[item.variant ?? "default"]
  const { sfx } = item

  React.useEffect(() => {
    if (intensity === "off") return
    const kawaii = intensity === "kawaii"
    // Wait for the smear to hit its stop, then: dust under the card, a pop from the face.
    const t = setTimeout(() => {
      if (kawaii && card.current) {
        const r = card.current.getBoundingClientRect()
        puff({ x: r.left + 10, y: r.bottom }, { count: 2, size: 9, angle: -Math.PI * 0.85, spread: 0.7, color: look.colors[0] })
        puff({ x: r.right - 10, y: r.bottom }, { count: 2, size: 9, angle: -Math.PI * 0.15, spread: 0.7, color: look.colors[0] })
      }
      if (mark.current)
        burst(mark.current, {
          shapes: kawaii ? ["sparkle", "heart", "star"] : ["sparkle"],
          colors: look.colors,
          count: kawaii ? 10 : 4,
          power: kawaii ? 0.7 : 0.4,
          size: kawaii ? 9 : 6,
          word: kawaii && sfx !== false ? (sfx ?? look.sfx) : null,
          wordStyle: "slam",
        })
    }, 230)
    return () => clearTimeout(t)
  }, [intensity, look, sfx])

  return (
    <ToastPrimitive.Root
      ref={card}
      data-slot="toast"
      data-variant={item.variant ?? "default"}
      open={item.open}
      duration={item.duration ?? 4000}
      onOpenChange={(open) => {
        if (open) return
        toast.dismiss(item.id)
        setTimeout(() => remove(item.id), 200)
      }}
      className={cn(
        "group/toast pointer-events-auto relative flex w-full items-start gap-3 rounded-3xl bg-card p-4 pr-10 text-card-foreground",
        "shadow-[inset_0_2px_0_0_rgb(255_255_255/0.5),inset_0_0_0_2px_var(--yan-c),0_6px_0_0_var(--yan-edge),0_22px_36px_-16px_var(--yan-edge)]",
        "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[translate] data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)",
        "data-[state=closed]:animate-[yan-fade-out_0.18s_ease-in] data-[swipe=end]:animate-[yan-toast-out_0.18s_ease-in]",
        intensity === "kawaii" && "origin-right data-[state=open]:animate-[yan-toast-in_0.48s_ease-out]",
        intensity === "subtle" && "data-[state=open]:animate-[yan-fade-in_0.2s_ease-out]",
        "motion-reduce:animate-none",
        look.tint
      )}
    >
      <span
        ref={mark}
        aria-hidden="true"
        className="yan-candy relative grid size-10 shrink-0 place-items-center rounded-full [--yan-depth:3px]"
      >
        <svg viewBox="0 0 24 24" className="size-7 overflow-visible">
          <ellipse cx="4.6" cy="14.4" rx="2.3" ry="1.4" fill="#fff" opacity="0.55" />
          <ellipse cx="19.4" cy="14.4" rx="2.3" ry="1.4" fill="#fff" opacity="0.55" />
          {faces[item.variant ?? "default"]}
        </svg>
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <ToastPrimitive.Title data-slot="toast-title" className="text-sm font-black">
          {item.title}
        </ToastPrimitive.Title>
        {item.description && (
          <ToastPrimitive.Description
            data-slot="toast-description"
            className="mt-0.5 text-sm font-medium text-pretty text-muted-foreground"
          >
            {item.description}
          </ToastPrimitive.Description>
        )}
      </div>
      <ToastPrimitive.Close
        aria-label="Dismiss"
        className="absolute top-3 right-3 grid size-6 cursor-pointer place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/50"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
          <path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  )
}

type ToasterProps = Omit<React.ComponentProps<typeof ToastPrimitive.Viewport>, "children"> & {
  /** How much moe: `"kawaii"` bounces in with a sticker, `"subtle"` fades with sparkles, `"off"` just appears. */
  intensity?: YanIntensity
}

/** Mount once, near the root of your app. Renders whatever `toast()` sends. */
function Toaster({ className, intensity = "kawaii", ...props }: ToasterProps) {
  const list = React.useSyncExternalStore(
    subscribe,
    () => items,
    () => EMPTY
  )

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {list.map((item) => (
        <ToastCard key={item.id} item={item} intensity={intensity} />
      ))}
      <ToastPrimitive.Viewport
        data-slot="toaster"
        className={cn(
          "pointer-events-none fixed right-0 bottom-0 z-[100] flex w-full max-w-sm flex-col gap-4 p-4 pb-6 outline-none",
          className
        )}
        {...props}
      />
    </ToastPrimitive.Provider>
  )
}

export { Toaster, toast }
export type { ToastOptions, ToasterProps, ToastVariant }
