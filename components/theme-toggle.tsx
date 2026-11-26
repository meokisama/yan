"use client"

import { MoonStarIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function toggleTheme(next?: boolean) {
  const dark = document.documentElement.classList.toggle("dark", next)
  try {
    localStorage.setItem("theme", dark ? "dark" : "light")
  } catch {}
  window.dispatchEvent(new CustomEvent("yan-theme", { detail: dark }))
  return dark
}

export function ThemeToggle() {
  return (
    <Button
      variant="ghost"
      size="icon"
      intensity="subtle"
      aria-label="Toggle dark mode"
      fx={{ shapes: ["star", "sparkle"], colors: ["--yan-fx-4", "--yan-fx-2"] }}
      onClick={() => toggleTheme()}
    >
      <SunIcon className="absolute size-5! scale-0 -rotate-90 transition-[scale,rotate] duration-500 ease-[cubic-bezier(.34,1.7,.5,1)] dark:scale-100 dark:rotate-0" />
      <MoonStarIcon className="size-5! scale-100 rotate-0 transition-[scale,rotate] duration-500 ease-[cubic-bezier(.34,1.7,.5,1)] dark:scale-0 dark:rotate-90" />
    </Button>
  )
}
