"use client"

import * as React from "react"

import { SectionHeading } from "@/components/landing/section-heading"
import { cn } from "@/lib/utils"
import { burst, prefersReducedMotion } from "@/lib/yan-fx"

const candies = [
  { name: "sakura", jp: "さくら", token: "--yan-sakura", fx: "--yan-fx-1", lift: "md:translate-y-3" },
  { name: "lavender", jp: "ラベンダー", token: "--yan-lavender", fx: "--yan-fx-2", lift: "md:-translate-y-4" },
  { name: "mint", jp: "ミント", token: "--yan-mint", fx: "--yan-fx-3", lift: "md:translate-y-5" },
  { name: "sky", jp: "そら", token: "--yan-sky", fx: "--yan-fx-5", lift: "md:-translate-y-2" },
  { name: "lemon", jp: "レモン", token: "--yan-lemon", fx: "--yan-fx-4", lift: "md:translate-y-4" },
  { name: "peach", jp: "もも", token: "--yan-peach", fx: "--yan-peach", lift: "md:-translate-y-3" },
]

/** The candy palette as gumdrops. Click one to copy its token. */
export function Palette() {
  const [copied, setCopied] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(null), 1400)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 md:pb-28">
      <SectionHeading kicker="six flavours, light and dark" title="A candy palette">
        Each colour comes as a surface, a darker edge and an ink, in OKLCH. Click a gumdrop to copy its token.
      </SectionHeading>

      <ul className="mt-16 grid grid-cols-3 gap-x-4 gap-y-10 md:grid-cols-6">
        {candies.map((c) => (
          <li key={c.name} className={cn("flex flex-col items-center", c.lift)}>
            <button
              type="button"
              aria-label={`Copy var(${c.token})`}
              style={{ "--yan-c": `var(${c.token})`, "--yan-edge": `var(${c.token}-edge)` } as React.CSSProperties}
              className="yan-candy relative aspect-square w-full max-w-32 cursor-pointer rounded-[42%_42%_46%_46%/52%_52%_40%_40%] outline-none transition-[translate,scale,rotate] duration-300 ease-[cubic-bezier(.34,1.7,.5,1)] [--yan-depth:8px] hover:-translate-y-2 hover:rotate-3 focus-visible:ring-4 focus-visible:ring-ring/60 active:translate-y-1 active:scale-x-110 active:scale-y-90"
              onClick={(e) => {
                navigator.clipboard?.writeText(`var(${c.token})`).catch(() => {})
                setCopied(c.name)
                if (!prefersReducedMotion())
                  burst(e.currentTarget, {
                    shapes: ["dot", "sparkle", "heart"],
                    colors: [c.fx, c.token],
                    count: 16,
                    power: 0.9,
                    size: 11,
                    ring: true,
                    word: "コピー！",
                  })
              }}
            >
              {/* gumdrop face */}
              <svg viewBox="0 0 60 30" className="absolute top-[50%] left-1/2 w-[46%] -translate-x-1/2 opacity-70" aria-hidden="true">
                <ellipse cx="14" cy="10" rx="4" ry="5.5" fill="oklch(0.3 0.08 335)" />
                <ellipse cx="46" cy="10" rx="4" ry="5.5" fill="oklch(0.3 0.08 335)" />
                <path d="M25 17 q2.5 4 5 0 q2.5 4 5 0" fill="none" stroke="oklch(0.3 0.08 335)" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
            <p className="mt-6 font-display text-xl capitalize">{c.name}</p>
            <p className="font-hand text-xs text-muted-foreground">{c.jp}</p>
            <code className="mt-1 h-5 font-mono text-[11px] font-bold text-muted-foreground" aria-live="polite">
              {copied === c.name ? "copied ♡" : c.token}
            </code>
          </li>
        ))}
      </ul>
    </section>
  )
}
