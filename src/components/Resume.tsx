import React from 'react';

interface PageProps {
  setPage: () => void;
}

export default function Resume({ setPage }: PageProps) {
  React.useEffect(() => {
    setPage();
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
        <iframe
          src="/media/images/Kai_Luzniak_Resume.pdf"
          title="Kai Luzniak Resume PDF"
          className="resume-frame"
        />
      </div>
    </section>
  );
}
