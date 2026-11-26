"use client"

import * as React from "react"
import Link from "next/link"
import { BellIcon, HeartIcon, MoonStarIcon, SparklesIcon, StarIcon, Volume2Icon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SectionHeading } from "@/components/landing/section-heading"
import { TiltCard } from "@/components/landing/tilt-card"
import { toggleTheme } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

function Card({
  name,
  href,
  tint,
  className,
  stage,
  pattern,
  children,
  delay,
}: {
  name: string
  href: string
  /** Candy name: sets the card's rim, edge and pattern color. */
  tint: "sakura" | "lavender" | "mint" | "sky" | "lemon" | "peach"
  className?: string
  /** Extra classes for the stage behind the demo. */
  stage?: string
  /** Pattern utility drawn over the stage tint (bg-dots, bg-gingham, ...). */
  pattern?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <TiltCard
      delay={delay}
      className={cn("flex flex-col", className)}
      style={
        {
          "--tint": `var(--yan-${tint})`,
          "--tint-edge": `var(--yan-${tint}-edge)`,
          "--dot": `var(--yan-${tint}-edge)`,
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between px-6 pt-5">
        <h3 className="font-display text-xl">{name}</h3>
        <Link
          href={href}
          className="rounded-full bg-(--tint)/40 px-3 py-1 text-xs font-extrabold text-foreground/80 transition-colors hover:bg-(--tint)"
        >
          docs →
        </Link>
      </div>
      <div
        className={cn(
          "relative m-3 flex flex-1 items-center justify-center rounded-[calc(var(--radius-3xl)-0.75rem)] bg-(--tint)/22 p-6",
          stage
        )}
      >
        {pattern && (
          <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 rounded-[inherit] opacity-70", pattern)} />
        )}
        <div className="relative flex w-full items-center justify-center">{children}</div>
      </div>
    </TiltCard>
  )
}

function Buttons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-5">
      <Button size="lg">Sakura</Button>
      <Button size="lg" variant="secondary" sfx="キラッ">
        Lavender
      </Button>
      <Button size="lg" variant="mint" sfx="ぽよん">
        Mint
      </Button>
      <Button variant="outline">Outline</Button>
      <Button size="icon" variant="destructive" aria-label="Love" sfx="ドキッ" fx={{ shapes: ["heart"], count: 16 }}>
        <HeartIcon className="fill-current" />
      </Button>
      <Button
        variant="secondary"
        sfx="ひらひら"
        fx={{ shapes: ["petal"], colors: ["--yan-fx-1", "--yan-sakura"], count: 22, power: 0.9, size: 10 }}
      >
        <SparklesIcon /> Petals
      </Button>
    </div>
  )
}

function Switches() {
  const [dark, setDark] = React.useState(false)
  React.useEffect(() => {
    const sync = () => setDark(document.documentElement.classList.contains("dark"))
    sync()
    window.addEventListener("yan-theme", sync)
    return () => window.removeEventListener("yan-theme", sync)
  }, [])

  const row = "flex cursor-pointer items-center justify-between gap-6 text-sm font-extrabold"
  return (
    <div className="flex w-full max-w-60 flex-col gap-4">
      <label className={row}>
        <span className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-yan-sakura-edge" /> Sparkles
        </span>
        <Switch defaultChecked />
      </label>
      <label className={row}>
        <span className="flex items-center gap-2">
          <Volume2Icon className="size-4 text-yan-lavender-edge" /> Sound effects
        </span>
        <Switch />
      </label>
      <label className={row}>
        <span className="flex items-center gap-2">
          <MoonStarIcon className="size-4 text-yan-sky-edge" /> Night mode
        </span>
        <Switch
          checked={dark}
          onCheckedChange={(v) => toggleTheme(v)}
          fx={{ shapes: ["star"], colors: ["--yan-fx-4", "--yan-fx-2"] }}
        />
      </label>
    </div>
  )
}

function MoeSlider() {
  const [v, setV] = React.useState([72])
  const faces = ["( ˘ω˘ )", "(・ω・)", "(｡•ᴗ•｡)", "(≧◡≦)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"]
  return (
    <div className="flex w-full max-w-64 flex-col gap-3">
      <div className="flex items-end justify-between font-extrabold">
        <span className="text-sm">Moe level</span>
        <span className="font-display text-3xl leading-none text-yan-mint-foreground tabular-nums dark:text-yan-mint">
          {v[0]}
          <span className="text-base">%</span>
        </span>
      </div>
      <Slider value={v} onValueChange={setV} aria-label="Moe level" />
      <p className="h-5 text-center text-sm font-bold text-foreground/70" aria-hidden="true">
        {faces[Math.min(faces.length - 1, Math.floor(v[0] / 21))]}
      </p>
    </div>
  )
}

