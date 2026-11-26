"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { burst, puff, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type InputProps = React.ComponentProps<"input"> & {
  /**
   * How much moe. `"kawaii"`: every keystroke kicks a sparkle up from the
   * caret, and deleting leaves a little puff. `"subtle"` and `"off"` keep
   * only the focus ring.
   */
  intensity?: YanIntensity
  /** Fine-tune the per-keystroke burst. */
  fx?: BurstOptions
}

let ruler: CanvasRenderingContext2D | null = null

/** Viewport position of the text caret, measured with a canvas ruler. */
function caretPoint(el: HTMLInputElement) {
  const rect = el.getBoundingClientRect()
  const cs = getComputedStyle(el)
  const padLeft = parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth)
  const padRight = parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth)
  let index = el.value.length
  try {
    index = el.selectionStart ?? index
  } catch {
    // email / number inputs do not expose a selection: fall back to the end
  }
  const text = el.type === "password" ? "•".repeat(index) : el.value.slice(0, index)
  ruler ??= document.createElement("canvas").getContext("2d")
  let width = 0
  if (ruler) {
    ruler.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    width = ruler.measureText(text).width
  }
  const x = rect.left + padLeft + width - el.scrollLeft
  return {
    x: Math.max(rect.left + padLeft, Math.min(rect.right - padRight, x)),
    y: rect.top + rect.height / 2 - parseFloat(cs.fontSize) * 0.55,
  }
}

/** A pill-shaped field pressed into the page. Typing in it throws sparkles off the caret. */
function Input({ className, type, intensity = "kawaii", fx, onInput, ...props }: InputProps) {
  const last = React.useRef(0)

  return (
    <input
      type={type}
      data-slot="input"
      data-intensity={intensity}
      className={cn(
        "h-11 w-full min-w-0 rounded-full border-2 border-input bg-card px-4 text-sm font-bold text-foreground outline-none",
        "shadow-[inset_0_2px_4px_0_rgb(0_0_0/0.07)] transition-[border-color,box-shadow] duration-200",
        "placeholder:font-medium placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground",
        "hover:border-primary focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/35",
        "file:mr-3 file:h-full file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-extrabold file:text-yan-sakura-edge",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/30",
        className
      )}
      onInput={(e) => {
        onInput?.(e)
        if (intensity !== "kawaii") return
        const now = performance.now()
        if (now - last.current < 45) return
        last.current = now
        const point = caretPoint(e.currentTarget)
        const deleting = (e.nativeEvent as InputEvent).inputType?.startsWith("delete")
        if (deleting) puff(point, { count: 1, size: 6, power: 0.35, color: "--yan-fx-2" })
        else
          burst(point, {
            shapes: ["sparkle", "heart", "dot"],
            count: 2,
            power: 0.38,
            size: 7,
            angle: -Math.PI / 2,
            spread: 1.3,
            gravity: 300,
            ...fx,
          })
      }}
      {...props}
    />
  )
}

export { Input }
export type { InputProps }
