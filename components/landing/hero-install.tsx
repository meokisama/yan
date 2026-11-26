"use client"

import { CopyButton } from "@/components/docs/copy-button"
import { siteConfig } from "@/lib/site"

/** One-line install pill for the hero. */
export function HeroInstall({ item = "button" }: { item?: string }) {
  const cmd = `npx shadcn@latest add ${siteConfig.url}/r/${item}.json`
  return (
    <div className="yan-glass flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-4 text-left">
      <span aria-hidden="true" className="font-mono text-sm font-bold text-yan-sakura-edge select-none">
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap [scrollbar-width:none]">
        {cmd}
      </code>
      <CopyButton value={cmd} className="shrink-0 bg-transparent" />
    </div>
  )
}
