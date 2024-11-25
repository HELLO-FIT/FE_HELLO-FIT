import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Header from '@/components/Layout/Header';
import LoadingSpinner from '@/components/LoadingSpinner';

// 클라이언트 사이드 전용 컴포넌트 처리
const MapContainer = dynamic(
  () => import('@/components/MapHome/MapContainer'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

export default function MapPage() {
  return (
    <>
      <Head>
        <title>HELLOFIT 지도 홈</title>
        <meta
          name="description"
          content="HELLOFIT 지도에서 다양한 헬스케어 시설과 스포츠 활동 정보를 확인하세요. 위치를 기반으로 사용자 주변의 시설을 찾고, 다양한 헬스케어 옵션을 탐색할 수 있습니다."
        />
        <meta
          name="keywords"
          content="HELLOFIT, 헬스케어, 지도, 시설, 스포츠, 건강, 위치 기반 서비스"
        />
        <meta property="og:title" content="HELLOFIT 지도 홈" />
        <meta
          property="og:description"
          content="HELLOFIT 지도에서 다양한 헬스케어 시설과 스포츠 활동 정보를 확인하세요."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hello-fit.vercel.app/" />
        <meta property="og:image" content="/favicon/favicon.ico" />
      </Head>
      <Header />
      <MapContainer />
    </>
  );
}
