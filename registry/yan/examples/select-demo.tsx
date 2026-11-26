import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectDemo() {
  return (
    <Select defaultValue="sakura">
      <SelectTrigger className="w-56" aria-label="Flavour">
        <SelectValue placeholder="Pick a flavour" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Classic</SelectLabel>
          <SelectItem value="sakura">Sakura</SelectItem>
          <SelectItem value="matcha">Matcha</SelectItem>
          <SelectItem value="anko">Red bean</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Seasonal</SelectLabel>
          <SelectItem value="yuzu">Yuzu</SelectItem>
          <SelectItem value="ichigo">Strawberry milk</SelectItem>
          <SelectItem value="kuri" disabled>
            Chestnut (sold out)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
