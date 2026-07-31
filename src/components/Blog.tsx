import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface PageProps {
  setPage: () => void;
}

type Post = {
  id: string;
  title: string;
  date: string; // ISO
  image: string;
  excerpt?: string;
  content?: string;
};

const posts: Post[] = [
  {
    id: 'modern-react-patterns',
    title: 'Modern React Patterns',
    date: '2026-05-01',
    image: '/media/images/projects/sluggaming/sluggamingcover.jpg',
    excerpt: 'A short tour through hooks, suspense, and patterns I use every day.',
    content:
      'This is a starter post body. Replace it with your own writing, and the page will render it as paragraphs separated by blank lines.\n\nYou can keep using the excerpt for the card view and put the full post here for the dedicated blog page.',
  },
  {
    id: 'building-sluggaming',
    title: 'Building the Slug Gaming Website',
    date: '2025-11-12',
    image: '/media/images/projects/sluggaming/sluggamingcover.jpg',
    excerpt: 'How I put together the Slug Gaming site and the stack choices behind it.',
    content:
      'This is the second starter post body. It should be replaced with the real article text when you are ready.\n\nThe important part is that the slug becomes the URL, so the page can live at /blog/building-sluggaming.',
  },
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
    return sorted.find((post) => post.id === slug || slugify(post.title) === slug);
  }, [slug, sorted]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter((p) => (p.title + ' ' + (p.excerpt || '') + ' ' + (p.content || '')).toLowerCase().includes(q));
  }, [query, sorted]);

  const openPost = (post: Post) => {
    navigate(`/blog/${slugify(post.title)}`);
  };

  const closePost = () => {
    navigate('/blog');
  };

  if (currentPost) {
    const bodyParagraphs = (currentPost.content || currentPost.excerpt || '')
      .split(/\n\n+/)
      .filter(Boolean);

    return (
      <section className="about-page blog-page" aria-labelledby="blog-title">
        <p className="about-kicker">BLOG</p>
        <div className="blog-detail-header about-section">
          <button type="button" className="blog-back about-inter" onClick={closePost}>
            Back to all posts
          </button>
          <h1 id="blog-title" className="about-title about-inter">{currentPost.title}</h1>
          <p className="about-label post-date">{new Date(currentPost.date).toLocaleDateString()}</p>
        </div>

        <article className="blog-detail">
          <img className="post-image blog-detail-image" src={currentPost.image} alt={currentPost.title} />
          {bodyParagraphs.map((paragraph, index) => (
            <p key={index} className="about-copy blog-detail-paragraph">
              {paragraph}
            </p>
          ))}
        </article>
      </section>
    );
  }

  return (
    <section className="about-page blog-page" aria-labelledby="blog-title">
      <p className="about-kicker">BLOG</p>
      <h1 id="blog-title" className="about-title about-section about-inter">I like writing about whatever excites me! No specific topic.</h1>

      <div className="blog-controls about-section">
        <label style={{ display: 'block', marginBottom: 8 }} htmlFor="blog-search">Search posts</label>
        <input
          id="blog-search"
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
              key={post.id}
              className="post"
              aria-labelledby={`${post.id}-title`}
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
                  <h2 id={`${post.id}-title`} className="project-title about-inter">{post.title}</h2>
                  <p className="about-label post-date">{new Date(post.date).toLocaleDateString()}</p>
                </div>
              </div>
              <img className="post-image" src={post.image} alt={post.title} loading="lazy" />
              {post.excerpt && <p className="about-copy post-excerpt">{post.excerpt}</p>}
            </article>
          ))}
        </main>

        <aside className="blog-sidebar" aria-label="Quick navigation">
          <div className="blog-sidebar-inner">
            <div className="about-label" style={{ marginBottom: 10 }}>Jump to</div>
            <div className="blog-toc" role="navigation">
              {sorted.map((p) => (
                <button key={p.id} className="blog-toc-item about-inter" onClick={() => openPost(p)}>
                  <div className="blog-toc-title">{p.title}</div>
                  <div className="blog-toc-date">{new Date(p.date).toLocaleDateString()}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
