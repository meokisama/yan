"use client"

import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDemo() {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-6">
      <div className="flex h-14 w-full items-center gap-4">
        <Skeleton loaded={loaded} className="size-14 shrink-0 rounded-full">
          <Avatar size="lg">
            <AvatarImage src="/mochi-avatar.svg" alt="Mochi-chan" />
            <AvatarFallback>MC</AvatarFallback>
          </Avatar>
        </Skeleton>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <Skeleton loaded={loaded} className="h-4 w-3/5 rounded-full">
            <p className="truncate text-sm font-black">Mochi-chan</p>
          </Skeleton>
          <Skeleton loaded={loaded} className="h-3 rounded-full">
            <p className="truncate text-sm font-medium text-muted-foreground">Saved you a seat by the window</p>
          </Skeleton>
        </div>
      </div>
      <Button size="sm" variant="outline" intensity="subtle" onClick={() => setLoaded((v) => !v)}>
        {loaded ? "Again" : "Load"}
      </Button>
    </div>
  )
}
