import { cn } from "@/lib/utils"

const words = ["ぷにっ", "squishy", "キラッ", "sparkly", "ぽよん", "accessible", "ふわっ", "yours to keep", "ドキッ", "Radix inside"]
const marks = ["♡", "✦", "✿", "★"]
const tints = ["text-yan-sakura", "text-yan-lemon", "text-yan-mint", "text-yan-sky", "text-yan-lavender"]

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={w} className="flex items-center">
          <span className={cn("px-5", i % 2 === 0 ? tints[(i / 2) % tints.length] : "text-white")}>{w}</span>
          <span className={cn("text-[0.6em]", tints[(i + 2) % tints.length])}>{marks[i % marks.length]}</span>
        </span>
      ))}
    </div>
  )
}

/** Two crossed ribbons of onomatopoeia. Pure CSS. */
export function Marquee() {
  return (
    <div className="relative z-10 -my-6 overflow-x-clip py-10 select-none" aria-label="ぷにっ, キラッ, ぽよん: squishy, sparkly, accessible">
      <div className="absolute inset-x-[-4%] top-1/2 -translate-y-1/2 rotate-2 bg-primary py-2 shadow-[0_6px_0_0_var(--yan-sakura-edge)]">
        <div className="marquee-track flex w-max font-display text-xl text-primary-foreground/40 [--marquee-d:50s] [animation-direction:reverse]">
          <Row hidden />
          <Row hidden />
        </div>
      </div>
      <div className="relative -mx-[4%] -rotate-1 bg-(--night) py-3 shadow-[0_8px_0_0_var(--night-deep),0_30px_40px_-20px_oklch(0.3_0.1_330/0.6)]">
        <div className="marquee-track flex w-max font-display text-3xl md:text-4xl">
          <Row hidden />
          <Row hidden />
        </div>
      </div>
    </div>
  )
}
