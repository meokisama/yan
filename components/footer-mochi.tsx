"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Mochi } from "@/components/mochi"
import { burstFromEvent, fxPresets, fxRecipes, pickWord, prefersReducedMotion } from "@/lib/yan-fx"

/** Mochi-chan in a crescent-moon cradle. Poke her and she squeaks. */
export function FooterMochi() {
  const [pokes, setPokes] = React.useState(0)
  const [happy, setHappy] = React.useState(false)
  const calm = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(calm.current), [])

  return (
    <div className="relative aspect-square w-[clamp(6.5rem,26vw,18rem)] shrink-0">
      <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-yan-lemon/25 blur-3xl" />
      <div className="absolute inset-0 origin-[50%_15%] animate-[wiggle_7s_ease-in-out_infinite] motion-reduce:animate-none">
        <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <mask id="footer-moon">
              <rect width="200" height="200" fill="#fff" />
              <circle cx="100" cy="58" r="74" />
            </mask>
          </defs>
          <g mask="url(#footer-moon)">
            <circle cx="100" cy="100" r="84" className="fill-yan-lemon" />
            <circle cx="62" cy="158" r="9" className="fill-yan-lemon-edge" opacity="0.35" />
            <circle cx="128" cy="166" r="6" className="fill-yan-lemon-edge" opacity="0.35" />
            <circle cx="98" cy="150" r="4" className="fill-yan-lemon-edge" opacity="0.3" />
            <path d="M24 118a80 80 0 0 0 152 0" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
          </g>
        </svg>
        <button
          type="button"
          aria-label="Poke Mochi-chan"
          className="absolute top-[23%] left-[22%] w-[56%] cursor-pointer rounded-[45%] outline-none transition-[scale] duration-300 ease-[cubic-bezier(.34,1.7,.5,1)] hover:scale-108 focus-visible:ring-4 focus-visible:ring-ring/60 motion-reduce:transition-none"
          onClick={(e) => {
            const next = pokes + 1
            setPokes(next)
            setHappy(true)
            clearTimeout(calm.current)
            calm.current = setTimeout(() => setHappy(false), 1400)
            burstFromEvent(e, {
              ...fxPresets.kawaii,
              // every tenth poke is a party
              ...(next % 10 === 0 ? fxRecipes.confetti : { colors: ["--yan-fx-1", "--yan-fx-4", "--yan-fx-2"] }),
              word: next % 10 === 0 ? "もちもち！" : pickWord(),
            })
            if (!prefersReducedMotion())
              e.currentTarget.animate(
                [
                  { scale: "1 1" },
                  { scale: "1.16 0.8", offset: 0.25 },
                  { scale: "0.9 1.14", offset: 0.55 },
                  { scale: "1.04 0.97", offset: 0.8 },
                  { scale: "1 1" },
                ],
                { duration: 520, easing: "ease-out" }
              )
          }}
        >
          <Mochi happy={happy} className="w-full" />
        </button>
      </div>
      <p
        aria-hidden="true"
        className="absolute -top-1 left-0 -rotate-10 font-hand text-sm whitespace-nowrap text-yan-lemon transition-opacity duration-300"
        style={{ opacity: pokes ? 0 : 1 }}
      >
        poke me ♡
      </p>
      {/* above her head: the cloud bank covers the bottom of the moon */}
      <div className="absolute inset-x-0 -top-2 flex justify-center" aria-live="polite">
        {pokes > 0 && (
          <Badge key={pokes} color={pokes >= 10 ? "lemon" : "sakura"} className="animate-[yan-pop_0.42s_ease-out] font-display text-sm font-normal motion-reduce:animate-none">
            ぷに ×{pokes}
          </Badge>
        )}
      </div>
    </div>
  )
}
