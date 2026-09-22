# Portfolio Product Specification

## Site model

The site uses separate routes for the homepage, projects, project notes, the blog index, and blog posts. Every route shares one narrow, centered, text-first visual system.

## Primary visitor questions

The site should quickly answer:

- Who is Kai?
- What is he doing now?
- What has he built?
- Where has he worked?
- What kinds of problems does he like?
- What is he like outside work?
- How can someone contact him?

## Primary identity

Kai Luzniak is a Computer Science student at UC Santa Cruz.

Current context:

- Tech4Good Lab
- Slug Gaming

Previous context:

- Boeing Defense, Space & Security
- Northrop Grumman

Featured projects:

- osumapscout
- Overwatch Queue Monitor
- Cata
- future projects as they are added

## Primary action

The homepage contact line provides Kai's email with click-to-copy behavior, visible feedback, and a mail client fallback.

## Blog

The blog remains a separate route. It should share the portfolio's design system without being forced into the homepage flow.

Blog posts live in `src/content/blog`. Project-specific development notes live separately in `src/content/project-notes` and are linked from their corresponding project rather than appearing in the blog index.

## Homepage identity

The homepage is a compact personal essay rather than a portfolio landing page. Kai's name is a modest heading. The homepage artwork appears below the body copy as a restrained signature. Dark mode uses the static cat-bat. Light mode uses the handmade hamster, with `body1` fixed and the six leg frames cycling every 250ms. `body2` remains reserved and hidden.

## No unnecessary repetition

Every section should contribute unique information. When the same fact appears more than once, the repetition must serve a clear visitor need; otherwise consolidate or remove it.

## Persistent implementation requirements

Future redesigns must preserve:

- the original super-dark blue `#000308` dark palette and tan/brown light palette;
- Light / System / Dark theme controls in the upper-right;
- the narrow reading column and compact spacing;
- the HOME / BLOG / PROJECTS navigation;
- the separate project and blog routes;
- the email-copy interaction;
- the restrained below-copy artwork placement and theme-specific artwork;
- responsive behavior;
- accessibility; and
- centralized project data.
