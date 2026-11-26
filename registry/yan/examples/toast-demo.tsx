"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button
        sfx={false}
        onClick={() => toast({ title: "Mochi-chan says hi", description: "She saved you a seat by the window." })}
      >
        Say hi
      </Button>
      <Button
        variant="mint"
        sfx={false}
        onClick={() => toast.success("Saved!", { description: "Your snack list is safe and sound." })}
      >
        Save
      </Button>
      <Button
        variant="destructive"
        sfx={false}
        onClick={() => toast.error("Oh no", { description: "The parfait fell over. Please try again." })}
      >
        Oops
      </Button>
    </div>
  )
}
