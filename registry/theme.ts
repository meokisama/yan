/**
 * Yan design tokens: the single source of truth.
 *
 * `scripts/build-registry.mts` turns this into:
 *   - the `yan-theme` registry item (what `shadcn add` writes into the user's CSS)
 *   - `styles/yan-theme.css` (what this docs site itself imports)
 *
 * Token names follow shadcn's conventions (--primary, --ring, ...) so Yan drops
 * into an existing shadcn project; Yan-only tokens are prefixed `--yan-`.
 */

type Vars = Record<string, string>

/** Hirumoe (昼): strawberry-milk paper, candy accents, plum ink. */
const light: Vars = {
  radius: "1.25rem",
  background: "oklch(0.985 0.013 355)",
  foreground: "oklch(0.3 0.075 335)",
  card: "oklch(1 0 0)",
  "card-foreground": "oklch(0.3 0.075 335)",
  popover: "oklch(1 0 0)",
  "popover-foreground": "oklch(0.3 0.075 335)",
  primary: "oklch(0.8 0.135 355)",
  "primary-foreground": "oklch(0.3 0.11 355)",
  secondary: "oklch(0.83 0.095 300)",
  "secondary-foreground": "oklch(0.3 0.1 300)",
  muted: "oklch(0.958 0.02 345)",
  "muted-foreground": "oklch(0.52 0.055 335)",
  accent: "oklch(0.94 0.045 355)",
  "accent-foreground": "oklch(0.3 0.075 335)",
  destructive: "oklch(0.75 0.155 22)",
  "destructive-foreground": "oklch(0.3 0.1 22)",
  border: "oklch(0.9 0.04 350)",
  input: "oklch(0.87 0.05 350)",
  ring: "oklch(0.72 0.17 355)",

  // Yan palette: every candy has a surface, a darker "edge" and an ink.
  "yan-ink": "oklch(0.3 0.075 335)",
  "yan-sakura": "oklch(0.8 0.135 355)",
  "yan-sakura-edge": "oklch(0.65 0.19 355)",
  "yan-lavender": "oklch(0.83 0.095 300)",
  "yan-lavender-edge": "oklch(0.65 0.15 300)",
  "yan-mint": "oklch(0.88 0.1 165)",
  "yan-mint-edge": "oklch(0.7 0.13 165)",
  "yan-mint-foreground": "oklch(0.32 0.08 170)",
  "yan-sky": "oklch(0.86 0.08 230)",
  "yan-sky-edge": "oklch(0.68 0.12 235)",
  "yan-sky-foreground": "oklch(0.32 0.08 240)",
  "yan-lemon": "oklch(0.94 0.12 98)",
  "yan-lemon-edge": "oklch(0.8 0.14 85)",
  "yan-lemon-foreground": "oklch(0.36 0.08 80)",
  "yan-peach": "oklch(0.87 0.09 50)",
  "yan-peach-edge": "oklch(0.72 0.14 45)",
  "yan-peach-foreground": "oklch(0.34 0.09 45)",
  "yan-coral-edge": "oklch(0.6 0.18 22)",

  // Effect colors used by yan-fx (canvas)
  "yan-fx-1": "oklch(0.78 0.17 355)",
  "yan-fx-2": "oklch(0.76 0.14 300)",
  "yan-fx-3": "oklch(0.84 0.13 165)",
  "yan-fx-4": "oklch(0.9 0.15 95)",
  "yan-fx-5": "oklch(0.8 0.11 230)",
  "yan-fx-ink": "oklch(0.62 0.21 355)",
}

