import { codeToHtml } from "shiki"

import { CopyButton } from "@/components/docs/copy-button"
import { cn } from "@/lib/utils"

async function highlight(code: string, lang: string) {
  "use cache"
  return codeToHtml(code, {
    lang,
    themes: { light: "rose-pine-dawn", dark: "rose-pine-moon" },
    defaultColor: "light",
  })
}

export async function CodeBlock({
  code,
  lang = "tsx",
  title,
  className,
}: {
  code: string
  lang?: string
  title?: string
  className?: string
}) {
  const html = await highlight(code.trimEnd(), lang)
  return (
    <figure
      className={cn(
        "group relative my-6 overflow-hidden rounded-2xl bg-[#faf4ed] shadow-[inset_0_0_0_2px_color-mix(in_oklch,var(--yan-peach)_55%,transparent)] dark:bg-[#232136] dark:shadow-[inset_0_0_0_2px_color-mix(in_oklch,var(--yan-lavender)_30%,transparent)]",
        className
      )}
    >
      <figcaption className="flex h-10 items-center gap-1.5 border-b-2 border-dashed border-yan-peach/50 px-4 dark:border-white/10">
        <span className="size-2.5 rounded-full bg-yan-sakura" />
        <span className="size-2.5 rounded-full bg-yan-lemon" />
        <span className="size-2.5 rounded-full bg-yan-mint" />
        <span className="ml-2 font-mono text-xs font-bold text-muted-foreground">{title ?? lang}</span>
      </figcaption>
      <CopyButton value={code} className="absolute top-1 right-1.5" />
      <div
        className="max-h-[480px] overflow-auto text-[13px] leading-relaxed [&_code]:font-mono [&_pre]:!bg-transparent [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
