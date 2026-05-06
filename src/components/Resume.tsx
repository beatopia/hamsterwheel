import React from 'react';

interface PageProps {
  setPage: () => void;
}

export default function Resume({ setPage }: PageProps) {
  React.useEffect(() => {
    setPage();
  }, [setPage]);

  return <div>Resume content goes here</div>;
}
