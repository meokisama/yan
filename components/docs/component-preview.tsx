import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { CodeBlock } from "@/components/docs/code-block"
import { PreviewTabs } from "@/components/docs/preview-tabs"
import { examples } from "@/registry/examples"

async function readExample(name: string) {
  "use cache"
  return readFile(join(process.cwd(), "registry/yan/examples", `${name}.tsx`), "utf8")
}

export async function ComponentPreview({ name }: { name: string }) {
  const Example = examples[name]
  if (!Example) {
    return <p className="text-destructive">Example “{name}” not found.</p>
  }
  const code = await readExample(name)

  return (
    <PreviewTabs
      preview={
        <div className="relative isolate flex min-h-64 items-center justify-center overflow-hidden bg-[linear-gradient(135deg,color-mix(in_oklch,var(--yan-sakura)_22%,var(--card)),color-mix(in_oklch,var(--yan-lavender)_26%,var(--card))_55%,color-mix(in_oklch,var(--yan-sky)_22%,var(--card)))] p-10">
          <div aria-hidden="true" className="bg-dots absolute inset-0 -z-10 opacity-60 [--dot:var(--yan-lavender-edge)]" />
          <span
            aria-hidden="true"
            className="absolute top-3 right-4 -z-10 font-hand text-xs text-foreground/45 select-none"
          >
            try me ♡
          </span>
          <Example />
        </div>
      }
      code={<CodeBlock code={code} className="my-0 rounded-none shadow-none" />}
    />
  )
}
