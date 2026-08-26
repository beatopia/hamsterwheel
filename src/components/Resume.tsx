import React from 'react';

interface PageProps {
  setPage: () => void;
}

export default function Resume({ setPage }: PageProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setPage();
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [setPage]);

  return (
    <section className="resume-page" aria-labelledby="resume-title">
      <div className="resume-header">
        <p className="about-kicker">Resume</p>
        <a className="resume-download about-inter" href="/media/images/Kai_Luzniak_Resume.pdf" target="_blank" rel="noreferrer">
          Open PDF
        </a>
      </div>

      <div className="resume-frame-wrap">
        {isLoading && (
          <div className="resume-skeleton-overlay" aria-hidden="true">
            <div className="skeleton-box" style={{ width: '40%', height: '26px', margin: '0 auto 10px' }} />
            <div className="skeleton-box" style={{ width: '60%', height: '14px', margin: '0 auto 28px' }} />

            <div className="skeleton-box" style={{ width: '30%', height: '18px', marginBottom: '10px' }} />
            <div className="skeleton-box" style={{ width: '100%', height: '13px', marginBottom: '8px' }} />
            <div className="skeleton-box" style={{ width: '92%', height: '13px', marginBottom: '8px' }} />
            <div className="skeleton-box" style={{ width: '85%', height: '13px', marginBottom: '24px' }} />

            <div className="skeleton-box" style={{ width: '35%', height: '18px', marginBottom: '10px' }} />
            <div className="skeleton-box" style={{ width: '100%', height: '13px', marginBottom: '8px' }} />
            <div className="skeleton-box" style={{ width: '95%', height: '13px', marginBottom: '8px' }} />
            <div className="skeleton-box" style={{ width: '88%', height: '13px', marginBottom: '24px' }} />

            <div className="skeleton-box" style={{ width: '25%', height: '18px', marginBottom: '10px' }} />
            <div className="skeleton-box" style={{ width: '98%', height: '13px', marginBottom: '8px' }} />
            <div className="skeleton-box" style={{ width: '90%', height: '13px' }} />
          </div>
        )}
        <iframe
          src="/media/images/Kai_Luzniak_Resume.pdf"
          title="Kai Luzniak Resume PDF"
          className={`resume-frame ${isLoading ? 'resume-frame--loading' : 'resume-frame--loaded'}`}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </section>
  );
}

