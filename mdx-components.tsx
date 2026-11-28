import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import { isValidElement } from "react"

import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { FxPlayground } from "@/components/docs/fx-playground"
import { InstallCommand } from "@/components/docs/install-command"
import { PropsTable } from "@/components/docs/props-table"
import { cn } from "@/lib/utils"

const components: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1 className={cn("mb-4 font-display text-5xl leading-none text-yan-sakura-edge sm:text-6xl dark:text-yan-sakura", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-14 mb-4 flex items-center gap-2.5 border-b-2 border-dashed pb-2 font-display text-3xl before:text-lg before:text-yan-sakura-edge before:content-['✿'] dark:before:text-yan-sakura",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mt-9 mb-3 text-xl font-black", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("my-4 leading-7 text-foreground/90", className)} {...props} />
  ),
  a: ({ href = "", className, ...props }) => (
    <Link
      href={href}
      className={cn(
        "font-bold text-yan-sakura-edge underline decoration-primary decoration-wavy decoration-2 underline-offset-4 hover:decoration-yan-sakura-edge dark:text-yan-sakura",
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn("my-4 ml-1 list-none space-y-2 [&>li]:pl-6 [&>li]:relative", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li
      className={cn(
        "leading-7 before:absolute before:left-0 before:text-yan-sakura-edge before:content-['♡']",
        className
      )}
      {...props}
    />
  ),
  strong: (props) => <strong className="font-extrabold" {...props} />,
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded-lg bg-accent px-1.5 py-0.5 font-mono text-[0.85em] font-semibold",
        className
      )}
      {...props}
    />
  ),
  // Fenced code blocks → shiki-highlighted CodeBlock.
  pre: ({ children }) => {
    if (isValidElement<{ className?: string; children?: string }>(children)) {
      const lang = children.props.className?.replace("language-", "") ?? "text"
      return <CodeBlock code={String(children.props.children ?? "")} lang={lang} />
    }
    return <pre>{children}</pre>
  },
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-6 rounded-2xl border-2 border-dashed border-yan-lemon-edge/70 bg-yan-lemon/30 px-5 py-1 [&_p]:my-3",
        className
      )}
      {...props}
    />
  ),
  ComponentPreview,
  FxPlayground,
  InstallCommand,
  PropsTable,
}

export function useMDXComponents(): MDXComponents {
  return components
}
