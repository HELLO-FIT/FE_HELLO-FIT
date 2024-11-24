import React from 'react';
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
  const OGTitle = '지도 홈 | HELLOFIT';
  const serviceUrl = process.env.NEXT_PUBLIC_SERVICE_URL;
  const OGUrl = `${serviceUrl}/map`;

  return (
    <>
      <Header />
      <MapContainer OGTitle={OGTitle} OGUrl={OGUrl} />
    </>
  );
}
