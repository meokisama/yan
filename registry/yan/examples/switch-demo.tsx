"use client"

import * as React from "react"

import { Switch } from "@/components/ui/switch"

export default function SwitchDemo() {
  const [on, setOn] = React.useState(true)
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-bold">
      <Switch checked={on} onCheckedChange={setOn} />
      {on ? "Mochi is awake ♡" : "Mochi is napping…"}
    </label>
  )
}
