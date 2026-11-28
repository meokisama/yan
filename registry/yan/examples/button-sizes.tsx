import { HeartIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Like" color="lavender">
        <HeartIcon />
      </Button>
      <Button
        color="mint"
        fx={{ shapes: ["petal"], colors: ["--yan-fx-1", "--yan-sakura"], count: 18, power: 0.8, size: 9 }}
        sfx="ひらひら"
      >
        Sakura petals
      </Button>
    </div>
  )
}
