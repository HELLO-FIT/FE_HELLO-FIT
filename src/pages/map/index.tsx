import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Layout/Header';
import LoadingSpinner from '@/components/LoadingSpinner';

const MapContainer = dynamic(
  () => import('@/components/MapHome/MapContainer'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

export default function MapPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <Header />
      {isLoading ? <LoadingSpinner /> : <MapContainer />}
    </>
  );
}
