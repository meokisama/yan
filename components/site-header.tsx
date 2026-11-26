import Link from "next/link"

import { Mochi } from "@/components/mochi"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteConfig } from "@/lib/site"

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/components/button", label: "Components" },
  { href: "/docs/theming", label: "Theming" },
]

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-40 px-3">
      <div className="yan-glass pointer-events-auto mx-auto flex h-14 max-w-5xl items-center gap-1 rounded-full pr-2 pl-3">
        <Link
          href="/"
          className="group/logo mr-2 flex items-center gap-2 rounded-full pr-2 outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
        >
          <Mochi className="size-9 transition-[scale,rotate] duration-500 ease-[cubic-bezier(.34,1.7,.5,1)] group-hover/logo:scale-110 group-hover/logo:-rotate-8" />
          <span className="font-display text-2xl leading-none text-yan-sakura-edge">yan</span>
          <span className="hidden rounded-full bg-accent px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-muted-foreground sm:inline">
            やん
          </span>
        </Link>
        <nav className="flex items-center text-sm font-extrabold text-muted-foreground">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-2 transition-colors hover:bg-accent hover:text-foreground ${i > 0 ? "hidden sm:block" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full px-3 py-2 text-sm font-extrabold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:block"
          >
            GitHub ↗
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
