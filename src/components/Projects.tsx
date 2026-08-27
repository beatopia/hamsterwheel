import React from 'react';

interface PageProps {
  setPage: () => void;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  cover?: string;
  href?: string;
}

const projects: ProjectItem[] = [
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

function ProjectCard({ project }: { project: ProjectItem }) {
  const [isLoading, setIsLoading] = React.useState(Boolean(project.cover));
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (!project.cover) {
      setIsLoading(false);
      return;
    }

    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [project.cover]);

  return (
    <article className="project-card" role="listitem">
      <div className="project-visual">
        {project.cover ? (
          <>
            {isLoading && (
              <div className="project-skeleton-overlay skeleton-box" aria-hidden="true" />
            )}
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.title}`}
                className="project-visual-link"
              >
                <img
                  ref={imgRef}
                  src={project.cover}
                  alt={`${project.title} cover`}
                  className={`project-image ${isLoading ? 'project-image--loading' : 'project-image--loaded'}`}
                  onLoad={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                  loading="lazy"
                />
              </a>
            ) : (
              <img
                ref={imgRef}
                src={project.cover}
                alt={`${project.title} cover`}
                className={`project-image ${isLoading ? 'project-image--loading' : 'project-image--loaded'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="project-skeleton-placeholder skeleton-box" aria-hidden="true" />
        )}
      </div>
      <div className="project-body">
        <h2 className="project-title about-inter">{project.title}</h2>
        {project.subtitle && <p className="project-subtitle about-inter">{project.subtitle}</p>}
      </div>
    </article>
  );
}

export default function Projects({ setPage }: PageProps) {
  React.useEffect(() => {
    setPage();
  }, [setPage]);

  return (
    <section className="projects-page" aria-labelledby="projects-title">
      <p className="about-kicker">PROJECTS</p>

      <div className="projects-grid" role="list">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}

