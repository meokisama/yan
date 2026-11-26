import { Button } from "@/components/ui/button"

export default function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button>Sakura</Button>
      <Button variant="secondary">Lavender</Button>
      <Button variant="mint">Mint</Button>
      <Button variant="destructive">Oops</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}
