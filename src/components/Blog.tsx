import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

interface PageProps {
  setPage: () => void;
}

type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  image: string;
  excerpt: string;
  content: string;
};

type CollapsibleSection = {
  title: string;
  content: string;
};

const DEFAULT_POST_IMAGE = '/media/images/projects/sluggaming/sluggamingcover.jpg';
const postFiles = import.meta.glob('../content/blog/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;
const blogImageFiles = import.meta.glob('../content/blog/blog-images/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function resolveBlogImagePath(image?: string) {
  if (!image) return DEFAULT_POST_IMAGE;

  const normalized = image.trim().replace(/\\/g, '/');
  if (!normalized) return DEFAULT_POST_IMAGE;

  if (
    normalized.startsWith('/')
    || normalized.startsWith('http://')
    || normalized.startsWith('https://')
    || normalized.startsWith('data:')
    || normalized.startsWith('blob:')
  ) {
    return normalized;
  }

  const withoutSrcPrefix = normalized.replace(/^src\//, '');
  const candidates = [
    normalized,
    `../${withoutSrcPrefix}`,
    `../content/blog/${normalized.replace(/^\.\//, '')}`,
  ];

  for (const candidate of candidates) {
    if (blogImageFiles[candidate]) {
      return blogImageFiles[candidate];
    }
  }

  return DEFAULT_POST_IMAGE;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { frontmatter: {} as Record<string, string>, content: raw.trim() };
  }

  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    const key = pair[1].trim().toLowerCase();
    const value = pair[2].trim().replace(/^['\"](.*)['\"]$/, '$1');
    frontmatter[key] = value;
  }

  return {
    frontmatter,
    content: raw.slice(match[0].length).trim(),
  };
}

function toTitleFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function stripMarkdown(input: string) {
  return input
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .trim();
}

function titleFromContent(content: string) {
  const heading = content.match(/^#\s+(.+)$/m);
  return heading?.[1]?.trim();
}

function splitContentByH2Sections(content: string) {
  const lines = content.split(/\r?\n/);
  const introLines: string[] = [];
  const sections: CollapsibleSection[] = [];
  let currentSection: { title: string; lines: string[] } | undefined;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)\s*$/);
    if (headingMatch) {
      if (currentSection) {
        sections.push({
          title: currentSection.title,
          content: currentSection.lines.join('\n').trim(),
        });
      }

      currentSection = {
        title: headingMatch[1].trim(),
        lines: [],
      };
      continue;
    }

    if (currentSection) {
      currentSection.lines.push(line);
    } else {
      introLines.push(line);
    }
  }

  if (currentSection) {
    sections.push({
      title: currentSection.title,
      content: currentSection.lines.join('\n').trim(),
    });
  }

  return {
    intro: introLines.join('\n').trim(),
    sections,
  };
}

function buildPostsFromMarkdown(): Post[] {
  const today = new Date().toISOString().slice(0, 10);

  return Object.entries(postFiles).map(([path, raw]) => {
    const { frontmatter, content } = parseFrontmatter(raw);
    const fileName = path.split('/').pop()?.replace(/\.md$/, '') || 'post';
    const slug = slugify(frontmatter.slug || fileName);
    const cleanedContent = stripMarkdown(content);
    const excerpt = frontmatter.excerpt || cleanedContent.split(/\n+/).join(' ').trim().slice(0, 180);

    return {
      slug,
      title: frontmatter.title || titleFromContent(content) || toTitleFromSlug(slug),
      date: frontmatter.date || today,
      image: resolveBlogImagePath(frontmatter.image),
      excerpt,
      content,
    };
  });
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString();
}

const posts = buildPostsFromMarkdown();

