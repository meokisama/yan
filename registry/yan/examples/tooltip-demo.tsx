import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button color="lavender" sfx={false}>
          Hover me
        </Button>
      </TooltipTrigger>
      <TooltipContent>ぽんっ! A tiny speech bubble.</TooltipContent>
    </Tooltip>
  )
}
