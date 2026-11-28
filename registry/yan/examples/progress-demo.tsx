"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function ProgressDemo() {
  const [value, setValue] = React.useState(40)
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <Progress value={value} aria-label="Snack level" />
      <Button
        size="sm"
        color="mint"
        sfx="もぐもぐ"
        onClick={() => setValue((v) => (v >= 100 ? 0 : Math.min(100, v + 20)))}
      >
        {value >= 100 ? "Again!" : "Feed the mochi"}
      </Button>
    </div>
  )
}
