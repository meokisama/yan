"use client"

import { Tabs } from "radix-ui"

const trigger =
  "relative cursor-pointer rounded-full px-4 py-1.5 text-sm font-extrabold text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/50 data-[state=active]:yan-candy data-[state=active]:text-primary-foreground data-[state=active]:[--yan-depth:3px]"

export function PreviewTabs({ preview, code }: { preview: React.ReactNode; code: React.ReactNode }) {
  return (
    <Tabs.Root defaultValue="preview" className="my-7">
      <Tabs.List
        className="mb-4 inline-flex gap-1 rounded-full bg-muted p-1 pb-2 shadow-[inset_0_2px_4px_0_oklch(0_0_0/0.08)]"
        aria-label="Preview or code"
      >
        <Tabs.Trigger value="preview" className={trigger}>
          Preview
        </Tabs.Trigger>
        <Tabs.Trigger value="code" className={trigger}>
          Code
        </Tabs.Trigger>
      </Tabs.List>
      <div className="overflow-hidden rounded-3xl shadow-[inset_0_0_0_2px_color-mix(in_oklch,var(--yan-lavender)_60%,transparent)]">
        <Tabs.Content value="preview">{preview}</Tabs.Content>
        <Tabs.Content value="code">{code}</Tabs.Content>
      </div>
    </Tabs.Root>
  )
}
