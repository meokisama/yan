import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button color="lavender" sfx={false}>
          Name your mochi
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-3">
        <p className="text-base font-black">A new friend!</p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="popover-demo-name">Name</Label>
          <Input id="popover-demo-name" defaultValue="Daifuku" />
        </div>
        <PopoverClose asChild>
          <Button size="sm" sfx="よろしく！" className="self-end">
            Save
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
