import { DocsSidebar } from "@/components/docs/docs-sidebar"

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    // pb-10: where the sticky sidebar stops, so it never touches the footer
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 pt-24 pb-10">
      <aside className="sticky top-24 hidden h-[calc(100dvh-7.5rem)] w-60 shrink-0 md:block">
        {/* py-5 on the card, scrolling inside it: the scrollbar stays clear of the rounded corners */}
        <div className="yan-card h-full py-5 pr-1 [--tint:var(--yan-lavender)] [--tint-edge:var(--yan-lavender-edge)]">
          <div className="scroll-quiet h-full overflow-y-auto pr-2 pl-4">
            <DocsSidebar />
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 pb-18">
        <details className="yan-card group/menu mb-5 [--tint:var(--yan-lavender)] [--tint-edge:var(--yan-lavender-edge)] md:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3 font-display text-lg [&::-webkit-details-marker]:hidden">
            Docs menu
            <span aria-hidden="true" className="text-yan-sakura-edge transition-transform group-open/menu:rotate-180">
              ▾
            </span>
          </summary>
          <div className="px-3 pb-4">
            <DocsSidebar id="mobile" />
          </div>
        </details>
        <article className="yan-card max-w-3xl px-6 py-9 [--tint:var(--yan-sakura)] sm:px-10 sm:py-11">{children}</article>
      </main>
    </div>
  )
}
