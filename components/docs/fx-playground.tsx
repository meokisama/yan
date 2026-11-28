"use client"

import * as React from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { fxRecipes, type FxRecipe } from "@/lib/yan-fx"

const recipes = Object.keys(fxRecipes) as FxRecipe[]

function Cell({ name, hint, children }: { name: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-3xl bg-card/80 p-5 shadow-[inset_0_0_0_2px_var(--border)]">
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-sm font-black">{name}</span>
        <span className="shrink-0 font-hand text-xs text-foreground/55">{hint}</span>
      </div>
      <div className="flex min-h-11 flex-1 items-center">{children}</div>
    </div>
  )
}

/** Pick a recipe, then try it on every component that takes `fx`. */
export function FxPlayground() {
  const [recipe, setRecipe] = React.useState<FxRecipe | null>("hearts")
  const [filled, setFilled] = React.useState(false)
  const [ready, setReady] = React.useState(false)
  const fx = recipe ? fxRecipes[recipe] : undefined
  // overlays open from a quiet trigger, so the only effect on screen is their own
  const trigger = { variant: "outline", intensity: "off", size: "sm" } as const

  return (
    <div className="my-7 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,color-mix(in_oklch,var(--yan-sakura)_22%,var(--card)),color-mix(in_oklch,var(--yan-lavender)_26%,var(--card))_55%,color-mix(in_oklch,var(--yan-sky)_22%,var(--card)))] shadow-[inset_0_0_0_2px_color-mix(in_oklch,var(--yan-lavender)_60%,transparent)]">
      <div
        role="group"
        aria-label="Recipe"
        className="flex gap-2.5 overflow-x-auto px-5 pt-5 pb-4 whitespace-nowrap sm:px-7 sm:pt-7"
      >
        <Button
          size="sm"
          variant={recipe === null ? "default" : "outline"}
          color="lavender"
          aria-pressed={recipe === null}
          sfx={false}
          onClick={() => setRecipe(null)}
        >
          Default
        </Button>
        {recipes.map((name) => (
          <Button
            key={name}
            size="sm"
            variant={recipe === name ? "default" : "outline"}
            aria-pressed={recipe === name}
            sfx={false}
            fx={fxRecipes[name]}
            className="capitalize"
            onClick={() => setRecipe(name)}
          >
            {name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 px-5 pb-5 sm:grid-cols-2 sm:px-7 sm:pb-7">
        <Cell name="Button" hint="click">
          <Button fx={fx}>Click me</Button>
        </Cell>

        <Cell name="Card" hint="click">
          <Card interactive asChild fx={fx} color="mint" className="w-full gap-0 py-3">
            <button type="button">
              <CardHeader className="px-4">
                <CardTitle className="truncate text-base">Matcha roll</CardTitle>
                <CardDescription className="truncate">The whole card is a button</CardDescription>
              </CardHeader>
            </button>
          </Card>
        </Cell>

        <Cell name="Checkbox" hint="tick">
          <div className="flex items-center gap-3">
            <Checkbox id="fxp-check" fx={fx} />
            <Label htmlFor="fxp-check" className="cursor-pointer">
              Add sprinkles
            </Label>
          </div>
        </Cell>

        <Cell name="Switch" hint="turn on">
          <div className="flex items-center gap-3">
            <Switch id="fxp-switch" fx={fx} />
            <Label htmlFor="fxp-switch" className="cursor-pointer">
              Sound effects
            </Label>
          </div>
        </Cell>

        <Cell name="Radio Group" hint="choose">
          <RadioGroup defaultValue="small" fx={fx} aria-label="Box size" className="flex gap-5">
            {["small", "regular", "party"].map((size) => (
              <div key={size} className="flex items-center gap-2">
                <RadioGroupItem value={size} id={`fxp-radio-${size}`} />
                <Label htmlFor={`fxp-radio-${size}`} className="cursor-pointer capitalize">
                  {size}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Cell>

        <Cell name="Slider" hint="drag, then let go">
          <Slider defaultValue={[40]} fx={fx} aria-label="Moe level" />
        </Cell>

        <Cell name="Input" hint="type">
          <Input fx={fx} placeholder="mochi-chan" aria-label="Nickname" className="text-base sm:text-sm" />
        </Cell>

        <Cell name="Textarea" hint="type">
          <Textarea fx={fx} placeholder="Extra red bean, please ♡" aria-label="Note" className="min-h-16" />
        </Cell>

        <Cell name="Progress" hint="fill it up">
          <div className="flex w-full items-center gap-4">
            <Progress value={filled ? 100 : 20} fx={fx} sfx={false} aria-label="Snack level" className="min-w-0 flex-1" />
            <Button {...trigger} onClick={() => setFilled((v) => !v)}>
              {filled ? "Reset" : "Fill"}
            </Button>
          </div>
        </Cell>

        <Cell name="Tabs" hint="switch">
          <Tabs defaultValue="sweet">
            <TabsList fx={fx} aria-label="Flavour">
              <TabsTrigger value="sweet">Sweet</TabsTrigger>
              <TabsTrigger value="sour" color="lemon">
                Sour
              </TabsTrigger>
              <TabsTrigger value="salty" color="sky">
                Salty
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Cell>

        <Cell name="Select" hint="pick one">
          <Select defaultValue="sakura" fx={fx}>
            <SelectTrigger aria-label="Flavour">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sakura">Sakura</SelectItem>
              <SelectItem value="matcha">Matcha</SelectItem>
              <SelectItem value="yuzu">Yuzu</SelectItem>
            </SelectContent>
          </Select>
        </Cell>

        <Cell name="Accordion" hint="open">
          <Accordion type="single" collapsible fx={fx}>
            <AccordionItem value="share">
              <AccordionTrigger className="py-3">Do I have to share?</AccordionTrigger>
              <AccordionContent>Mochi-chan says yes.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Cell>

        <Cell name="Dropdown Menu" hint="pick an item">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button {...trigger}>Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent fx={fx} align="start">
              <DropdownMenuItem>Add to box</DropdownMenuItem>
              <DropdownMenuItem>Send as a gift</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Cell>

        <Cell name="Popover" hint="open">
          <Popover>
            <PopoverTrigger asChild>
              <Button {...trigger}>Open popover</Button>
            </PopoverTrigger>
            <PopoverContent fx={fx} align="start" className="w-56 font-bold">
              A new friend! ぽんっ
            </PopoverContent>
          </Popover>
        </Cell>

        <Cell name="Dialog" hint="open">
          <Dialog>
            <DialogTrigger asChild>
              <Button {...trigger}>Open dialog</Button>
            </DialogTrigger>
            <DialogContent fx={fx}>
              <DialogHeader>
                <DialogTitle>Share your last mochi?</DialogTitle>
                <DialogDescription>Mochi-chan is looking at it very politely.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </Cell>

        <Cell name="Tooltip" hint="hover or focus">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button {...trigger}>Hover me</Button>
            </TooltipTrigger>
            <TooltipContent fx={fx}>A tiny speech bubble</TooltipContent>
          </Tooltip>
        </Cell>

        <Cell name="Toast" hint="send one">
          <Button {...trigger} onClick={() => toast({ title: "Mochi-chan says hi", fx })}>
            Show toast
          </Button>
        </Cell>

        <Cell name="Skeleton" hint="load it">
          <div className="flex w-full items-center gap-4">
            <div className="flex h-5 min-w-0 flex-1 items-center">
              <Skeleton loaded={ready} fx={fx} className="h-4 w-full rounded-full">
                <span className="block truncate text-sm font-black">Mochi-chan is here ♡</span>
              </Skeleton>
            </div>
            <Button {...trigger} onClick={() => setReady((v) => !v)}>
              {ready ? "Reset" : "Load"}
            </Button>
          </div>
        </Cell>
      </div>
    </div>
  )
}
