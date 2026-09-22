import { Link } from 'react-router-dom';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <main aria-labelledby="projects-title">
      <h1 id="projects-title">Projects</h1>
      <div className="entry-list">
        {projects.map((project) => (
          <article className="entry" key={project.name}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p className="meta">{project.technologies.join(' · ')}</p>
            <p className="entry-links">
              <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>
              {project.notes && <Link to={project.notes}>Project notes</Link>}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
