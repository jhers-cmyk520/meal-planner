# What Should I Cook? — Meal Planner

A small Vite + React app that helps decide what to cook by weighing:

- **Mood** — what you feel like eating (comforting, light, hearty, spicy, quick, special)
- **Time** — how long you have, start to plate
- **Sides** — which side dishes pair well and still fit the time budget
- **Nutrition** — dietary tags plus min-protein / max-calorie targets for the whole plate

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the build (service worker active here)
```

`predev` / `prebuild` regenerate the PWA icons automatically; run `npm run icons` to do it by hand.

## Structure

```
src/
  data/recipes.js        Recipes, sides, mood + diet vocab — expand this
  lib/recommend.js        Pure ranking logic (no React), easy to test
  hooks/useMealPlanner.js Form state + derived results
  components/
    MoodPicker.jsx
    TimeSelector.jsx
    NutritionFilters.jsx
    RecipeList.jsx
    RecipeCard.jsx
  registerSW.js           Registers the service worker in production
scripts/generate-icons.mjs Dependency-free PNG icon generator
public/
  manifest.webmanifest
  sw.js                    Cache-first service worker with offline shell
```

## Adding a recipe

Append an object to `RECIPES` in `src/data/recipes.js`. Match the existing shape:
`mood`, `minutes`, `effort`, `diet`, `nutrition` (per serving), and `pairsWith`
(ids from `SIDES`). Add new sides to `SIDES` the same way.

## Install to an iPhone home screen

Serve the production build over HTTPS (or `npm run preview` on localhost), open in
Safari, then **Share → Add to Home Screen**. The manifest + `apple-touch-icon.png`
give it a name and icon; the service worker lets it open offline.
