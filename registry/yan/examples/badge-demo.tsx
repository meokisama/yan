import { Badge } from "@/components/ui/badge"

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge dot>New</Badge>
      <Badge variant="lavender">Dreamy</Badge>
      <Badge variant="mint">Fresh</Badge>
      <Badge variant="sky">Calm</Badge>
      <Badge variant="lemon">★ Top pick</Badge>
      <Badge variant="peach">Limited</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}
