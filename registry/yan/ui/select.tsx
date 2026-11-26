"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { fly, prefersReducedMotion, type FxPoint, type YanIntensity } from "@/lib/yan-fx"

type SelectFx = {
  intensity: YanIntensity
  setTrigger: (el: HTMLButtonElement | null) => void
  /** Remember where the option the user just picked was on screen. */
  setPicked: (point: FxPoint) => void
}

const SelectFxContext = React.createContext<SelectFx | null>(null)

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
  /**
   * How much moe. `"kawaii"`: the menu pops open, and the option you pick
   * sends a heart flying back to the trigger, which wobbles as it lands.
   * `"subtle"`: the menu fades. `"off"`: it just appears.
   */
  intensity?: YanIntensity
}

function Select({ intensity = "kawaii", onValueChange, ...props }: SelectProps) {
  const trigger = React.useRef<HTMLButtonElement>(null)
  const picked = React.useRef<FxPoint | null>(null)
  const fx = React.useMemo<SelectFx>(
    () => ({
      intensity,
      setTrigger: (el) => {
        trigger.current = el
      },
      setPicked: (point) => {
        picked.current = point
      },
    }),
    [intensity]
  )

  return (
    <SelectFxContext.Provider value={fx}>
      <SelectPrimitive.Root
        data-slot="select"
        onValueChange={(value) => {
          onValueChange?.(value)
          const from = picked.current
          const to = trigger.current
          picked.current = null
          if (intensity !== "kawaii" || !from || !to || prefersReducedMotion()) return
          const r = to.getBoundingClientRect()
          fly(from, { x: r.left + 22, y: r.top + r.height / 2 }, {
            onArrive: () =>
              to.animate(
                [
                  { scale: "1 1" },
                  { scale: "1.06 0.88", offset: 0.25 },
                  { scale: "0.97 1.07", offset: 0.55 },
                  { scale: "1 1" },
                ],
                { duration: 420, easing: "ease-out" }
              ),
          })
        }}
        {...props}
      />
    </SelectFxContext.Provider>
  )
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({ className, children, ref, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  const fx = React.useContext(SelectFxContext)
  return (
    <SelectPrimitive.Trigger
      ref={(el) => {
        fx?.setTrigger(el)
        if (typeof ref === "function") ref(el)
        else if (ref) ref.current = el
      }}
      data-slot="select-trigger"
      className={cn(
        "group/select flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-full border-2 border-input bg-card pr-3 pl-4 text-sm font-bold whitespace-nowrap outline-none",
        "shadow-[inset_0_2px_4px_0_rgb(0_0_0/0.07)] transition-[border-color,box-shadow] duration-200",
        "hover:border-primary focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/35 data-[state=open]:border-primary",
        "data-[placeholder]:font-medium data-[placeholder]:text-muted-foreground/70",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/30",
        "*:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 *:data-[slot=select-value]:truncate",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-yan-sakura-edge transition-[rotate] duration-300 ease-[cubic-bezier(.34,1.7,.5,1)] group-data-[state=open]/select:rotate-180">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
            <path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

type SelectContentProps = React.ComponentProps<typeof SelectPrimitive.Content> & {
  /** Overrides the `intensity` set on `Select` for this menu's entrance. */
  intensity?: YanIntensity
}

/** A puffy menu that pops out under the trigger. */
function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 8,
  intensity: own,
  ...props
}: SelectContentProps) {
  const fx = React.useContext(SelectFxContext)
  const intensity = own ?? fx?.intensity ?? "kawaii"
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-intensity={intensity}
        position={position}
        sideOffset={sideOffset}
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-3xl bg-popover text-popover-foreground",
          "shadow-[inset_0_0_0_2px_var(--primary),0_6px_0_0_var(--yan-sakura-edge),0_24px_40px_-16px_var(--yan-sakura-edge)]",
          intensity === "kawaii" &&
            "data-[state=open]:animate-[yan-pop-in_0.32s_cubic-bezier(.34,1.56,.5,1)] data-[state=closed]:animate-[yan-pop-out_0.12s_ease-in] motion-reduce:animate-none",
          intensity === "subtle" &&
            "data-[state=open]:animate-[yan-fade-in_0.15s_ease-out] data-[state=closed]:animate-[yan-fade-out_0.1s_ease-in] motion-reduce:animate-none",
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1.5",
            position === "popper" && "w-full min-w-(--radix-select-trigger-width) scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-4 pt-2 pb-1 text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  onPointerUp,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const fx = React.useContext(SelectFxContext)
  // Remember where this option was: by the time the value changes, the menu is gone.
  const mark = (el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    fx?.setPicked({ x: r.right - 20, y: r.top + r.height / 2 })
  }

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2 rounded-full py-2 pr-9 pl-4 text-sm font-bold outline-none select-none",
        "transition-colors data-[highlighted]:bg-accent data-[state=checked]:text-yan-sakura-edge data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      onPointerUp={(e) => {
        mark(e.currentTarget)
        onPointerUp?.(e)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") mark(e.currentTarget)
        onKeyDown?.(e)
      }}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-3 grid size-4 place-items-center">
        <SelectPrimitive.ItemIndicator>
          <svg viewBox="0 0 16 16" className="size-3.5 animate-[yan-pop_0.4s_ease-out] motion-reduce:animate-none" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 14.2C2.2 10.3 1 7.4 1 5.2 1 3.3 2.5 2 4.3 2 5.8 2 7.1 2.9 8 4.3 8.9 2.9 10.2 2 11.7 2 13.5 2 15 3.3 15 5.2c0 2.2-1.2 5.1-7 9Z"
            />
          </svg>
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("mx-3 my-1.5 border-t-2 border-dashed", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
export type { SelectProps, SelectContentProps }
