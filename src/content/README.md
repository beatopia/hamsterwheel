# Writing content

Keep the two content types in separate folders:

- Add general blog posts to `blog/`. They appear on `/blog` and use `/blog/:slug`.
- Add notes about a specific project to `project-notes/`. They use `/projects/:slug` and should be linked from that project in `src/data/projects.ts` with a `notes` property.

Both types use the same Markdown frontmatter:

```md
---
title: Example title
date: 2026-09-21
excerpt: A short description for an index or project link.
---
```

Put blog images in `blog/blog-images/` and project-note images in `project-notes/project-note-images/`.