/** Yorumoe (夜): plum night sky with glowing candy. */
const dark: Vars = {
  background: "oklch(0.18 0.045 305)",
  foreground: "oklch(0.96 0.02 340)",
  card: "oklch(0.235 0.055 308)",
  "card-foreground": "oklch(0.96 0.02 340)",
  popover: "oklch(0.235 0.055 308)",
  "popover-foreground": "oklch(0.96 0.02 340)",
  primary: "oklch(0.8 0.14 355)",
  "primary-foreground": "oklch(0.26 0.1 355)",
  secondary: "oklch(0.77 0.115 300)",
  "secondary-foreground": "oklch(0.24 0.09 300)",
  muted: "oklch(0.28 0.055 310)",
  "muted-foreground": "oklch(0.78 0.05 330)",
  accent: "oklch(0.32 0.08 330)",
  "accent-foreground": "oklch(0.96 0.02 340)",
  destructive: "oklch(0.74 0.16 22)",
  "destructive-foreground": "oklch(0.25 0.09 22)",
  border: "oklch(0.36 0.07 315)",
  input: "oklch(0.42 0.08 318)",
  ring: "oklch(0.78 0.15 355)",

  "yan-ink": "oklch(0.96 0.02 340)",
  "yan-sakura": "oklch(0.8 0.14 355)",
  "yan-sakura-edge": "oklch(0.56 0.18 355)",
  "yan-lavender": "oklch(0.77 0.115 300)",
  "yan-lavender-edge": "oklch(0.54 0.15 300)",
  "yan-mint": "oklch(0.83 0.11 165)",
  "yan-mint-edge": "oklch(0.6 0.12 165)",
  "yan-mint-foreground": "oklch(0.25 0.07 170)",
  "yan-sky": "oklch(0.8 0.09 230)",
  "yan-sky-edge": "oklch(0.58 0.12 235)",
  "yan-sky-foreground": "oklch(0.25 0.07 240)",
  "yan-lemon": "oklch(0.9 0.12 98)",
  "yan-lemon-edge": "oklch(0.7 0.13 85)",
  "yan-lemon-foreground": "oklch(0.3 0.07 80)",
  "yan-peach": "oklch(0.82 0.1 50)",
  "yan-peach-edge": "oklch(0.62 0.14 45)",
  "yan-peach-foreground": "oklch(0.27 0.08 45)",
  "yan-coral-edge": "oklch(0.54 0.17 22)",

  "yan-fx-1": "oklch(0.8 0.17 355)",
  "yan-fx-2": "oklch(0.78 0.14 300)",
  "yan-fx-3": "oklch(0.86 0.13 165)",
  "yan-fx-4": "oklch(0.92 0.15 95)",
  "yan-fx-5": "oklch(0.82 0.11 230)",
  "yan-fx-ink": "oklch(0.76 0.19 355)",
}

const candies = ["sakura", "lavender", "mint", "sky", "lemon", "peach"]

/** Values for Tailwind's `@theme inline` so tokens become utilities (bg-yan-mint, ...). */
const theme: Vars = {
  "color-yan-ink": "var(--yan-ink)",
  ...Object.fromEntries(
    candies.flatMap((c) => [
      [`color-yan-${c}`, `var(--yan-${c})`],
      [`color-yan-${c}-edge`, `var(--yan-${c}-edge)`],
      ...(c === "sakura" || c === "lavender"
        ? []
        : [[`color-yan-${c}-foreground`, `var(--yan-${c}-foreground)`]]),
    ])
  ),
  "color-yan-coral-edge": "var(--yan-coral-edge)",
}

const c = "var(--yan-c, var(--primary))"
const edge = "var(--yan-edge, var(--yan-sakura-edge))"
const depth = "var(--yan-depth, 5px)"

