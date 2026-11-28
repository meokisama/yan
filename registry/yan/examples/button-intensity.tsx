import { Button } from "@/components/ui/button"

export default function ButtonIntensity() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button intensity="off">Off</Button>
      <Button intensity="subtle">Subtle</Button>
      <Button intensity="kawaii">Kawaii</Button>
      <Button intensity="kawaii" sfx="やった！" color="mint">
        Custom sfx
      </Button>
    </div>
  )
}
