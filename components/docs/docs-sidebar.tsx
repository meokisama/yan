"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

type NavItem = { title: string; href?: string; isNew?: boolean }

const nav: { title: string; mark: string; items: NavItem[] }[] = [
  {
    title: "Getting started",
    mark: "✿",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Theming & intensity", href: "/docs/theming" },
      { title: "Effects", href: "/docs/effects", isNew: true },
    ],
  },
  {
    title: "Components",
    mark: "♡",
    items: [
      { title: "Accordion", href: "/docs/components/accordion", isNew: true },
      { title: "Avatar", href: "/docs/components/avatar", isNew: true },
      { title: "Badge", href: "/docs/components/badge" },
      { title: "Button", href: "/docs/components/button" },
      { title: "Card", href: "/docs/components/card", isNew: true },
      { title: "Checkbox", href: "/docs/components/checkbox" },
      { title: "Dialog", href: "/docs/components/dialog", isNew: true },
      { title: "Dropdown Menu", href: "/docs/components/dropdown-menu", isNew: true },
      { title: "Input", href: "/docs/components/input", isNew: true },
      { title: "Label", href: "/docs/components/label", isNew: true },
      { title: "Popover", href: "/docs/components/popover", isNew: true },
      { title: "Progress", href: "/docs/components/progress" },
      { title: "Radio Group", href: "/docs/components/radio-group", isNew: true },
      { title: "Select", href: "/docs/components/select", isNew: true },
      { title: "Skeleton", href: "/docs/components/skeleton", isNew: true },
      { title: "Slider", href: "/docs/components/slider" },
      { title: "Switch", href: "/docs/components/switch" },
      { title: "Tabs", href: "/docs/components/tabs", isNew: true },
      { title: "Textarea", href: "/docs/components/textarea", isNew: true },
      { title: "Toast", href: "/docs/components/toast", isNew: true },
      { title: "Tooltip", href: "/docs/components/tooltip", isNew: true },
    ],
  },
]

export function DocsSidebar({ id = "desktop" }: { id?: string }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-7 text-sm" aria-label="Docs">
      {nav.map((group) => (
        <div key={group.title}>
          <h4 className="mb-2 flex items-center gap-2 px-3 font-display text-base text-foreground">
            <span className="text-yan-sakura-edge dark:text-yan-sakura" aria-hidden="true">
              {group.mark}
            </span>
            {group.title}
          </h4>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.title}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center justify-between rounded-full px-3 py-1.5 font-extrabold outline-none transition-colors focus-visible:ring-4 focus-visible:ring-ring/50",
                        active ? "text-primary-foreground" : "text-foreground/75 hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId={`docs-nav-active-${id}`}
                          className="yan-candy absolute inset-0 rounded-full [--yan-depth:3px]"
                          transition={{ type: "spring", stiffness: 420, damping: 30 }}
                        />
                      )}
                      <span className="relative">{item.title}</span>
                      {item.isNew && !active && (
                        <span className="relative rounded-full bg-yan-lemon px-1.5 text-[10px] tracking-wide text-yan-lemon-foreground">
                          new
                        </span>
                      )}
                    </Link>
                  ) : (
                    <span className="flex items-center justify-between px-3 py-1.5 font-extrabold text-muted-foreground/70">
                      {item.title}
                      <span className="rounded-full bg-muted px-1.5 text-[10px] tracking-wide">soon</span>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
