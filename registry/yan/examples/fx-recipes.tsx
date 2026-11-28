import { Button } from "@/components/ui/button"
import { fxRecipes } from "@/lib/yan-fx"

export default function FxRecipes() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <Button fx={fxRecipes.sparkles} sfx="キラッ">
        Sparkles
      </Button>
      <Button fx={fxRecipes.hearts} sfx="ドキッ">
        Hearts
      </Button>
      <Button variant="secondary" fx={fxRecipes.stars} sfx="ピカッ">
        Stars
      </Button>
      <Button variant="secondary" fx={fxRecipes.petals} sfx="ひらひら">
        Petals
      </Button>
      <Button variant="mint" fx={fxRecipes.bubbles} sfx="ぷくぷく">
        Bubbles
      </Button>
      <Button variant="mint" fx={fxRecipes.confetti} sfx="やった！">
        Confetti
      </Button>
    </div>
  )
}