function Todo() {
  const items = ["Pet the mochi", "Add more sparkles", "Ship it ♡"]
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((item, i) => (
        <label key={item} className="flex cursor-pointer items-center gap-3 text-sm font-extrabold">
          <Checkbox defaultChecked={i === 0} />
          <span className="decoration-yan-lemon-edge decoration-wavy decoration-2 transition-opacity peer-data-[state=checked]:line-through peer-data-[state=checked]:opacity-55">
            {item}
          </span>
        </label>
      ))}
    </div>
  )
}

function Snack() {
  const [value, setValue] = React.useState(40)
  return (
    <div className="flex w-full max-w-64 flex-col items-center gap-4">
      <div className="flex w-full items-baseline justify-between text-sm font-extrabold">
        <span>Snack level</span>
        <span className="font-mono tabular-nums">{value}%</span>
      </div>
      <Progress value={value} aria-label="Snack level" />
      <Button
        size="sm"
        variant="mint"
        sfx="もぐもぐ"
        onClick={() => setValue((x) => (x >= 100 ? 0 : Math.min(100, x + 20)))}
      >
        {value >= 100 ? "Again!" : "Feed the mochi"}
      </Button>
    </div>
  )
}

function Stickers() {
  const spin = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-6", "-rotate-3", "rotate-2", "-rotate-5"]
  const badges = [
    <Badge key="a" dot>New</Badge>,
    <Badge key="b" variant="lavender">Dreamy</Badge>,
    <Badge key="c" variant="mint">Fresh</Badge>,
    <Badge key="d" variant="lemon">★ Top pick</Badge>,
    <Badge key="e" variant="sky">Calm</Badge>,
    <Badge key="f" variant="peach">Limited</Badge>,
    <Badge key="g" variant="outline">ぷにっ</Badge>,
  ]
  return (
    <div className="flex max-w-xs flex-wrap items-center justify-center gap-x-3 gap-y-4">
      {badges.map((b, i) => (
        <span
          key={i}
          className={cn(
            "transition-[rotate,scale] duration-300 ease-[cubic-bezier(.34,1.7,.5,1)] hover:scale-125 hover:rotate-0 [&>span]:px-3 [&>span]:py-1 [&>span]:text-sm",
            spin[i]
          )}
        >
          {b}
        </span>
      ))}
    </div>
  )
}

function Flavours() {
  const panel = "text-center text-sm font-bold text-pretty text-foreground/80"
  return (
    <Tabs defaultValue="sweet" className="w-full max-w-xs items-center">
      <TabsList>
        <TabsTrigger value="sweet">Sweet</TabsTrigger>
        <TabsTrigger value="sour" color="lemon">
          Sour
        </TabsTrigger>
        <TabsTrigger value="salty" color="sky">
          Salty
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sweet" className={panel}>
        Strawberry daifuku, melon pan and a very tall parfait.
      </TabsContent>
      <TabsContent value="sour" className={panel}>
        Umeboshi candy and lemon drops that make you go キュッ.
      </TabsContent>
      <TabsContent value="salty" className={panel}>
        Senbei, edamame and salted caramel mochi.
      </TabsContent>
    </Tabs>
  )
}

function Nickname() {
  const [name, setName] = React.useState("")
  return (
    <label className="flex w-full max-w-60 flex-col gap-2 text-sm font-extrabold">
      Nickname
      <Input placeholder="mochi-chan" value={name} onChange={(e) => setName(e.target.value)} maxLength={16} />
      <span className="h-5 font-hand text-xs font-normal text-foreground/70" aria-live="polite">
        {name.trim() ? "hello, " + name.trim() + "-chan ♡" : "type something cute"}
      </span>
    </label>
  )
}

