import React from 'react';

interface PageProps {
  setPage: () => void;
}

export default function Projects({ setPage }: PageProps) {
  React.useEffect(() => {
    setPage();
  }, [setPage]);
  const projects = [
    {
      id: 'ow-queue-monitor',
      title: 'OW Queue Monitor',
      subtitle: 'Python, PyQt6, ImageGrab, Pillow, Requests',
      cover: '/media/images/projects/owqueuemonitor.jpg',
      href: 'https://github.com/beatopia/ow-queue-monitor',
    },
    {
      id: 'slug-gaming',
      title: 'Slug Gaming Website',
      subtitle: 'React, JavaScript, Node.js, Tailwind CSS, Git',
      cover: '/media/images/projects/sluggaming/sluggamingcover.jpg',
      href: 'https://github.com/sluggaming/sluggaming.github.io',
    },
    { id: 'undoc-2', title: 'Undocumented Project', subtitle: '' },
    { id: 'undoc-3', title: 'Undocumented Project', subtitle: '' },
    { id: 'undoc-4', title: 'Undocumented Project', subtitle: '' },
    { id: 'undoc-5', title: 'Undocumented Project', subtitle: '' },
  ];

  return (
    <section className="projects-page" aria-labelledby="projects-title">
      <p className="about-kicker">PROJECTS</p>

      <div className="projects-grid" role="list">
        {projects.map((p) => (
          <article key={p.id} className="project-card" role="listitem">
            <div className="project-visual">
              {('cover' in p && p.cover) ? (
                'href' in p && p.href ? (
                  <a href={p.href} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`}>
                    <img src={p.cover} alt={`${p.title} cover`} className="project-image" loading="lazy" />
                  </a>
                ) : (
                  <img src={p.cover} alt={`${p.title} cover`} className="project-image" loading="lazy" />
                )
              ) : null}
            </div>
            <div className="project-body">
              <h2 className="project-title about-inter">{p.title}</h2>
              {p.subtitle && <p className="project-subtitle about-inter">{p.subtitle}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
