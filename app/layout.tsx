import type { Metadata } from "next"
import { Cherry_Bomb_One, Geist_Mono, Hachi_Maru_Pop, M_PLUS_Rounded_1c } from "next/font/google"

import { Toaster } from "@/components/ui/toast"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { siteConfig } from "@/lib/site"
import "./globals.css"

const rounded = M_PLUS_Rounded_1c({
  variable: "--font-rounded",
  weight: ["400", "500", "700", "800", "900"],
  subsets: ["latin"],
})

const cherry = Cherry_Bomb_One({
  variable: "--font-cherry",
  weight: "400",
  subsets: ["latin"],
})

const hachi = Hachi_Maru_Pop({
  variable: "--font-hachi",
  weight: "400",
  subsets: ["latin"],
  preload: false,
})

const mono = Geist_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
}

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${rounded.variable} ${cherry.variable} ${hachi.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip font-sans">
        <div className="yan-sky" aria-hidden="true" />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  )
}
