import { Badge } from "@/components/ui/badge"

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge dot>New</Badge>
      <Badge color="lavender">Dreamy</Badge>
      <Badge color="mint">Fresh</Badge>
      <Badge color="sky">Calm</Badge>
      <Badge color="lemon">★ Top pick</Badge>
      <Badge color="peach">Limited</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="outline" color="mint">
        Mint outline
      </Badge>
    </div>
  )
}
