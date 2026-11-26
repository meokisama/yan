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
      variant: {
        default: "bg-primary text-primary-foreground [--yan-edge:var(--yan-sakura-edge)]",
        lavender: "bg-secondary text-secondary-foreground [--yan-edge:var(--yan-lavender-edge)]",
        mint: "bg-yan-mint text-yan-mint-foreground [--yan-edge:var(--yan-mint-edge)]",
        sky: "bg-yan-sky text-yan-sky-foreground [--yan-edge:var(--yan-sky-edge)]",
        lemon: "bg-yan-lemon text-yan-lemon-foreground [--yan-edge:var(--yan-lemon-edge)]",
        peach: "bg-yan-peach text-yan-peach-foreground [--yan-edge:var(--yan-peach-edge)]",
        outline: "border-primary bg-card text-foreground [--yan-edge:var(--primary)] dark:border-primary",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    /** Show a little twinkling dot before the label. */
    dot?: boolean
  }

/** A sticker-style label: candy fill, white outline, tiny edge shadow. */
function Badge({ className, variant, asChild = false, dot = false, children, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span"
  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
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
