# yan やん

Moe kawaii components you copy into your app. Squishy, sparkly, accessible.
Built on **Radix + Tailwind v4**, installed with the **shadcn CLI**.

```bash
npx shadcn@latest add https://yan.moe/r/button.json
```

This repo is a single Next.js app that is both the documentation site and the
registry: `shadcn build` writes the installable JSON into `public/r/`, so
deploying the site publishes the registry.

Components so far: **Avatar, Badge, Button, Checkbox, Dialog, Input, Progress,
Select, Slider, Switch, Tabs, Toast, Tooltip**. The interactive ones take an
`intensity` prop (`"kawaii" | "subtle" | "off"`) and draw their particles
through `yan-fx`.

The site itself also uses `three` (the pokeable 3D mochi in the hero) and
`motion` (scroll reveals, tilt cards). Those are docs-site dependencies only;
nothing in `registry/` imports them.

## Layout

```
yan/
├─ app/                      landing page + docs (MDX pages under app/docs)
├─ components/               site UI (header, footer, mascot, docs widgets)
│  └─ landing/               landing page sections + the three.js hero scene
├─ registry/
│  ├─ yan/ui/                component source (what users receive)
│  ├─ yan/lib/               yan-fx (effects layer), utils
│  ├─ yan/examples/          demos used in the docs (also published)
│  ├─ theme.ts               design tokens: single source of truth
│  ├─ index.ts               registry items → registry.json
│  └─ examples.tsx           name → example map for <ComponentPreview />
├─ scripts/build-registry.mts   generates registry.json + styles/yan-theme.css
├─ lib/site.ts               site name, URL, GitHub link
└─ public/r/                 built registry JSON (generated)
```

Registry source imports use the paths users will have (`@/components/ui/button`,
`@/lib/yan-fx`). `tsconfig.json` maps those to `registry/`, so the file that's
published is exactly the file the docs render.

## Develop

```bash
yarn install
yarn dev          # regenerates theme, runs the site on http://localhost:3000
yarn build        # registry:build (registry.json → public/r) + next build
yarn start        # serve the production build
yarn typecheck
yarn lint
```

Registry cross-references (`button` → `yan-fx`, `yan-theme`) and the install
commands in the docs point at `https://yan.moe`. To test installs against a
local server instead:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000 yarn build
```

## Adding a component

1. Write `registry/yan/ui/<name>.tsx` (Radix primitive + `yan-fx` + an `intensity` prop).
2. Add demos in `registry/yan/examples/` and list them in `registry/examples.tsx`.
3. Register the item (and its examples) in `registry/index.ts`.
4. Write `app/docs/components/<name>/page.mdx` and add it to `components/docs/docs-sidebar.tsx`.
5. `yarn build`.

## License

MIT
