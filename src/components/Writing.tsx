import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

type Post = { slug: string; title: string; date: string; excerpt: string; content: string };
type ContentKind = 'blog' | 'project-note';
type MarkdownSection = { title: string; content: string };

const blogFiles = import.meta.glob('../content/blog/*.md', { eager: true, import: 'default', query: '?raw' }) as Record<string, string>;
const projectNoteFiles = import.meta.glob('../content/project-notes/*.md', { eager: true, import: 'default', query: '?raw' }) as Record<string, string>;
const contentImages = import.meta.glob('../content/{blog,project-notes}/{blog-images,project-note-images}/*', { eager: true, import: 'default' }) as Record<string, string>;

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { values: {} as Record<string, string>, content: raw.trim() };
  const values: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (pair) values[pair[1].toLowerCase()] = pair[2].trim().replace(/^['"](.*)['"]$/, '$1');
  }
  return { values, content: raw.slice(match[0].length).trim() };
}

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const stripMarkdown = (value: string) => value.replace(/!\[[^\]]*\]\([^\)]+\)/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[`*_#>-]/g, '').replace(/\s+/g, ' ').trim();

function resolveImage(src?: string) {
  if (!src) return '';
  const clean = src.split('#')[0].replace(/^src\//, '').replace(/^\.\//, '');
  if (/^(https?:|data:|\/)/.test(clean)) return clean;
  const fileName = clean.split('/').pop();
  return Object.entries(contentImages).find(([path]) => path.endsWith(`/${fileName}`))?.[1] || src;
}

function buildPosts(files: Record<string, string>): Post[] {
  return Object.entries(files).map(([path, raw]) => {
  const { values, content } = parseFrontmatter(raw);
  const fileName = path.split('/').pop()?.replace(/\.md$/, '') || 'post';
  return {
    slug: slugify(values.slug || fileName),
    title: values.title || fileName,
    date: values.date || '',
    excerpt: values.excerpt || stripMarkdown(content).slice(0, 180),
    content,
  };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

const blogPosts = buildPosts(blogFiles);
const projectNotes = buildPosts(projectNoteFiles);

function displayDate(value: string) {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : value;
}

function splitMarkdownSections(content: string) {
  const matches = [...content.matchAll(/^##\s+(.+)$/gm)];
  if (matches.length === 0) return { intro: content, sections: [] as MarkdownSection[] };

  const intro = content.slice(0, matches[0].index).trim();
  const sections = matches.map((match, index) => {
    const contentStart = (match.index ?? 0) + match[0].length;
    const contentEnd = matches[index + 1]?.index ?? content.length;
    return { title: match[1].trim(), content: content.slice(contentStart, contentEnd).trim() };
  });

  return { intro, sections };
}

function MarkdownImage({ src, alt, size }: { src?: string; alt?: string; size: string }) {
  const [loaded, setLoaded] = useState(false);
  const resolvedSrc = resolveImage(src);
  const isVideoPreview = src?.includes('img.youtube.com/vi/');
  const sizeClass = size ? `image-${size}` : undefined;

  if (!isVideoPreview) {
    return <img className={sizeClass} src={resolvedSrc} alt={alt || ''} loading="lazy" draggable={false} />;
  }

  return (
    <span className={`video-preview-shell${loaded ? ' is-loaded' : ''}`}>
      <img
        className={`video-preview-image${sizeClass ? ` ${sizeClass}` : ''}`}
        src={resolvedSrc}
        alt={alt || ''}
        loading="eager"
        fetchPriority="high"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </span>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown components={{
      img: ({ src, alt }) => {
        const size = src?.match(/#(small|med|medium|large)$/i)?.[1]?.toLowerCase() || '';
        return <MarkdownImage src={src} alt={alt} size={size} />;
      },
      a: ({ href, children }) => {
        const external = href?.startsWith('http');
        return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{children}</a>;
      },
    }}>{content}</ReactMarkdown>
  );
}

export default function Writing({ kind }: { kind: ContentKind }) {
  const { slug } = useParams();
  const posts = kind === 'blog' ? blogPosts : projectNotes;
  const post = slug ? posts.find((item) => item.slug === slug) : undefined;
  const indexPath = kind === 'blog' ? '/blog' : '/projects';
  const indexLabel = kind === 'blog' ? 'Blog' : 'Projects';

  if (slug && !post) return <main><h1>{kind === 'blog' ? 'Post' : 'Project notes'} not found</h1><p><Link to={indexPath}>Back to {indexLabel.toLowerCase()}</Link></p></main>;

  if (post) {
    const { intro, sections } = kind === 'project-note'
      ? splitMarkdownSections(post.content)
      : { intro: post.content, sections: [] as MarkdownSection[] };

    return (
      <main>
        <article className="prose blog-post" aria-labelledby="post-title">
          <p className="back-link"><Link to={indexPath}>← {indexLabel}</Link></p>
          <h1 id="post-title">{post.title}</h1>
          <time className="meta" dateTime={post.date}>{displayDate(post.date)}</time>
          <div className="markdown-body">
            {intro && <MarkdownContent content={intro} />}
            {sections.map((section) => (
              <details className="note-section" open key={section.title}>
                <summary>{section.title}</summary>
                <div className="note-section-content">
                  <MarkdownContent content={section.content} />
                </div>
              </details>
            ))}
          </div>
        </article>
      </main>
    );
  }

  return (
    <main aria-labelledby="blog-title">
      <h1 id="blog-title">Blog</h1>
      <div className="entry-list blog-list">
        {posts.length === 0 && <p className="meta">No posts yet.</p>}
        {posts.map((item) => (
          <article className="entry" key={item.slug}>
            <h2><Link to={`/blog/${item.slug}`}>{item.title}</Link></h2>
            <time className="meta" dateTime={item.date}>{displayDate(item.date)}</time>
            <p>{item.excerpt}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
