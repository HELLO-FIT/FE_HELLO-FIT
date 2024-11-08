import React from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/PopularSports';
import LargeMap from '@/components/CourseDetails/LargeMap';

export default function Map() {
  const router = useRouter();

  return (
    <>
      <Header />
      <LargeMap address={''} />
      {router.pathname === '/map' && <PopularSports />}
    </>
  );
}
