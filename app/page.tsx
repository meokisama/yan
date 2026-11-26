import { Cta } from "@/components/landing/cta"
import { Hero } from "@/components/landing/hero"
import { Marquee } from "@/components/landing/marquee"
import { MoeDial } from "@/components/landing/moe-dial"
import { Palette } from "@/components/landing/palette"
import { Recipe } from "@/components/landing/recipe"
import { ToyBox } from "@/components/landing/toy-box"

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Marquee />
      <ToyBox />
      <MoeDial />
      <Recipe />
      <Palette />
      <Cta />
    </main>
  )
}
