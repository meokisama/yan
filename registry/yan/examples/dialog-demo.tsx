import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button sfx={false}>Open the snack box</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your last mochi?</DialogTitle>
          <DialogDescription>
            Mochi-chan is looking at it very politely. You can always buy another one tomorrow.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" intensity="subtle">
              Keep it
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button sfx="ありがと！">Share ♡</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
