import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fxRecipes } from "@/lib/yan-fx"

const flavours = [
  { color: "sakura", name: "Sakura", note: "Petals on click", fx: fxRecipes.petals },
  { color: "mint", name: "Matcha", note: "Bubbles on click", fx: fxRecipes.bubbles },
  { color: "lemon", name: "Yuzu", note: "Stars on click", fx: fxRecipes.stars },
] as const

export default function CardInteractive() {
  return (
    <div className="grid w-full max-w-xl grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-3">
      {flavours.map((f) => (
        <Card key={f.name} color={f.color} interactive asChild fx={f.fx}>
          <button type="button">
            <CardHeader>
              <CardTitle className="truncate">{f.name}</CardTitle>
              <CardDescription className="truncate">{f.note}</CardDescription>
            </CardHeader>
          </button>
        </Card>
      ))}
    </div>
  )
}
