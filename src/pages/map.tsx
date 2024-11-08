import React from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/PopularSports';

export default function Map() {
  const router = useRouter();

  return (
    <>
      <Header />
      {router.pathname === '/map' && <PopularSports />}
    </>
  );
}
