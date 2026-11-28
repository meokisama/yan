import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="textarea-demo-note">A note for the baker</Label>
      <Textarea id="textarea-demo-note" placeholder="Extra red bean, please ♡" />
    </div>
  )
}
