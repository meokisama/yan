/**
 * Registry index: every installable Yan item lives here.
 * `scripts/build-registry.mts` turns it into `registry.json`, which
 * `shadcn build` then compiles into `public/r/*.json`.
 *
 * `{{BASE}}` is replaced with the registry URL at build time, so items can
 * depend on each other across the network (shadcn resolves them by URL).
 */
import { yanTheme } from "./theme"

export type RegistryItem = {
  name: string
  type: "registry:ui" | "registry:lib" | "registry:theme" | "registry:example" | "registry:hook"
  title?: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: { path: string; type: RegistryItem["type"] }[]
  cssVars?: { theme?: Record<string, string>; light?: Record<string, string>; dark?: Record<string, string> }
  css?: Record<string, unknown>
  categories?: string[]
}

const local = (name: string) => `{{BASE}}/r/${name}.json`

export const registryItems: RegistryItem[] = [
  {
    name: "yan-theme",
    type: "registry:theme",
    title: "Yan theme",
    description: "Pastel moe tokens (light + dark), candy surfaces and keyframes.",
    files: [],
    cssVars: { theme: yanTheme.theme, light: yanTheme.light, dark: yanTheme.dark },
    css: yanTheme.css,
  },
  {
    name: "yan-fx",
    type: "registry:lib",
    title: "yan-fx",
    description: "Zero-dependency canvas layer for sparkles, hearts, petals and onomatopoeia.",
    files: [{ path: "registry/yan/lib/yan-fx.ts", type: "registry:lib" }],
  },
  {
    name: "button",
    type: "registry:ui",
    title: "Button",
    description: "A mochi-squishy button that pops sparkles, hearts and ぷにっ when clicked.",
    dependencies: ["radix-ui", "class-variance-authority"],
    registryDependencies: ["utils", local("yan-theme"), local("yan-fx")],
    files: [{ path: "registry/yan/ui/button.tsx", type: "registry:ui" }],
    categories: ["form"],
  },
  {
    name: "switch",
    type: "registry:ui",
    title: "Switch",
    description: "A switch whose thumb is a tiny mochi: asleep when off, wide awake when on.",
    dependencies: ["radix-ui"],
    registryDependencies: ["utils", local("yan-theme"), local("yan-fx")],
    files: [{ path: "registry/yan/ui/switch.tsx", type: "registry:ui" }],
    categories: ["form"],
  },
  {
    name: "checkbox",
    type: "registry:ui",
    title: "Checkbox",
    description: "A gummy checkbox with a self-drawing tick and a candy pop.",
    dependencies: ["radix-ui"],
    registryDependencies: ["utils", local("yan-theme"), local("yan-fx")],
    files: [{ path: "registry/yan/ui/checkbox.tsx", type: "registry:ui" }],
    categories: ["form"],
  },
  {
    name: "slider",
    type: "registry:ui",
    title: "Slider",
    description: "A candy-filled slider with a heart thumb that leaves sparkles as you drag.",
    dependencies: ["radix-ui"],
    registryDependencies: ["utils", local("yan-theme"), local("yan-fx")],
    files: [{ path: "registry/yan/ui/slider.tsx", type: "registry:ui" }],
    categories: ["form"],
  },
  {
    name: "progress",
    type: "registry:ui",
    title: "Progress",
    description: "A candy-cane progress bar that throws a little party at 100%.",
    dependencies: ["radix-ui"],
    registryDependencies: ["utils", local("yan-theme"), local("yan-fx")],
    files: [{ path: "registry/yan/ui/progress.tsx", type: "registry:ui" }],
    categories: ["feedback"],
  },
  {
    name: "badge",
    type: "registry:ui",
    title: "Badge",
    description: "A sticker-style label: candy fill, white outline, tiny edge shadow.",
    dependencies: ["radix-ui", "class-variance-authority"],
    registryDependencies: ["utils", local("yan-theme")],
    files: [{ path: "registry/yan/ui/badge.tsx", type: "registry:ui" }],
    categories: ["display"],
  },
  {
    name: "input",
    type: "registry:ui",
    title: "Input",
    description: "A pill-shaped field pressed into the page, with a candy ring on focus.",
    dependencies: [],
    registryDependencies: ["utils", local("yan-theme"), local("yan-fx")],
    files: [{ path: "registry/yan/ui/input.tsx", type: "registry:ui" }],
    categories: ["form"],
  },
  {
    name: "select",
    type: "registry:ui",
    title: "Select",
    description: "A pill trigger with a puffy menu that pops out underneath.",
    dependencies: ["radix-ui"],
    registryDependencies: ["utils", local("yan-theme"), local("yan-fx")],
    files: [{ path: "registry/yan/ui/select.tsx", type: "registry:ui" }],
    categories: ["form"],
  },
  {
    name: "tabs",
    type: "registry:ui",
    title: "Tabs",
    description: "Tabs where the active one is a gummy candy sitting in a tray.",
    dependencies: ["radix-ui"],
    registryDependencies: ["utils", local("yan-theme"), local("yan-fx")],
    files: [{ path: "registry/yan/ui/tabs.tsx", type: "registry:ui" }],
    categories: ["navigation"],
  },
  {
    name: "tooltip",
    type: "registry:ui",
    title: "Tooltip",
    description: "A little speech bubble that pops out of whatever it describes.",
    dependencies: ["radix-ui"],
    registryDependencies: ["utils", local("yan-theme"), local("yan-fx")],
    files: [{ path: "registry/yan/ui/tooltip.tsx", type: "registry:ui" }],
    categories: ["overlay"],
  },
  {
    name: "dialog",
    type: "registry:ui",
    title: "Dialog",
    description: "A puffy modal card that bounces onto the page with sparkles.",
    dependencies: ["radix-ui"],
    registryDependencies: ["utils", local("yan-theme"), local("yan-fx")],
    files: [{ path: "registry/yan/ui/dialog.tsx", type: "registry:ui" }],
    categories: ["overlay"],
  },
  {
    name: "avatar",
    type: "registry:ui",
    title: "Avatar",
    description: "A sticker-style avatar with a white die-cut ring and candy fallbacks.",
    dependencies: ["radix-ui", "class-variance-authority"],
    registryDependencies: ["utils", local("yan-theme")],
    files: [{ path: "registry/yan/ui/avatar.tsx", type: "registry:ui" }],
    categories: ["display"],
  },
  {
    name: "toast",
    type: "registry:ui",
    title: "Toast",
    description: "Toasts that bounce in with a candy mark and an onomatopoeia sticker.",
    dependencies: ["radix-ui"],
    registryDependencies: ["utils", local("yan-theme"), local("yan-fx")],
    files: [{ path: "registry/yan/ui/toast.tsx", type: "registry:ui" }],
    categories: ["feedback"],
  },
  ...(
    [
      ["button-demo", "button"],
      ["button-variants", "button"],
      ["button-intensity", "button"],
      ["button-sizes", "button"],
      ["switch-demo", "switch"],
      ["checkbox-demo", "checkbox"],
      ["slider-demo", "slider"],
      ["progress-demo", "progress", "button"],
      ["badge-demo", "badge"],
      ["input-demo", "input"],
      ["select-demo", "select"],
      ["tabs-demo", "tabs"],
      ["tooltip-demo", "tooltip", "button"],
      ["dialog-demo", "dialog", "button"],
      ["avatar-demo", "avatar"],
      ["toast-demo", "toast", "button"],
      ["fx-recipes", "button", "yan-fx"],
      ["fx-effects", "button", "yan-fx"],
    ] as const
  ).map(
    ([name, ...deps]): RegistryItem => ({
      name,
      type: "registry:example",
      registryDependencies: deps.map(local),
      files: [{ path: `registry/yan/examples/${name}.tsx`, type: "registry:example" }],
    })
  ),
]