/** Extra CSS (shadcn registry `css` format): keyframes and utilities. */
const css: Record<string, Record<string, unknown>> = {
  "@keyframes yan-pop": {
    "0%": { scale: "1" },
    "35%": { scale: "0.78" },
    "70%": { scale: "1.16" },
    "100%": { scale: "1" },
  },
  "@keyframes yan-stripes": {
    to: { "background-position": "0 0, 22.63px 0" },
  },
  "@keyframes yan-twinkle": {
    "0%, 100%": { scale: "1", opacity: "1" },
    "50%": { scale: "0.55", opacity: "0.5" },
  },
  "@keyframes yan-pop-in": {
    from: { opacity: "0", scale: "0.6" },
    to: { opacity: "1", scale: "1" },
  },
  "@keyframes yan-pop-out": {
    to: { opacity: "0", scale: "0.85" },
  },
  "@keyframes yan-fade-in": {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  "@keyframes yan-fade-out": {
    to: { opacity: "0" },
  },
  "@keyframes yan-fade-up": {
    from: { opacity: "0", translate: "0 8px" },
    to: { opacity: "1", translate: "0 0" },
  },
  // Smear in from the side, overshoot, squash against the stop, settle.
  "@keyframes yan-toast-in": {
    "0%": { opacity: "0", translate: "120% 0", scale: "1.35 0.8" },
    "45%": { opacity: "1", translate: "-3% 0", scale: "0.92 1.08" },
    "70%": { translate: "1% 0", scale: "1.03 0.97" },
    "100%": { opacity: "1", translate: "0 0", scale: "1 1" },
  },
  // Drop from above and squash on landing. Uses `transform` so it composes
  // with the `translate` that centers a dialog.
  "@keyframes yan-drop-in": {
    "0%": { opacity: "0", transform: "translateY(-70px) scale(0.86, 1.14)" },
    "45%": { opacity: "1", transform: "translateY(0) scale(1.07, 0.9)" },
    "68%": { transform: "translateY(0) scale(0.97, 1.04)" },
    "100%": { opacity: "1", transform: "none" },
  },
  "@keyframes yan-toast-out": {
    to: { opacity: "0", translate: "110% 0" },
  },
  // Gummy-candy surface: a soft top-to-bottom gradient, a glassy highlight
  // across the upper half, a solid "edge" underneath and a tinted glow.
  // Tint it with --yan-c / --yan-edge; --yan-depth sets how tall the edge is.
  "@utility yan-candy": {
    isolation: "isolate",
    "background-image": `linear-gradient(180deg, color-mix(in oklch, ${c} 76%, white) 0%, ${c} 55%, color-mix(in oklch, ${c} 84%, ${edge}) 100%)`,
    // Plain rgb() and var() only: Tailwind emits a fallback rule for oklch()/color-mix()
    // values, and in a utility with a nested rule that fallback lands on ::before.
    "box-shadow": `inset 0 1.5px 0 0 rgb(255 255 255 / 0.8), inset 0 -7px 8px -6px ${edge}, 0 ${depth} 0 0 ${edge}, 0 calc(${depth} * 2.8) calc(${depth} * 3.4) calc(${depth} * -1.9) ${edge}`,
    "text-shadow": "0 1px 0 rgb(255 255 255 / 0.4)",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: "2px 9% auto 9%",
      height: "36%",
      "border-radius": "999px",
      "background-image":
        "linear-gradient(180deg, rgb(255 255 255 / 0.78), rgb(255 255 255 / 0))",
      "z-index": "-1",
      "pointer-events": "none",
    },
  },
  "@utility yan-candy-pressed": {
    "box-shadow": `inset 0 1.5px 0 0 rgb(255 255 255 / 0.6), inset 0 -4px 6px -4px ${edge}, 0 1px 0 0 ${edge}, 0 5px 8px -5px ${edge}`,
  },
  // Candy-cane fill used by Progress.
  "@utility yan-stripes": {
    "background-image":
      "linear-gradient(180deg, oklch(1 0 0 / 0.55), oklch(1 0 0 / 0) 60%), repeating-linear-gradient(-45deg, oklch(1 0 0 / 0) 0 8px, oklch(1 0 0 / 0.32) 8px 16px)",
    "background-size": "100% 100%, 22.63px 100%",
  },
}

export const yanTheme = { light, dark, theme, css }
