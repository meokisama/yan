"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { bloom, emote, fly, impact, puff, speedLines } from "@/lib/yan-fx"

const effects: [name: string, run: (target: Element, from: Element) => void][] = [
  ["impact", (target) => impact(target)],
  ["puff", (target) => puff(target, { count: 4 })],
  ["speedLines", (target) => speedLines(target)],
  ["bloom", (target) => bloom(target)],
  ["emote", (target) => emote(target, "！")],
  ["fly", (target, from) => fly(from, target)],
]

export default function FxEffects() {
  const target = React.useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col items-center gap-10">
      <div
        ref={target}
        aria-hidden="true"
        className="yan-candy relative grid size-20 place-items-center rounded-full bg-primary text-2xl text-primary-foreground [--yan-c:var(--primary)] [--yan-depth:5px] [--yan-edge:var(--yan-sakura-edge)]"
      >
        ♡
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {effects.map(([name, run]) => (
          // off: only the effect being shown should play
          <Button
            key={name}
            size="sm"
            variant="outline"
            intensity="off"
            onClick={(e) => target.current && run(target.current, e.currentTarget)}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  )
}
