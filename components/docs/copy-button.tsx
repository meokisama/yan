"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <Button
      size="icon"
      variant="ghost"
      intensity={copied ? "off" : "subtle"}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cn("z-10 size-8 text-muted-foreground hover:text-foreground", className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
        } catch {}
        setCopied(true)
      }}
    >
      {copied ? <CheckIcon className="text-yan-mint-edge" /> : <CopyIcon />}
    </Button>
  )
}
