import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold tracking-wide whitespace-nowrap",
    "border-2 border-white shadow-[0_2px_0_0_var(--yan-edge),0_4px_8px_-2px_color-mix(in_oklch,var(--yan-edge)_45%,transparent)] dark:border-white/25",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
  ],
  {
    variants: {
      color: {
        sakura: "text-primary-foreground [--yan-c:var(--primary)] [--yan-edge:var(--yan-sakura-edge)]",
        lavender: "text-secondary-foreground [--yan-c:var(--secondary)] [--yan-edge:var(--yan-lavender-edge)]",
        mint: "text-yan-mint-foreground [--yan-c:var(--yan-mint)] [--yan-edge:var(--yan-mint-edge)]",
        sky: "text-yan-sky-foreground [--yan-c:var(--yan-sky)] [--yan-edge:var(--yan-sky-edge)]",
        lemon: "text-yan-lemon-foreground [--yan-c:var(--yan-lemon)] [--yan-edge:var(--yan-lemon-edge)]",
        peach: "text-yan-peach-foreground [--yan-c:var(--yan-peach)] [--yan-edge:var(--yan-peach-edge)]",
      },
      variant: {
        default: "bg-(--yan-c)",
        outline: "border-(--yan-c) bg-card text-foreground [--yan-edge:var(--yan-c)] dark:border-(--yan-c)",
      },
    },
    defaultVariants: { color: "sakura", variant: "default" },
  }
)

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    /** Show a little twinkling dot before the label. */
    dot?: boolean
  }

/** A sticker-style label: candy fill, white outline, tiny edge shadow. */
function Badge({ className, color, variant, asChild = false, dot = false, children, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span"
  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ color, variant }), className)} {...props}>
      {dot ? (
        <>
          <span
            aria-hidden="true"
            className="size-1.5 animate-[yan-twinkle_1.6s_ease-in-out_infinite] rounded-full bg-current motion-reduce:animate-none"
          />
          <Slot.Slottable>{children}</Slot.Slottable>
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }
