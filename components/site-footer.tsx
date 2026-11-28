import Link from "next/link"

import { FooterMochi } from "@/components/footer-mochi"
import { HeroInstall } from "@/components/landing/hero-install"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

const groups = [
  {
    title: "Start",
    jp: "はじめに",
    tint: "text-yan-sakura",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Theming", href: "/docs/theming" },
      { label: "Effects", href: "/docs/effects" },
    ],
  },
  {
    title: "Toys",
    jp: "おもちゃ",
    tint: "text-yan-mint",
    links: [
      { label: "Button", href: "/docs/components/button" },
      { label: "Switch", href: "/docs/components/switch" },
      { label: "Textarea", href: "/docs/components/textarea" },
      { label: "Dropdown Menu", href: "/docs/components/dropdown-menu" },
    ],
  },
  {
    title: "Elsewhere",
    jp: "そのほか",
    tint: "text-yan-lemon",
    links: [
      { label: "GitHub ↗", href: siteConfig.github },
      { label: "registry.json", href: "/r/registry.json" },
    ],
  },
]

const SPARK = "M8 1c.6 3.6 1.4 5.4 6 7-4.6 1.6-5.4 3.4-6 7-.6-3.6-1.4-5.4-6-7 4.6-1.6 5.4-3.4 6-7Z"

const twinkles = [
  { left: "5%", top: "14%", size: 18, tint: "fill-yan-lemon", delay: 0 },
  { left: "17%", top: "58%", size: 12, tint: "fill-yan-sky", delay: 0.7 },
  { left: "34%", top: "9%", size: 10, tint: "fill-white", delay: 1.2 },
  { left: "52%", top: "30%", size: 14, tint: "fill-yan-sakura", delay: 0.3 },
  { left: "66%", top: "12%", size: 11, tint: "fill-yan-mint", delay: 1.6 },
  { left: "83%", top: "44%", size: 16, tint: "fill-yan-lemon", delay: 0.9 },
  { left: "94%", top: "20%", size: 11, tint: "fill-white", delay: 0.4 },
  { left: "44%", top: "66%", size: 10, tint: "fill-yan-lavender", delay: 1.4 },
]

const link =
  "group/link relative inline-flex w-fit items-center rounded-full py-0.5 outline-none transition-[color,translate] duration-200 hover:translate-x-4 hover:text-yan-sakura focus-visible:translate-x-4 focus-visible:text-yan-sakura motion-reduce:transition-none"

export function SiteFooter() {
  return (
    <footer className="scallop-t relative isolate mt-auto overflow-hidden bg-(--night) text-[oklch(0.93_0.03_340)] [--r:16px]">
      {/* the night sky */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-stars absolute inset-0 opacity-70" />
        <div className="absolute -top-40 left-[18%] size-[36rem] rounded-full bg-yan-lavender/14 blur-3xl" />
        <div className="absolute top-1/3 -right-40 size-[34rem] rounded-full bg-yan-sakura/12 blur-3xl" />
        {twinkles.map((t) => (
          <svg
            key={t.left}
            viewBox="0 0 16 16"
            width={t.size}
            height={t.size}
            className={cn("absolute animate-[yan-twinkle_2.6s_ease-in-out_infinite] motion-reduce:animate-none", t.tint)}
            style={{ left: t.left, top: t.top, animationDelay: `${t.delay}s` }}
          >
            <path d={SPARK} />
          </svg>
        ))}
        <span className="shooting-star top-[12%] left-[58%]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-16">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="min-w-0">
            <h2 className="text-sticker font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-none text-yan-sakura-edge [--sticker-w:0.13em]">
              Take one home ♡
            </h2>
            <p className="mt-5 max-w-sm font-medium text-pretty text-[oklch(0.82_0.05_330)]">
              Kawaii React components that squish, sparkle and go ぷにっ. One command and the button is yours.
            </p>
            {/* the pill is theme-coloured glass, so it needs the theme's ink, not the footer's */}
            <div className="mt-6 max-w-md text-foreground">
              <HeroInstall />
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-9 sm:grid-cols-3 lg:gap-x-14">
            {groups.map((g) => (
              <div key={g.title} className="min-w-0">
                <h3 className={cn("font-display text-2xl leading-none", g.tint)}>{g.title}</h3>
                <p aria-hidden="true" className="mt-1.5 font-hand text-xs text-white/45">
                  {g.jp}
                </p>
                <ul className="mt-4 flex flex-col gap-2 text-sm font-extrabold">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      {l.href.startsWith("/docs") ? (
                        <Link href={l.href} className={link}>
                          <Heart />
                          {l.label}
                        </Link>
                      ) : (
                        <a href={l.href} className={link} {...(l.href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}>
                          <Heart />
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-6 flex items-center justify-center gap-[3vw]">
          <p
            aria-hidden="true"
            className="pointer-events-none bg-[linear-gradient(180deg,oklch(0.93_0.07_350),oklch(0.8_0.15_355)_45%,oklch(0.62_0.18_330))] bg-clip-text font-display text-[clamp(5rem,27vw,21rem)] leading-[1.05] text-transparent drop-shadow-[0_0.045em_0_oklch(0.42_0.14_335)] select-none"
          >
            やん
          </p>
          <FooterMochi />
        </div>
      </div>

      {/* a cloud bank the wordmark sinks into */}
      <div className="relative -mt-[clamp(0rem,3.5vw,3.5rem)]">
        <div
          aria-hidden="true"
          className="scallop-t absolute -inset-x-6 -top-2.5 bottom-0 bg-[color-mix(in_oklch,var(--night),var(--night-deep))] [--r:19px] sm:-top-5 sm:[--r:31px]"
        />
        <div className="scallop-t relative bg-(--night-deep) [--r:13px] sm:[--r:22px]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 text-xs font-bold text-[oklch(0.76_0.05_330)]">
            <span>MIT licensed · made with ♡ and too much sugar</span>
            <span className="hidden md:inline">Radix + Tailwind · shipped through the shadcn registry</span>
            <a
              href="#"
              className="rounded-full bg-white/8 px-3.5 py-1.5 font-extrabold text-yan-sakura outline-none transition-colors hover:bg-white/15 focus-visible:ring-4 focus-visible:ring-ring/60"
            >
              ↑ Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function Heart() {
  return (
    <span
      aria-hidden="true"
      className="absolute -left-4 text-xs text-yan-sakura opacity-0 transition-opacity duration-200 group-hover/link:opacity-100 group-focus-visible/link:opacity-100"
    >
      ♡
    </span>
  )
}
