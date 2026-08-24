# luzniak.dev

This is my personal website to host my resume, projects, blog posts, etc.

Built with Astro and React, hosted on Cloudflare.

## Blog workflow (minimal effort)

Blog posts are loaded from markdown files in `src/content/blog`.

To publish a new post:

1. Create a new file in `src/content/blog`, for example `my-new-post.md`.
2. Optional: add frontmatter at the top if you want to customize metadata:

```md
---
title: My New Post
date: 2026-08-24
image: /media/images/projects/sluggaming/sluggamingcover.jpg
excerpt: One short sentence shown on the blog card.
---
```

3. Write the post body in markdown.

The filename becomes the URL slug automatically (`my-new-post.md` -> `/blog/my-new-post`).
You can override this with an optional `slug: custom-slug` in frontmatter.

Defaults if frontmatter is omitted:

- `title`: first `# Heading` in the markdown, otherwise from the filename
- `date`: today's date
- `image`: `/media/images/projects/sluggaming/sluggamingcover.jpg`
- `excerpt`: first ~180 chars of the post body
