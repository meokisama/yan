"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { SectionHeading } from "@/components/landing/section-heading"
import { cn } from "@/lib/utils"
import type { YanIntensity } from "@/lib/yan-fx"

const levels: {
  value: YanIntensity
  jp: string
  title: string
  body: string
  where: string
}[] = [
  {
    value: "off",
    jp: "しーん",
    title: "Off",
    body: "Same candy styling, zero motion and zero particles. A plain, well-behaved component.",
    where: "data tables · settings · checkout",
  },
  {
    value: "subtle",
    jp: "ふわっ",
    title: "Subtle",
    body: "A small bounce and a few sparkles. Polite enough for dashboards, still clearly Yan.",
    where: "dashboards · forms · docs",
  },
  {
    value: "kawaii",
    jp: "ぷにっ！",
    title: "Kawaii",
    body: "Mochi squish, jelly wobble, hearts, stars and an onomatopoeia sticker on every press.",
    where: "landing pages · games · fan sites",
  },
]

/** The intensity prop, as a big physical dial you can turn. */
export function MoeDial() {
  const [level, setLevel] = React.useState<YanIntensity>("kawaii")
  const [slide, setSlide] = React.useState([60])
  const reduce = useReducedMotion()
  const index = levels.findIndex((l) => l.value === level)
  const current = levels[index]

  return (
    <section className="scallop-y relative bg-[linear-gradient(180deg,color-mix(in_oklch,var(--yan-lavender)_38%,var(--background)),color-mix(in_oklch,var(--yan-sakura)_34%,var(--background)))] [--r:20px] dark:bg-[linear-gradient(180deg,oklch(0.25_0.09_300),oklch(0.24_0.09_335))]">
      <div className="bg-gingham pointer-events-none absolute inset-0 opacity-40 [--dot:white] dark:opacity-5" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-28">
        <SectionHeading kicker="one prop on every component" title="One dial for moe">
          <code className="rounded-lg bg-card/70 px-2 py-0.5 font-mono text-[0.9em] font-bold text-foreground">intensity</code>{" "}
          lets the same component live on a landing page and in an admin panel. Turn it and try.
        </SectionHeading>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* the dial */}
          <div
            role="radiogroup"
            aria-label="Intensity"
            className="flex flex-col gap-4"
            onKeyDown={(e) => {
              const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0
              if (!d) return
              e.preventDefault()
              const next = levels[(index + d + levels.length) % levels.length]
              setLevel(next.value)
              document.getElementById(`moe-${next.value}`)?.focus()
            }}
          >
            {levels.map((l, i) => {
              const active = l.value === level
              return (
                <button
                  key={l.value}
                  id={`moe-${l.value}`}
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setLevel(l.value)}
                  className={cn(
                    "group/level relative flex cursor-pointer items-center gap-5 rounded-3xl p-5 text-left outline-none transition-[translate] duration-300 focus-visible:ring-4 focus-visible:ring-ring/60",
                    active ? "text-foreground" : "text-foreground/65 hover:translate-x-1 hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="moe-active"
                      className="yan-card absolute inset-0 rounded-3xl! [--tint:var(--yan-sakura)]"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 26 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative grid size-14 shrink-0 place-items-center rounded-2xl font-display text-2xl transition-colors",
                      active
                        ? "yan-candy text-primary-foreground [--yan-depth:4px]"
                        : "bg-card/60 text-foreground/50 shadow-[inset_0_0_0_2px_color-mix(in_oklch,var(--primary)_35%,transparent)]"
                    )}
                  >
                    {i}
                  </span>
                  <span className="relative min-w-0">
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-display text-2xl">{l.title}</span>
                      <span className="font-hand text-sm text-yan-sakura-edge dark:text-yan-sakura">{l.jp}</span>
                    </span>
                    <span className="mt-1 block text-sm font-medium text-pretty text-muted-foreground">{l.body}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* the stage */}
          <div className="yan-card relative flex min-h-[26rem] flex-col overflow-hidden [--tint:var(--yan-lavender)] [--tint-edge:var(--yan-lavender-edge)]">
            <div className="flex items-center gap-2 border-b-2 border-dashed px-5 py-3">
              <span className="size-3 rounded-full bg-yan-sakura shadow-[inset_0_-2px_0_0_var(--yan-sakura-edge)]" />
              <span className="size-3 rounded-full bg-yan-lemon shadow-[inset_0_-2px_0_0_var(--yan-lemon-edge)]" />
              <span className="size-3 rounded-full bg-yan-mint shadow-[inset_0_-2px_0_0_var(--yan-mint-edge)]" />
              <code className="ml-2 truncate font-mono text-xs font-bold text-muted-foreground">
                {"<Button "}
                <span className="text-yan-sakura-edge dark:text-yan-sakura">intensity=&quot;{level}&quot;</span>
                {" />"}
              </code>
            </div>
            <div className="bg-dots relative flex flex-1 flex-col items-center justify-center gap-8 p-8 [--dot:var(--yan-lavender-edge)]">
              <Button key={`b-${level}`} size="lg" intensity={level} className="h-16 px-12 text-xl [--yan-depth:7px]">
                Press me
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
                <Switch key={`s-${level}`} intensity={level} aria-label="Demo switch" />
                <Checkbox key={`c-${level}`} intensity={level} aria-label="Demo checkbox" className="size-7" />
                <Slider
                  intensity={level}
                  value={slide}
                  onValueChange={setSlide}
                  aria-label="Demo slider"
                  className="w-40"
                />
              </div>
              <motion.p
                key={current.value}
                className="text-center text-xs font-extrabold tracking-widest text-muted-foreground uppercase"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                good for: {current.where}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
