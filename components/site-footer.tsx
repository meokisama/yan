import Link from "next/link"

import { Mochi } from "@/components/mochi"
import { siteConfig } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="scallop-t relative mt-auto overflow-hidden bg-(--night) text-[oklch(0.93_0.03_340)] [--r:16px]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 pt-14 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3">
              <Mochi
                happy
                className="size-14 animate-[float-y_4s_ease-in-out_infinite] motion-reduce:animate-none"
              />
              <span className="font-display text-5xl leading-none text-yan-sakura">yan</span>
            </div>
            <p className="mt-4 max-w-xs text-sm font-medium text-[oklch(0.8_0.05_330)]">
              Kawaii React components that squish, sparkle and go ぷにっ.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm font-extrabold">
            <Link href="/docs" className="hover:text-yan-sakura">
              Introduction
            </Link>
            <Link href="/docs/components/button" className="hover:text-yan-sakura">
              Components
            </Link>
            <Link href="/docs/installation" className="hover:text-yan-sakura">
              Installation
            </Link>
            <Link href="/docs/theming" className="hover:text-yan-sakura">
              Theming
            </Link>
            <a href={siteConfig.github} target="_blank" rel="noreferrer" className="hover:text-yan-sakura">
              GitHub ↗
            </a>
            <a href="/r/registry.json" className="hover:text-yan-sakura">
              registry.json
            </a>
          </nav>
        </div>
        <p
          aria-hidden="true"
          className="pointer-events-none bg-[linear-gradient(180deg,oklch(0.82_0.14_355),oklch(0.6_0.17_320)_75%,oklch(0.4_0.12_315))] bg-clip-text text-center font-display text-[clamp(5rem,24vw,19rem)] leading-[0.95] text-transparent select-none"
        >
          やん ♡
        </p>
        <p className="flex flex-wrap justify-between gap-2 border-t-2 border-dashed border-white/15 pt-5 text-xs font-bold text-[oklch(0.74_0.05_330)]">
          <span>MIT licensed · made with ぷにっ</span>
          <span>Built on Radix + Tailwind · shipped via the shadcn registry</span>
        </p>
      </div>
    </footer>
  )
}
