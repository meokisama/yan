import { Button } from "@/components/ui/button"

export default function ButtonVariants() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button>Sakura</Button>
        <Button color="lavender">Lavender</Button>
        <Button color="mint">Mint</Button>
        <Button color="sky">Sky</Button>
        <Button color="lemon">Lemon</Button>
        <Button color="peach">Peach</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button variant="outline">Outline</Button>
        <Button variant="outline" color="mint">
          Mint outline
        </Button>
        <Button variant="destructive">Oops</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  )
}
