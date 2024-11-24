import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Layout/Header';
import LoadingSpinner from '@/components/LoadingSpinner';

// 지도 컴포넌트를 동적으로 import
const MapContainer = dynamic(() => import('@/components/MapHome/MapContainer'), {
  ssr: false, // 서버사이드 렌더링 비활성화
  loading: () => <LoadingSpinner />, // 로딩 상태 처리
});

export default function MapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isGnbVisible, setIsGnbVisible] = useState(true);

  const handleLocalFilterToggle = (isOpen: boolean) => {
    setIsGnbVisible(!isOpen); // 로컬 필터가 열릴 때 GNB 숨김
  };


  useEffect(() => {
    setIsLoading(false); // 로딩 완료
  }, []);

  return (
    <>
      <Header />
        {isLoading ? <LoadingSpinner /> : <MapContainer onLocalFilterToggle={handleLocalFilterToggle} />}
    </>
  );
}
