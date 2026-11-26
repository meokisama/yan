"use client"

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * A puffy card that leans toward the pointer and catches a glare, then
 * springs in from below the first time it scrolls into view.
 */
export function TiltCard({
  className,
  children,
  delay = 0,
  max = 5,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "children"> & {
  children?: React.ReactNode
  delay?: number
  max?: number
}) {
  const reduce = useReducedMotion()
  const rx = useSpring(0, { stiffness: 220, damping: 18 })
  const ry = useSpring(0, { stiffness: 220, damping: 18 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(0)
  const glare = useMotionTemplate`radial-gradient(22rem circle at ${gx}% ${gy}%, oklch(1 0 0 / 0.5), transparent 60%)`

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 44, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 170, damping: 17, delay }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType === "touch") return
        const r = e.currentTarget.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        ry.set((px - 0.5) * max * 2)
        rx.set(-(py - 0.5) * max * 2)
        gx.set(px * 100)
        gy.set(py * 100)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
      className={cn("yan-card group/tilt relative overflow-hidden", className)}
      {...props}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{ backgroundImage: glare }}
      />
    </motion.div>
  )
}
