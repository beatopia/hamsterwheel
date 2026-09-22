# Current Design State

This document describes the approved minimal implementation.

## Visual system

- Dark mode uses the original super-dark blue `#000308` background with light text.
- Light mode uses a tan background with brown text.
- A compact Light / System / Dark selector appears at the upper-right and follows the operating system when System is selected. A permanent ASCII-style `[toggle effects]` annotation centered beneath it toggles decorative site effects: the dark-mode cellular automaton, light-mode Voronoi background, and light-mode hamster animation.
- The site uses one narrow, centered reading column and a plain sans-serif typeface.
- Navigation is the compact inline sequence HOME / BLOG / PROJECTS.
- There are no cards, grids, gradients, decorative backgrounds, or unrelated accent colors.

## Homepage

The homepage is a personal, text-first introduction. Kai's name is a modest heading, followed by the approved biography and contact line. The signature artwork sits close below the copy at the column edge. Dark mode shows the static cat-bat and a faint, uniformly visible viewport-sized cellular automaton. Left-clicking or left-dragging adds live cells; right-clicking or right-dragging removes them without blocking normal page controls. Light mode shows a viewport-sized Voronoi line texture that rests for eight seconds, smoothly morphs toward nearby seed targets over three seconds, then rests again. Light mode also shows the animated layered hamster. The hamster uses `body1` above leg frames 1–6 so hidden leg portions cannot show through the body; the frames cycle every 250ms, while `body2` remains hidden. Hovering or focusing the artwork reveals a short ASCII-arrow credit appropriate to the active artwork.

## Projects

`/projects` uses a simple vertical list. Each entry contains a title, short description, muted technology line, and text links. Project-specific notes use `/projects/:slug` and live in `src/content/project-notes`. Their level-two Markdown sections render as independently collapsible native disclosure sections, open by default. Project screenshots remain preserved as assets but are not displayed without a content need.

## Blog

`/blog` lists only files from `src/content/blog` using title, date, and description. `/blog/:slug` renders those Markdown posts in the same reading column. Project notes are intentionally excluded. There is no search box, sidebar, thumbnail index, or card treatment.

## Routes

- `/`
- `/projects`
- `/projects/:slug`
- `/blog`
- `/blog/:slug`

## Acceptance criteria

- Do not widen the reading column or turn the homepage into a hero.
- Preserve the original `#000308` dark palette and the approved tan/brown light palette.
- Keep paragraph rhythm compact and readable.
- Keep the theme-specific artwork secondary to the writing.
- Preserve blog content, project data, resume, screenshots, handmade art, and favicon assets.
- Maintain keyboard focus states, semantic navigation, responsive scaling, and no horizontal overflow.
