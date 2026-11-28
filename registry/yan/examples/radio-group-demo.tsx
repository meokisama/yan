import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const sizes = [
  { value: "small", label: "Small", note: "3 pieces" },
  { value: "regular", label: "Regular", note: "6 pieces" },
  { value: "party", label: "Party box", note: "12 pieces" },
]

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="regular" aria-label="Box size">
      {sizes.map((s) => (
        <div key={s.value} className="flex items-center gap-3">
          <RadioGroupItem value={s.value} id={`radio-demo-${s.value}`} />
          <Label htmlFor={`radio-demo-${s.value}`} className="cursor-pointer">
            {s.label}
            <span className="font-medium text-muted-foreground">{s.note}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
