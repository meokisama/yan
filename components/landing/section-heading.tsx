"use client"

import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

export function SectionHeading({
  kicker,
  title,
  children,
  className,
}: {
  /** Small handwritten note above the title. */
  kicker: string
  title: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={cn("mx-auto flex max-w-2xl flex-col items-center text-center", className)}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
    >
      <p className="-rotate-2 font-hand text-sm text-yan-sakura-edge md:text-base dark:text-yan-sakura">{kicker}</p>
      <h2 className="mt-2 font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.05] text-balance">{title}</h2>
      {children && <p className="mt-4 max-w-xl text-base font-medium text-pretty text-muted-foreground">{children}</p>}
    </motion.div>
  )
}
