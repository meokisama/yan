"use client"

import * as React from "react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { burst, prefersReducedMotion, puff, type BurstOptions, type YanIntensity } from "@/lib/yan-fx"

type MenuFx = { intensity: YanIntensity; fx?: BurstOptions }

const MenuContext = React.createContext<MenuFx>({ intensity: "kawaii" })

/** Returns a function that plays the "picked" effect from an item. */
function usePick(variant: "default" | "destructive" = "default") {
  const { intensity, fx } = React.useContext(MenuContext)
  return (el: Element) => {
    if (intensity === "off") return
    const r = el.getBoundingClientRect()
    const point = { x: r.left + 26, y: r.top + r.height / 2 }
    if (variant === "destructive") {
      if (intensity === "kawaii") puff(point, { count: 3, size: 9, color: "--yan-fx-1" })
      return
    }
    burst(
      point,
      intensity === "kawaii"
        ? { shapes: ["sparkle", "heart", "dot"], count: 7, power: 0.5, size: 7, ...fx }
        : { shapes: ["sparkle"], count: 3, power: 0.35, size: 6, ...fx }
    )
  }
}

const surface = [
  "relative isolate z-50 min-w-44 overflow-x-hidden overflow-y-auto rounded-3xl border-2 border-primary bg-popover py-1.5 text-popover-foreground",
  "shadow-[0_6px_0_0_var(--yan-sakura-edge),0_24px_40px_-16px_var(--yan-sakura-edge)]",
]

const entrance = (intensity: YanIntensity) => [
  intensity === "kawaii" &&
    "data-[state=open]:animate-[yan-jelly-in_0.4s_ease-out] data-[state=closed]:animate-[yan-pop-out_0.12s_ease-in] motion-reduce:animate-none",
  intensity === "subtle" &&
    "data-[state=open]:animate-[yan-fade-in_0.15s_ease-out] data-[state=closed]:animate-[yan-fade-out_0.1s_ease-in] motion-reduce:animate-none",
]

const row = (intensity: YanIntensity) => [
  "relative flex cursor-pointer items-center gap-2 px-5 py-2.5 text-sm font-bold outline-none select-none",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  // off: a flat highlight. Otherwise the gummy in MenuGlide is the highlight, and the text takes its ink.
  intensity === "off"
    ? "data-[highlighted]:bg-accent"
    : "transition-[color,padding] duration-150 data-[highlighted]:pl-6.5 data-[highlighted]:text-primary-foreground data-[highlighted]:[text-shadow:0_1px_0_rgb(255_255_255/0.4)]",
]

/**
 * The highlight: one gummy candy that lives in the menu and stretches to whichever item is active.
 * It also deals the items in one after another when the menu opens.
 */
function MenuGlide({ intensity }: { intensity: YanIntensity }) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const pill = ref.current
    const menu = pill?.parentElement
    if (!pill || !menu) return
    let prev: number | null = null

    const place = () => {
      const item = menu.querySelector<HTMLElement>("[data-highlighted]")
      if (!item) {
        pill.style.opacity = "0"
        prev = null
        return
      }
      const top = item.offsetTop + 1
      const bottom = menu.clientHeight - item.offsetTop - item.offsetHeight + 4
      if (prev === null || prefersReducedMotion()) pill.style.transition = "none"
      else if (intensity === "subtle") pill.style.transition = "top 0.15s ease-out, bottom 0.15s ease-out"
      else {
        // Mochi stretch: the leading edge shoots ahead, the trailing edge snaps after it.
        const lead = "0.14s cubic-bezier(.3,.9,.3,1)"
        const trail = "0.3s cubic-bezier(.34,1.6,.5,1) 0.04s"
        pill.style.transition = top > prev ? `bottom ${lead}, top ${trail}` : `top ${lead}, bottom ${trail}`
      }
      prev = top
      const coral = item.dataset.variant === "destructive"
      pill.style.setProperty("--yan-c", coral ? "var(--destructive)" : "var(--primary)")
      pill.style.setProperty("--yan-edge", coral ? "var(--yan-coral-edge)" : "var(--yan-sakura-edge)")
      pill.style.top = `${top}px`
      pill.style.bottom = `${bottom}px`
      pill.style.opacity = "1"
    }

    if (intensity === "kawaii" && !prefersReducedMotion())
      menu.querySelectorAll<HTMLElement>("[role^=menuitem]").forEach((item, i) =>
        item.animate([{ opacity: 0, translate: "0 -8px" }, { opacity: 1, translate: "0 0" }], {
          duration: 260,
          delay: 60 + i * 32,
          easing: "cubic-bezier(.34,1.5,.5,1)",
          fill: "backwards",
        })
      )

    place()
    const mo = new MutationObserver(place)
    mo.observe(menu, { attributes: true, attributeFilter: ["data-highlighted"], subtree: true })
    return () => mo.disconnect()
  }, [intensity])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="dropdown-menu-candy"
      className="yan-candy pointer-events-none absolute inset-x-1.5 -z-10 rounded-2xl opacity-0 [--yan-depth:3px]"
    />
  )
}

