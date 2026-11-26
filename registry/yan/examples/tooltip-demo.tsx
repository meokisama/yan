import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary" sfx={false}>
          Hover me
        </Button>
      </TooltipTrigger>
      <TooltipContent>ぽんっ! A tiny speech bubble.</TooltipContent>
    </Tooltip>
  )
}
