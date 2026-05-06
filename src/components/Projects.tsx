import React from 'react';

interface PageProps {
  setPage: () => void;
}

export default function Projects({ setPage }: PageProps) {
  React.useEffect(() => {
    setPage();
  }, [setPage]);

  return <div>Projects content goes here</div>;
}