const heart = (
  <svg viewBox="0 0 16 16" className="size-3.5 animate-[yan-pop_0.4s_ease-out] motion-reduce:animate-none" aria-hidden="true">
    <path
      fill="currentColor"
      d="M8 14.2C2.2 10.3 1 7.4 1 5.2 1 3.3 2.5 2 4.3 2 5.8 2 7.1 2.9 8 4.3 8.9 2.9 10.2 2 11.7 2 13.5 2 15 3.3 15 5.2c0 2.2-1.2 5.1-7 9Z"
    />
  </svg>
)

function DropdownMenu(props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuRadioGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

function DropdownMenuSub(props: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

type DropdownMenuContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  /**
   * How much moe. `"kawaii"`: the menu lands like jelly and deals its items in
   * one by one, a gummy highlight stretches from item to item, and the one
   * you pick throws sparkles and hearts (a destructive one leaves a puff).
   * `"subtle"`: it fades, the highlight slides, a few sparkles on pick.
   * `"off"`: it just appears, with a flat highlight.
   */
  intensity?: YanIntensity
  /** Fine-tune the burst fired from the item you pick. */
  fx?: BurstOptions
}

/** A puffy menu that pops out under its trigger. */
function DropdownMenuContent({
  className,
  children,
  sideOffset = 8,
  intensity = "kawaii",
  fx,
  ...props
}: DropdownMenuContentProps) {
  const value = React.useMemo(() => ({ intensity, fx }), [intensity, fx])
  return (
    <DropdownMenuPrimitive.Portal>
      <MenuContext.Provider value={value}>
        <DropdownMenuPrimitive.Content
          data-slot="dropdown-menu-content"
          data-intensity={intensity}
          sideOffset={sideOffset}
          className={cn(
            surface,
            "max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin)",
            entrance(intensity),
            className
          )}
          {...props}
        >
          {intensity !== "off" && <MenuGlide intensity={intensity} />}
          {children}
        </DropdownMenuPrimitive.Content>
      </MenuContext.Provider>
    </DropdownMenuPrimitive.Portal>
  )
}

type DropdownMenuItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  /** Indent to line up with items that have an icon. */
  inset?: boolean
  variant?: "default" | "destructive"
}

function DropdownMenuItem({ className, inset, variant = "default", onSelect, ...props }: DropdownMenuItemProps) {
  const { intensity } = React.useContext(MenuContext)
  const pick = usePick(variant)
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        row(intensity),
        inset && "pl-11 data-[highlighted]:pl-12.5",
        variant === "destructive" && "text-yan-coral-edge",
        variant === "destructive" &&
          (intensity === "off" ? "data-[highlighted]:bg-destructive/15" : "data-[highlighted]:text-destructive-foreground"),
        className
      )}
      onSelect={(e) => {
        onSelect?.(e)
        if (!e.defaultPrevented && e.currentTarget instanceof Element) pick(e.currentTarget)
      }}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  onSelect,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  const { intensity } = React.useContext(MenuContext)
  const pick = usePick()
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(row(intensity), "pr-11", className)}
      onSelect={(e) => {
        onSelect?.(e)
        const el = e.currentTarget
        // only when it is being ticked: the state flips after this handler
        if (!e.defaultPrevented && el instanceof Element && el.getAttribute("data-state") !== "checked") pick(el)
      }}
      {...props}
    >
      {children}
      <span className="absolute right-5 grid size-4 place-items-center">
        <DropdownMenuPrimitive.ItemIndicator>{heart}</DropdownMenuPrimitive.ItemIndicator>
      </span>
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  onSelect,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  const { intensity } = React.useContext(MenuContext)
  const pick = usePick()
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(row(intensity), "pr-11", className)}
      onSelect={(e) => {
        onSelect?.(e)
        const el = e.currentTarget
        if (!e.defaultPrevented && el instanceof Element && el.getAttribute("data-state") !== "checked") pick(el)
      }}
      {...props}
    >
      {children}
      <span className="absolute right-5 grid size-4 place-items-center">
        <DropdownMenuPrimitive.ItemIndicator>{heart}</DropdownMenuPrimitive.ItemIndicator>
      </span>
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn("px-5 pt-3 pb-1 text-[11px] font-extrabold tracking-widest text-muted-foreground uppercase", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("border-t-2 border-dashed", className)}
      {...props}
    />
  )
}

/** A keyboard hint at the far end of an item. */
function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto pl-4 text-xs font-bold tracking-widest text-muted-foreground", className)}
      {...props}
    />
  )
}

function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) {
  const { intensity } = React.useContext(MenuContext)
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn(row(intensity), "data-[state=open]:bg-accent", className)}
      {...props}
    >
      {children}
      <svg viewBox="0 0 16 16" className="ml-auto size-3.5" fill="none" aria-hidden="true">
        <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  children,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  const { intensity } = React.useContext(MenuContext)
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        sideOffset={sideOffset}
        className={cn(surface, "origin-(--radix-dropdown-menu-content-transform-origin)", entrance(intensity), className)}
        {...props}
      >
        {intensity !== "off" && <MenuGlide intensity={intensity} />}
        {children}
      </DropdownMenuPrimitive.SubContent>
    </DropdownMenuPrimitive.Portal>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
export type { DropdownMenuContentProps, DropdownMenuItemProps }