export default function Blog({ setPage }: PageProps) {
  const navigate = useNavigate();
  const { slug } = useParams();

  React.useEffect(() => {
    setPage();
  }, [setPage]);

  const [query, setQuery] = React.useState('');

  // Sort posts newest first by date (ISO strings compare correctly)
  const sorted = React.useMemo(() => [...posts].sort((a, b) => (b.date.localeCompare(a.date))), [posts]);

  const currentPost = React.useMemo(() => {
    if (!slug) return undefined;
    return sorted.find((post) => post.slug === slug);
  }, [slug, sorted]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter((p) => (p.title + ' ' + p.excerpt + ' ' + p.content).toLowerCase().includes(q));
  }, [query, sorted]);

  const openPost = (post: Post) => {
    navigate(`/blog/${post.slug}`);
  };

  const closePost = () => {
    navigate('/blog');
  };

  if (currentPost) {
    const postBody = currentPost.content || currentPost.excerpt;
    const { intro, sections } = splitContentByH2Sections(postBody);
    const useCollapsibleSections = sections.length > 0;

    const markdownComponents = {
      p: ({ children }: { children?: React.ReactNode }) => <p className="about-copy blog-detail-paragraph">{children}</p>,
      h1: ({ children }: { children?: React.ReactNode }) => <h1 className="blog-md-h1 about-inter">{children}</h1>,
      h2: ({ children }: { children?: React.ReactNode }) => <h2 className="blog-md-h2 about-inter">{children}</h2>,
      h3: ({ children }: { children?: React.ReactNode }) => <h3 className="blog-md-h3 about-inter">{children}</h3>,
      ul: ({ children }: { children?: React.ReactNode }) => <ul className="about-copy blog-list-markdown">{children}</ul>,
      ol: ({ children }: { children?: React.ReactNode }) => <ol className="about-copy blog-list-markdown">{children}</ol>,
      img: ({ src, alt }: { src?: string; alt?: string }) => (
        <img
          className="post-image blog-detail-image"
          src={resolveBlogImagePath(src)}
          alt={alt || 'Blog image'}
          loading="lazy"
        />
      ),
      a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
        <a href={href} target="_blank" rel="noreferrer" className="blog-inline-link">
          {children}
        </a>
      ),
    };

    return (
      <section className="about-page blog-page" aria-labelledby="blog-title">
        <div className="blog-detail-header about-section">
          <div className="blog-header-top">
            <p className="about-kicker">BLOG</p>
            <button type="button" className="blog-back about-inter" onClick={closePost}>
              Back to all posts
            </button>
          </div>
          <div className="blog-title-row">
            <h1 id="blog-title" className="about-title about-inter">{currentPost.title}</h1>
            <p className="about-label post-date">{formatDate(currentPost.date)}</p>
          </div>
        </div>

        <article className="blog-detail">
          <div className="blog-markdown">
            {!useCollapsibleSections && (
              <ReactMarkdown components={markdownComponents}>{postBody}</ReactMarkdown>
            )}

            {useCollapsibleSections && (
              <>
                {intro && <ReactMarkdown components={markdownComponents}>{intro}</ReactMarkdown>}

                <div className="blog-collapsible-group">
                  {sections.map((section, index) => (
                    <details key={`${currentPost.slug}-${section.title}-${index}`} className="blog-collapsible" open>
                      <summary className="blog-collapsible-summary about-inter">
                        <span className="blog-collapsible-title">{section.title}</span>
                        <span className="blog-collapsible-arrow" aria-hidden="true">
                          <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </span>
                      </summary>
                      <div className="blog-collapsible-content">
                        {section.content && <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>}
                      </div>
                    </details>
                  ))}
                </div>
              </>
            )}
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="about-page blog-page" aria-labelledby="blog-title">
      <p className="about-kicker">BLOG</p>
      <h1 id="blog-title" className="about-title about-inter blog-home-title">Ever since I was 5, I dreamed of optimizing distributed systems at scale.</h1>

      <div className="blog-controls about-section">
        <input
          id="blog-search"
          aria-label="Search posts"
          className="blog-search about-inter"
          placeholder="Search by title or content"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="blog-grid">
        <main className="blog-list">
          {filtered.length === 0 && <p className="about-copy">No posts match your search.</p>}
          {filtered.map((post) => (
            <article
              key={post.slug}
              className="post"
              aria-labelledby={`${post.slug}-title`}
              tabIndex={0}
              role="link"
              onClick={() => openPost(post)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openPost(post);
                }
              }}
            >
              <div className="post-header-row">
                <div className="post-header-copy">
                  <h2 id={`${post.slug}-title`} className="project-title about-inter">{post.title}</h2>
                  <p className="about-label post-date">{formatDate(post.date)}</p>
                </div>
              </div>
              <img className="post-image" src={post.image} alt={post.title} loading="lazy" />
              <p className="about-copy post-excerpt">{post.excerpt}</p>
            </article>
          ))}
        </main>

        <aside className="blog-sidebar" aria-label="Quick navigation">
          <div className="blog-sidebar-inner">
            <div className="about-label" style={{ marginBottom: 10 }}>Jump to</div>
            <div className="blog-toc" role="navigation">
              {sorted.map((p) => (
                <button key={p.slug} className="blog-toc-item about-inter" onClick={() => openPost(p)}>
                  <div className="blog-toc-title">{p.title}</div>
                  <div className="blog-toc-date">{formatDate(p.date)}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
