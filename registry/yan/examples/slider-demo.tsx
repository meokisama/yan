"use client"

import * as React from "react"

import { Slider } from "@/components/ui/slider"

export default function SliderDemo() {
  const [value, setValue] = React.useState([64])
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <div className="flex items-baseline justify-between text-sm font-bold">
        <span>Moe level</span>
        <span className="font-mono text-yan-sakura-edge tabular-nums">{value[0]}%</span>
      </div>
      <Slider value={value} onValueChange={setValue} aria-label="Moe level" />
    </div>
  )
}
