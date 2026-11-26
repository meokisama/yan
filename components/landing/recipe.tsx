import { AccessibilityIcon, FeatherIcon, MoonStarIcon, PackageOpenIcon } from "lucide-react"

import { InstallCommand } from "@/components/docs/install-command"
import { SectionHeading } from "@/components/landing/section-heading"
import { TiltCard } from "@/components/landing/tilt-card"

const steps = [
  {
    n: "1",
    title: "Add it",
    body: "One shadcn CLI command pulls the component, the Yan theme tokens and the yan-fx effects layer.",
    tint: "sakura",
  },
  {
    n: "2",
    title: "Own it",
    body: "The source lands in your repo as a single file. Rename it, restyle it, delete half of it.",
    tint: "lemon",
  },
  {
    n: "3",
    title: "Squish it",
    body: "Import and render. Pick an intensity, set your own onomatopoeia, tune the particle burst.",
    tint: "mint",
  },
] as const

const facts = [
  {
    icon: AccessibilityIcon,
    title: "Radix underneath",
    body: "Keyboard, focus and ARIA come from Radix primitives. Cute never means inaccessible.",
  },
  {
    icon: FeatherIcon,
    title: "A tiny effects layer",
    body: "One click-through canvas, no dependencies. It sleeps when nothing is animating.",
  },
  {
    icon: MoonStarIcon,
    title: "Day and night",
    body: "Strawberry-milk paper by day, plum night sky by night. Same candy accents in both.",
  },
  {
    icon: PackageOpenIcon,
    title: "shadcn compatible",
    body: "Yan uses shadcn's token names, so you can adopt it one component at a time.",
  },
]

export function Recipe() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:py-28">
      <SectionHeading kicker="no npm package to babysit" title="Copy, paste, ぷにっ">
        Yan is delivered the shadcn way: source code you own, not a dependency you update.
      </SectionHeading>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {steps.map((s, i) => (
          <TiltCard
            key={s.n}
            delay={i * 0.07}
            className="p-7"
            style={
              { "--tint": `var(--yan-${s.tint})`, "--tint-edge": `var(--yan-${s.tint}-edge)` } as React.CSSProperties
            }
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-7 -right-2 font-display text-[9rem] leading-none text-(--tint)/45 select-none"
            >
              {s.n}
            </span>
            <span className="yan-candy relative grid size-12 place-items-center rounded-2xl font-display text-2xl text-foreground [--yan-c:var(--tint)] [--yan-depth:4px] [--yan-edge:var(--tint-edge)] dark:text-(--night-deep)">
              {s.n}
            </span>
            <h3 className="relative mt-6 font-display text-3xl">{s.title}</h3>
            <p className="relative mt-2 font-medium text-pretty text-muted-foreground">{s.body}</p>
          </TiltCard>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <InstallCommand item="button" />
      </div>

      <ul className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f) => (
          <li key={f.title}>
            <span className="grid size-11 place-items-center rounded-2xl bg-card text-yan-sakura-edge shadow-[inset_0_0_0_2px_color-mix(in_oklch,var(--primary)_45%,transparent),0_4px_0_0_color-mix(in_oklch,var(--primary)_45%,transparent)] dark:text-yan-sakura">
              <f.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-black">{f.title}</h3>
            <p className="mt-1 text-sm font-medium text-pretty text-muted-foreground">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
