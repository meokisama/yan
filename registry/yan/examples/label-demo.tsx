import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LabelDemo() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="label-demo-name" required>
        Nickname
      </Label>
      <Input id="label-demo-name" placeholder="mochi-chan" required />
    </div>
  )
}
