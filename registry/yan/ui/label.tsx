"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  /** Add a little star after the text. Decorative: still set `required` on the field. */
  required?: boolean
  /**
   * How much moe. `"kawaii"`: the star twinkles, and when the field named by
   * `htmlFor` takes focus the label hops, turns sakura and gets a wavy
   * underline while its star spins. `"subtle"`: it only turns sakura. `"off"`: nothing moves.
   */
  intensity?: "kawaii" | "subtle" | "off"
}

/** A chunky label that perks up while its field has focus. */
function Label({ className, children, required = false, intensity = "kawaii", htmlFor, ref, ...props }: LabelProps) {
  const label = React.useRef<HTMLLabelElement | null>(null)
  const [active, setActive] = React.useState(false)

  React.useEffect(() => {
    const field = htmlFor ? document.getElementById(htmlFor) : null
    if (!field || intensity === "off") return
    const on = () => {
      setActive(true)
      if (intensity !== "kawaii" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      label.current?.animate(
        [{ translate: "0 0" }, { translate: "0 -5px", offset: 0.35 }, { translate: "0 1px", offset: 0.7 }, { translate: "0 0" }],
        { duration: 380, easing: "ease-out" }
      )
    }
    const off = () => setActive(false)
    field.addEventListener("focus", on)
    field.addEventListener("blur", off)
    return () => {
      field.removeEventListener("focus", on)
      field.removeEventListener("blur", off)
    }
  }, [htmlFor, intensity])

  return (
    <LabelPrimitive.Root
      ref={(el) => {
        label.current = el
        if (typeof ref === "function") ref(el)
        else if (ref) ref.current = el
      }}
      htmlFor={htmlFor}
      data-slot="label"
      data-intensity={intensity}
      data-active={active || undefined}
      className={cn(
        "group/label flex w-fit items-center gap-1.5 text-sm leading-none font-extrabold select-none",
        "decoration-primary decoration-wavy decoration-2 underline-offset-4",
        "data-[active]:text-yan-sakura-edge dark:data-[active]:text-yan-sakura",
        intensity !== "off" && "transition-colors duration-200",
        intensity === "kawaii" && "data-[active]:underline",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span
          aria-hidden="true"
          data-slot="label-required"
          className={cn(
            "grid shrink-0",
            intensity === "kawaii" &&
              "transition-[rotate,scale] duration-500 ease-[cubic-bezier(.34,1.7,.5,1)] group-data-[active]/label:scale-140 group-data-[active]/label:rotate-180 motion-reduce:transition-none"
          )}
        >
          <svg
            viewBox="0 0 16 16"
            className={cn(
              "size-3 fill-yan-sakura-edge dark:fill-yan-sakura",
              intensity === "kawaii" && "animate-[yan-twinkle_1.8s_ease-in-out_infinite] motion-reduce:animate-none"
            )}
          >
            <path d="M8 1c.6 3.6 1.4 5.4 6 7-4.6 1.6-5.4 3.4-6 7-.6-3.6-1.4-5.4-6-7 4.6-1.6 5.4-3.4 6-7Z" />
          </svg>
        </span>
      )}
    </LabelPrimitive.Root>
  )
}

export { Label }
export type { LabelProps }