function Flavour() {
  return (
    <div className="flex w-full max-w-60 flex-col gap-2 text-sm font-extrabold">
      <span id="toy-flavour">Today&apos;s flavour</span>
      <Select defaultValue="sakura">
        <SelectTrigger aria-labelledby="toy-flavour">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sakura">Sakura</SelectItem>
          <SelectItem value="matcha">Matcha</SelectItem>
          <SelectItem value="yuzu">Yuzu</SelectItem>
          <SelectItem value="ichigo">Strawberry milk</SelectItem>
          <SelectItem value="kuri" disabled>
            Chestnut (sold out)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function Friends() {
  return (
    <div className="flex flex-col items-center gap-4">
      <AvatarGroup>
        <Avatar size="lg" emote="♪">
          <AvatarImage src="/mochi-avatar.svg" alt="Mochi-chan" />
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
        <Avatar size="lg" variant="lavender" emote="♡">
          <AvatarFallback>YU</AvatarFallback>
        </Avatar>
        <Avatar size="lg" variant="mint" emote="！">
          <AvatarFallback>MI</AvatarFallback>
        </Avatar>
        <Avatar size="lg" variant="lemon">
          <AvatarFallback>+3</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <p className="text-sm font-bold text-foreground/70">Mochi-chan and friends</p>
    </div>
  )
}

function SnackBox() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button sfx={false}>Open the snack box</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your last mochi?</DialogTitle>
          <DialogDescription>
            Mochi-chan is looking at it very politely. You can always buy another one tomorrow.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" intensity="subtle">
              Keep it
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button sfx="ありがと！">Share ♡</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Toasts() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        size="sm"
        sfx={false}
        onClick={() => toast({ title: "Mochi-chan says hi", description: "She saved you a seat by the window." })}
      >
        Say hi
      </Button>
      <Button
        size="sm"
        variant="mint"
        sfx={false}
        onClick={() => toast.success("Saved!", { description: "Your snack list is safe and sound." })}
      >
        Save
      </Button>
      <Button
        size="sm"
        variant="destructive"
        sfx={false}
        onClick={() => toast.error("Oh no", { description: "The parfait fell over. Please try again." })}
      >
        Oops
      </Button>
    </div>
  )
}

function Hints() {
  const hints = [
    { icon: HeartIcon, label: "Like", tip: "Send a little heart ♡", variant: "default" },
    { icon: StarIcon, label: "Favourite", tip: "Keep it in your sticker book", variant: "secondary" },
    { icon: BellIcon, label: "Notify me", tip: "We will ring a tiny bell", variant: "mint" },
  ] as const
  return (
    <div className="flex items-center justify-center gap-4">
      {hints.map((h) => (
        <Tooltip key={h.label}>
          <TooltipTrigger asChild>
            <Button size="icon" variant={h.variant} aria-label={h.label} intensity="subtle">
              <h.icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{h.tip}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

export function ToyBox() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:py-28">
      <SectionHeading kicker="go on, touch everything ♡" title="A toy box of components">
        Every piece is a single file in your repo, with Radix handling focus and keyboard underneath.
        These are live. Poke them.
      </SectionHeading>

      <div className="mt-14 grid gap-6 md:grid-cols-6">
        <Card name="Button" href="/docs/components/button" tint="sakura" className="md:col-span-4" stage="min-h-56" pattern="bg-dots">
          <Buttons />
        </Card>
        <Card name="Switch" href="/docs/components/switch" tint="lavender" className="md:col-span-2" delay={0.06}>
          <Switches />
        </Card>
        <Card name="Slider" href="/docs/components/slider" tint="mint" className="md:col-span-2" stage="min-h-48">
          <MoeSlider />
        </Card>
        <Card name="Checkbox" href="/docs/components/checkbox" tint="lemon" className="md:col-span-2" pattern="bg-gingham" delay={0.06}>
          <Todo />
        </Card>
        <Card name="Progress" href="/docs/components/progress" tint="sky" className="md:col-span-2" delay={0.12}>
          <Snack />
        </Card>
        <Card name="Badge" href="/docs/components/badge" tint="peach" className="md:col-span-3" stage="min-h-44" pattern="bg-candy-stripes">
          <Stickers />
        </Card>
        <Card name="Tabs" href="/docs/components/tabs" tint="lavender" className="md:col-span-3" stage="min-h-44" delay={0.06}>
          <Flavours />
        </Card>
        <Card name="Input" href="/docs/components/input" tint="sakura" className="md:col-span-2" stage="min-h-44">
          <Nickname />
        </Card>
        <Card name="Select" href="/docs/components/select" tint="mint" className="md:col-span-2" delay={0.06}>
          <Flavour />
        </Card>
        <Card name="Avatar" href="/docs/components/avatar" tint="lemon" className="md:col-span-2" pattern="bg-dots" delay={0.12}>
          <Friends />
        </Card>
        <Card name="Dialog" href="/docs/components/dialog" tint="sky" className="md:col-span-2" stage="min-h-40" pattern="bg-gingham">
          <SnackBox />
        </Card>
        <Card name="Toast" href="/docs/components/toast" tint="peach" className="md:col-span-2" delay={0.06}>
          <Toasts />
        </Card>
        <Card name="Tooltip" href="/docs/components/tooltip" tint="lavender" className="md:col-span-2" pattern="bg-candy-stripes" delay={0.12}>
          <Hints />
        </Card>
      </div>
    </section>
  )
}
