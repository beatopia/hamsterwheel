import React from 'react';

interface PageProps {
  setPage: () => void;
}

export default function Blog({ setPage }: PageProps) {
  React.useEffect(() => {
    setPage();
  }, [setPage]);

  return <div>Blog content goes here</div>;
}
