export type SkeletonVariant = 'about' | 'projects' | 'resume' | 'blog' | 'generic';

interface ContentSkeletonProps {
  variant?: SkeletonVariant;
}

export default function ContentSkeleton({ variant = 'generic' }: ContentSkeletonProps) {
  return (
    <div
      className="skeleton-container"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading page content..."
    >
      <span className="sr-only">Loading content...</span>

      {variant === 'about' && (
        <div className="about-page skeleton-page">
          <div className="skeleton-box skeleton-kicker" />
          <div className="skeleton-box skeleton-title" style={{ width: '85%', height: '3rem', marginBottom: '25px' }} />

          <div className="about-works about-section skeleton-about-works">
            <div className="skeleton-chip-group">
              <div className="skeleton-box skeleton-text" style={{ width: '120px', height: '1.2rem' }} />
              <div className="skeleton-box skeleton-chip-item" />
              <div className="skeleton-box skeleton-chip-item" />
            </div>
            <div className="skeleton-chip-group" style={{ marginTop: '12px' }}>
              <div className="skeleton-box skeleton-text" style={{ width: '160px', height: '1.2rem' }} />
              <div className="skeleton-box skeleton-chip-item" />
              <div className="skeleton-box skeleton-chip-item" />
              <div className="skeleton-box skeleton-chip-item" />
            </div>
          </div>

          <div className="skeleton-paragraphs">
            <div className="skeleton-box skeleton-text" style={{ width: '100%', height: '1.2rem', marginBottom: '10px' }} />
            <div className="skeleton-box skeleton-text" style={{ width: '92%', height: '1.2rem', marginBottom: '25px' }} />

            <div className="skeleton-box skeleton-text" style={{ width: '98%', height: '1.2rem', marginBottom: '10px' }} />
            <div className="skeleton-box skeleton-text" style={{ width: '95%', height: '1.2rem', marginBottom: '10px' }} />
            <div className="skeleton-box skeleton-text" style={{ width: '80%', height: '1.2rem', marginBottom: '25px' }} />

            <div className="skeleton-box skeleton-text" style={{ width: '96%', height: '1.2rem', marginBottom: '10px' }} />
            <div className="skeleton-box skeleton-text" style={{ width: '70%', height: '1.2rem' }} />
          </div>
        </div>
      )}

      {variant === 'projects' && (
        <div className="projects-page skeleton-page">
          <div className="skeleton-box skeleton-kicker" />
          <div className="projects-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="project-card skeleton-project-card">
                <div className="skeleton-box skeleton-card-image" />
                <div className="project-body">
                  <div className="skeleton-box skeleton-text" style={{ width: '60%', height: '1.2rem', marginBottom: '8px' }} />
                  <div className="skeleton-box skeleton-text" style={{ width: '40%', height: '0.9rem' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === 'resume' && (
        <div className="resume-page skeleton-page">
          <div className="resume-header">
            <div className="skeleton-box skeleton-kicker" style={{ marginBottom: 0 }} />
            <div className="skeleton-box skeleton-text" style={{ width: '90px', height: '1.4rem' }} />
          </div>
          <div className="skeleton-box skeleton-resume-frame" />
        </div>
      )}

      {variant === 'blog' && (
        <div className="blog-page skeleton-page">
          <div className="skeleton-box skeleton-kicker" />
          <div className="skeleton-box skeleton-title" style={{ width: '90%', height: '2.5rem', marginBottom: '20px' }} />
          <div className="skeleton-box skeleton-search" style={{ width: '100%', height: '42px', marginBottom: '25px' }} />

          <div className="blog-grid">
            <div className="blog-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="post skeleton-blog-post">
                  <div className="skeleton-box skeleton-text" style={{ width: '70%', height: '1.4rem', marginBottom: '10px' }} />
                  <div className="skeleton-box skeleton-blog-img" />
                  <div className="skeleton-box skeleton-text" style={{ width: '95%', height: '1rem', marginTop: '12px', marginBottom: '6px' }} />
                  <div className="skeleton-box skeleton-text" style={{ width: '80%', height: '1rem' }} />
                </div>
              ))}
            </div>

            <aside className="blog-sidebar">
              <div className="skeleton-box skeleton-text" style={{ width: '60px', height: '1rem', marginBottom: '12px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton-box skeleton-text" style={{ width: '100%', height: '36px', borderRadius: '6px' }} />
                ))}
              </div>
            </aside>
          </div>
        </div>
      )}

      {variant === 'generic' && (
        <div className="about-page skeleton-page">
          <div className="skeleton-box skeleton-kicker" />
          <div className="skeleton-box skeleton-title" style={{ width: '75%', height: '2.5rem', marginBottom: '24px' }} />
          <div className="skeleton-paragraphs">
            <div className="skeleton-box skeleton-text" style={{ width: '100%', height: '1.2rem', marginBottom: '12px' }} />
            <div className="skeleton-box skeleton-text" style={{ width: '94%', height: '1.2rem', marginBottom: '12px' }} />
            <div className="skeleton-box skeleton-text" style={{ width: '88%', height: '1.2rem', marginBottom: '24px' }} />
            <div className="skeleton-box skeleton-text" style={{ width: '96%', height: '1.2rem', marginBottom: '12px' }} />
            <div className="skeleton-box skeleton-text" style={{ width: '82%', height: '1.2rem' }} />
          </div>
        </div>
      )}
    </div>
  );
}
