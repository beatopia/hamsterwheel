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
      id: 'slug-gaming',
      title: 'Slug Gaming Website',
      subtitle: 'React, JavaScript, Node.js, Tailwind CSS, Git, Figma',
      cover: '/media/images/projects/sluggaming/sluggamingcover.jpg',
    },
    { id: 'undoc-1', title: 'Undocumented Project', subtitle: '' },
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
                <img src={p.cover} alt={`${p.title} cover`} className="project-image" loading="lazy" />
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
