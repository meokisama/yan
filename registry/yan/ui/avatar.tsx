"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { emote as popEmote } from "@/lib/yan-fx"

const avatarVariants = cva(
  [
    "relative flex shrink-0 overflow-hidden rounded-full border-[3px] border-white dark:border-white/30",
    "shadow-[0_3px_0_0_var(--yan-edge),0_8px_12px_-4px_var(--yan-edge)]",
  ],
  {
    variants: {
      variant: {
        sakura: "[--yan-c:var(--yan-sakura)] [--yan-edge:var(--yan-sakura-edge)]",
        lavender: "[--yan-c:var(--yan-lavender)] [--yan-edge:var(--yan-lavender-edge)]",
        mint: "[--yan-c:var(--yan-mint)] [--yan-edge:var(--yan-mint-edge)]",
        sky: "[--yan-c:var(--yan-sky)] [--yan-edge:var(--yan-sky-edge)]",
        lemon: "[--yan-c:var(--yan-lemon)] [--yan-edge:var(--yan-lemon-edge)]",
        peach: "[--yan-c:var(--yan-peach)] [--yan-edge:var(--yan-peach-edge)]",
      },
      size: {
        sm: "size-8 text-xs",
        default: "size-11 text-base",
        lg: "size-16 text-2xl",
      },
    },
    defaultVariants: { variant: "sakura", size: "default" },
  }
)

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants> & {
    /** A manga emotion mark ("♪", "♡", "！") that pops off the avatar when the pointer arrives. */
    emote?: string
  }

/** A sticker-style avatar: white die-cut ring, candy edge underneath. */
function Avatar({ className, variant, size, emote, onPointerEnter, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ variant, size }), className)}
      onPointerEnter={(e) => {
        onPointerEnter?.(e)
        if (emote && e.pointerType !== "touch") popEmote(e.currentTarget, emote)
      }}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full bg-(--yan-c) object-cover", className)}
      {...props}
    />
  )
}

/** Shown while the image loads or when there is none. Tinted by the avatar's variant. */
function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-(--yan-c) bg-linear-to-b from-white/45 to-white/0 to-60% font-black text-[oklch(0.3_0.08_335)] uppercase select-none",
        className
      )}
      {...props}
    />
  )
}

/** Overlaps avatars into a row; the one under the pointer hops up. */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex items-center -space-x-3 *:data-[slot=avatar]:transition-[translate] *:data-[slot=avatar]:duration-300 *:data-[slot=avatar]:ease-[cubic-bezier(.34,1.7,.5,1)] *:data-[slot=avatar]:hover:z-10 *:data-[slot=avatar]:hover:-translate-y-1.5",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, avatarVariants }
export type { AvatarProps }
