import React from 'react';

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

export default function Blog({ setPage }: PageProps) {
  React.useEffect(() => {
    setPage();
  }, [setPage]);

  const [query, setQuery] = React.useState('');

  // Example posts — add new posts at the top (newest first)
  const posts: Post[] = [
    {
      id: '2026-05-01-modern-react-patterns',
      title: 'Modern React Patterns',
      date: '2026-05-01',
      image: '/media/images/projects/sluggaming/sluggamingcover.jpg',
      excerpt: 'A short tour through hooks, suspense, and patterns I use every day.',
      content: 'Full post content goes here...',
    },
    {
      id: '2025-11-12-building-sluggaming',
      title: 'Building the Slug Gaming Website',
      date: '2025-11-12',
      image: '/media/images/projects/sluggaming/sluggamingcover.jpg',
      excerpt: 'How I put together the Slug Gaming site and the stack choices behind it.',
      content: 'Full post content goes here...'
    },
  ];

  // Sort posts newest first by date (ISO strings compare correctly)
  const sorted = React.useMemo(() => [...posts].sort((a, b) => (b.date.localeCompare(a.date))), [posts]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter((p) => (p.title + ' ' + (p.excerpt || '') + ' ' + (p.content || '')).toLowerCase().includes(q));
  }, [query, sorted]);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
              id={post.id}
              className="post"
              aria-labelledby={`${post.id}-title`}
              tabIndex={0}
              role="link"
              onClick={() => handleNavClick(post.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavClick(post.id);
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
                <button key={p.id} className="blog-toc-item about-inter" onClick={() => handleNavClick(p.id)}>
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
