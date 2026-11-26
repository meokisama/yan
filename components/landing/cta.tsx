import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Mochi } from "@/components/mochi"

export function Cta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-28">
      <div className="relative isolate overflow-hidden rounded-[3rem] bg-[linear-gradient(120deg,var(--yan-sakura),var(--yan-lavender)_55%,var(--yan-sky))] px-6 py-16 text-center shadow-[inset_0_3px_0_0_oklch(1_0_0/0.7),0_10px_0_0_var(--yan-lavender-edge),0_40px_60px_-30px_var(--yan-lavender-edge)] md:py-20">
        <div aria-hidden="true" className="sunburst absolute top-1/2 left-1/2 -z-10 size-[70rem] -translate-1/2 [--ray:white]" />
        <div aria-hidden="true" className="bg-dots absolute inset-0 -z-10 opacity-40 [--dot:white]" />
        <Mochi happy className="mx-auto w-28 animate-[float-y_3.6s_ease-in-out_infinite] drop-shadow-[0_10px_0_oklch(0.6_0.15_320/0.25)] motion-reduce:animate-none md:w-36" />
        <h2 className="text-sticker mt-6 font-display text-[clamp(2.4rem,6.5vw,4.8rem)] leading-none text-(--night) [--sticker-w:0.16em]">
          Ready to squish?
        </h2>
        <p className="mx-auto mt-5 max-w-md font-bold text-pretty text-(--night)/80">
          Start with a button. It takes one command, and it goes ぷにっ.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" sfx="いくよ！" className="[--yan-c:white] [--yan-edge:var(--yan-sakura-edge)]">
            <Link href="/docs/installation">
              Install Yan <ArrowRightIcon />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" intensity="subtle" className="text-(--night) hover:bg-white/40">
            <Link href="/docs">Read the docs</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
