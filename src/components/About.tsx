import React from 'react';

interface PageProps {
  setPage: () => void;
}

export default function About({ setPage }: PageProps) {
  React.useEffect(() => {
    setPage();
  }, [setPage]);

  return <div>About content goes here</div>;
}
