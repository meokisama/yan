"use client"

import * as React from "react"
import { Tabs } from "radix-ui"

import { CopyButton } from "@/components/docs/copy-button"
import { siteConfig } from "@/lib/site"

const managers = {
  npm: "npx shadcn@latest add",
  yarn: "yarn dlx shadcn@latest add",
  pnpm: "pnpm dlx shadcn@latest add",
  bun: "bunx --bun shadcn@latest add",
} as const

/** A little terminal window with a tab per package manager. */
export function InstallCommand({ item }: { item: string }) {
  const url = `${siteConfig.url}/r/${item}.json`
  return (
    <Tabs.Root
      defaultValue="npm"
      className="my-6 overflow-hidden rounded-3xl bg-(--night) text-[oklch(0.93_0.03_340)] shadow-[inset_0_2px_0_0_oklch(1_0_0/0.14),0_7px_0_0_var(--night-deep),0_26px_40px_-20px_oklch(0.3_0.1_330/0.7)]"
    >
      <div className="flex items-center gap-3 border-b-2 border-dashed border-white/12 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-yan-sakura" />
          <span className="size-3 rounded-full bg-yan-lemon" />
          <span className="size-3 rounded-full bg-yan-mint" />
        </span>
        <Tabs.List className="flex gap-1" aria-label="Package manager">
          {Object.keys(managers).map((m) => (
            <Tabs.Trigger
              key={m}
              value={m}
              className="cursor-pointer rounded-full px-3 py-1 font-mono text-xs font-bold text-white/55 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-yan-sakura data-[state=active]:bg-yan-sakura data-[state=active]:text-[oklch(0.26_0.1_355)]"
            >
              {m}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>
      {Object.entries(managers).map(([m, cmd]) => (
        <Tabs.Content key={m} value={m} className="relative">
          <pre className="overflow-x-auto py-4 pr-12 pl-5 font-mono text-[13px] leading-relaxed [scrollbar-width:none]">
            <code>
              <span className="text-yan-mint select-none">❯ </span>
              <span className="text-yan-sakura">{cmd}</span> <span className="text-white/85">{url}</span>
            </code>
          </pre>
          <CopyButton
            value={`${cmd} ${url}`}
            className="absolute top-2.5 right-2 text-white/60 hover:bg-white/10 hover:text-white"
          />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
