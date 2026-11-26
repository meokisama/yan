"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HeroInstall } from "@/components/landing/hero-install"
import { Mochi } from "@/components/mochi"
import { cn } from "@/lib/utils"

const MochiScene = dynamic(() => import("@/components/landing/mochi-scene"), { ssr: false })

const spring = { type: "spring", stiffness: 260, damping: 16 } as const

function Word({ children, i, className }: { children: React.ReactNode; i: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      className={cn("inline-block", className)}
      initial={reduce ? false : { opacity: 0, y: 48, rotate: -6, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      transition={{ ...spring, delay: 0.08 + i * 0.07 }}
    >
      {children}
    </motion.span>
  )
}

export function Hero() {
  const anchor = React.useRef<HTMLDivElement>(null)
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const [pokes, setPokes] = React.useState(0)
  const reduce = useReducedMotion()

  return (
    <section className="scallop-b relative isolate overflow-hidden bg-[linear-gradient(180deg,color-mix(in_oklch,var(--yan-sakura)_30%,var(--background)),color-mix(in_oklch,var(--yan-lavender)_34%,var(--background))_55%,color-mix(in_oklch,var(--yan-sky)_30%,var(--background)))] [--r:22px] dark:bg-[linear-gradient(180deg,oklch(0.2_0.07_320),oklch(0.24_0.09_300)_55%,oklch(0.27_0.09_275))]">
      {/* atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-dots absolute inset-0 opacity-50 [--dot:white] [mask-image:linear-gradient(180deg,#000,transparent_75%)] dark:opacity-20" />
        <div className="absolute -top-40 -left-40 size-[38rem] rounded-full bg-yan-lemon/50 blur-3xl dark:bg-yan-lavender/20" />
        <div className="absolute -right-32 -bottom-48 size-[40rem] rounded-full bg-yan-mint/50 blur-3xl dark:bg-yan-sakura/15" />
      </div>

      {/* 3D toy box */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          ready ? "opacity-100" : "opacity-0"
        )}
      >
        {!failed && (
          <MochiScene
            anchorRef={anchor}
            onReady={() => setReady(true)}
            onFail={() => setFailed(true)}
            onPoke={() => setPokes((n) => n + 1)}
          />
        )}
      </div>

      <div className="pointer-events-none relative mx-auto grid min-h-[min(100svh,60rem)] max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-x-6 px-5 pt-24 pb-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:pt-28 lg:pb-20">
        {/* stage: the mochi is rendered into this box by the canvas */}
        <div className="relative order-first h-[19rem] sm:h-[24rem] lg:order-last lg:h-[34rem]">
          <div
            aria-hidden="true"
            className="sunburst absolute top-1/2 left-1/2 -z-10 size-[150%] -translate-1/2 [--ray:white] dark:[--ray:var(--yan-sakura)] dark:opacity-50"
          />
          <div ref={anchor} className="absolute inset-0" />
          {failed && (
            <Mochi className="absolute top-1/2 left-1/2 w-3/5 -translate-1/2 animate-[float-y_4s_ease-in-out_infinite]" />
          )}

          <motion.p
            className="absolute top-[12%] left-[2%] -rotate-8 font-hand text-sm text-foreground/80 sm:text-base lg:left-[-4%]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: ready && pokes === 0 ? 1 : 0, scale: 1 }}
            transition={{ ...spring, delay: pokes ? 0 : 1.4 }}
          >
            poke me!
            <svg viewBox="0 0 60 40" className="ml-6 w-12 text-yan-sakura-edge" fill="none" aria-hidden="true">
              <path
                d="M4 4 C 10 26 28 34 52 28 M52 28 l-10 -7 M52 28 l-8 9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.p>

          <div className="absolute inset-x-0 bottom-[2%] flex justify-center lg:bottom-[5%]" aria-live="polite">
            {pokes > 0 && (
              <motion.div
                key={pokes}
                initial={reduce ? false : { scale: 0.5, rotate: -8 }}
                animate={{ scale: 1, rotate: -3 }}
                transition={{ type: "spring", stiffness: 500, damping: 12 }}
              >
                <Badge variant={pokes >= 10 ? "lemon" : "default"} className="px-3.5 py-1 font-display text-base font-normal">
                  ぷに ×{pokes}
                  {pokes >= 10 ? " ♡ もちもち！" : ""}
                </Badge>
              </motion.div>
            )}
          </div>
        </div>

        {/* copy */}
        <div className="pointer-events-auto relative flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            <Badge variant="outline" dot className="mb-5 px-3.5 py-1 tracking-widest">
              v0 · moe kawaii components
            </Badge>
          </motion.div>

          <h1 className="font-display text-[clamp(2.7rem,7.4vw,5.6rem)] leading-[1.02] tracking-[-0.01em] text-balance text-foreground [--sticker-w:0.11em] [--sticker:var(--background)]">
            <Word i={0} className="text-sticker">Components</Word>{" "}
            <Word i={1} className="text-sticker">that</Word> <Word i={2} className="text-sticker">go</Word>{" "}
            <Word i={3}>
              <span className="text-sticker inline-block origin-bottom -rotate-4 animate-[wiggle_3.2s_ease-in-out_infinite] px-[0.08em] text-yan-sakura-edge [--sticker:#fff] motion-reduce:animate-none dark:text-yan-sakura dark:[--sticker:oklch(0.3_0.1_340)]">
                ぷにっ
              </span>
            </Word>{" "}
            <Word i={4} className="text-sticker">when</Word> <Word i={5} className="text-sticker">you</Word>{" "}
            <Word i={6} className="text-sticker">poke</Word> <Word i={7} className="text-sticker">them.</Word>
          </h1>

          <motion.p
            className="mt-8 max-w-lg text-base font-medium text-pretty text-foreground/80 md:text-lg"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.55 }}
          >
            Yan is a shadcn-style library with a Japanese moe soul. Squishy, sparkly and accessible.
            Built on Radix + Tailwind, copied straight into your app.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.65 }}
          >
            <Button asChild size="lg" sfx="いくよ！">
              <Link href="/docs">
                Get started <ArrowRightIcon />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" intensity="subtle">
              <Link href="/docs/components/button">Browse components</Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-8 w-full max-w-lg"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.75 }}
          >
            <HeroInstall />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
