import React from 'react';

interface PageProps {
  setPage: () => void;
}

export default function Home({ setPage }: PageProps) {
  React.useEffect(() => {
    setPage();
  }, [setPage]);

  return <div></div>;
}
