<div align="center">

<a href="https://yan.moe"><img src=".github/banner.svg" alt="yan やん: kawaii React components" width="880" /></a>

### Kawaii React components that squish, sparkle and go ぷにっ

Built on Radix and Tailwind, added to your app with the shadcn CLI.

[![Docs](https://img.shields.io/badge/docs-yan.moe-ff9cc8?style=for-the-badge&labelColor=5a1238)](https://yan.moe/docs)
[![Radix](https://img.shields.io/badge/built_on-Radix-cdb4f5?style=for-the-badge&labelColor=3a2068)](https://www.radix-ui.com)
[![Tailwind v4](https://img.shields.io/badge/styled_with-Tailwind_v4-a8ecc9?style=for-the-badge&labelColor=14503a)](https://tailwindcss.com)
[![MIT](https://img.shields.io/badge/license-MIT-fff1a8?style=for-the-badge&labelColor=6b4a12)](LICENSE)

**[Docs](https://yan.moe/docs)** ・ **[Components](https://yan.moe/docs/components/button)** ・ **[Theming](https://yan.moe/docs/theming)**

</div>

## ✿ What is it

Yan gives buttons, switches, dialogs and friends candy surfaces, a mochi squish and little bursts of sparkles and hearts. The code lands
in your project, so it is yours to change.

Every interactive component takes `intensity="kawaii" | "subtle" | "off"`, and all motion respects `prefers-reduced-motion`.

## ♡ Install

```bash
npx shadcn@latest add https://yan.moe/r/button.json
```

```tsx
import { Button } from "@/components/ui/button";

export function Hello() {
  return <Button sfx="やった！">Save</Button>;
}
```

New to shadcn? Start with the [installation guide](https://yan.moe/docs/installation).

## ★ Components

[Avatar](https://yan.moe/docs/components/avatar) ・
[Badge](https://yan.moe/docs/components/badge) ・
[Button](https://yan.moe/docs/components/button) ・
[Checkbox](https://yan.moe/docs/components/checkbox) ・
[Dialog](https://yan.moe/docs/components/dialog) ・
[Input](https://yan.moe/docs/components/input) ・
[Progress](https://yan.moe/docs/components/progress) ・
[Select](https://yan.moe/docs/components/select) ・
[Slider](https://yan.moe/docs/components/slider) ・
[Switch](https://yan.moe/docs/components/switch) ・
[Tabs](https://yan.moe/docs/components/tabs) ・
[Toast](https://yan.moe/docs/components/toast) ・
[Tooltip](https://yan.moe/docs/components/tooltip)

## ✿ Develop

This repo is one Next.js app: the docs site and the registry it serves from `/r`.

```bash
yarn install
yarn dev      # http://localhost:3000
yarn build    # builds the registry, then the site
```

To test installs against a local server, build with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

<div align="center">

MIT ・ made with ♡ and too much sugar

</div>
