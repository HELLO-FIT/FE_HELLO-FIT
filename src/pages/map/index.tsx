import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/MapHome/PopularSports';
import Indicator from '@/components/MapHome/Indicator';
import FacilityInfo from '@/components/MapHome/FacilityInfo';
import facilityData from './mockData';

declare global {
  interface Window {
    kakao: any;
  }
}

interface Facility {
  id: number;
  name: string;
  item_nm: string;
  location: string;
  address: string;
}

interface KakaoMapResult {
  y: string;
  x: string;
}

export default function Map() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  useEffect(() => {
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;

    document.head.appendChild(mapScript);

    const initializeMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map') as HTMLElement;
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        // 시설 위치에 마커 추가
        facilityData.forEach((facility) => {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(facility.address, (result: KakaoMapResult[], status: string) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(parseFloat(result[0].y), parseFloat(result[0].x));
              const markerImage = new window.kakao.maps.MarkerImage(
                '/image/marker.svg',
                new window.kakao.maps.Size(40, 40),
                { offset: new window.kakao.maps.Point(20, 40) }
              );

              const marker = new window.kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage,
              });

              // 마커 클릭 시 선택한 마커의 이미지 변경 및 시설 정보 표시
              window.kakao.maps.event.addListener(marker, 'click', () => {
                marker.setImage(
                  new window.kakao.maps.MarkerImage(
                    '/image/address-marker-normal.svg',
                    new window.kakao.maps.Size(40, 40),
                    { offset: new window.kakao.maps.Point(20, 40) }
                  )
                );
                setSelectedFacility(facility); // 선택한 시설 정보 설정
              });
            } else {
              console.error('주소 검색 실패:', status);
            }
          });
        });

        // 사용자 현재 위치 마커 표시
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = new window.kakao.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              );
              const userMarkerImage = new window.kakao.maps.MarkerImage(
                '/image/my-location.svg',
                new window.kakao.maps.Size(40, 40),
                { offset: new window.kakao.maps.Point(20, 40) }
              );
              new window.kakao.maps.Marker({
                map: map,
                position: userLocation,
                image: userMarkerImage,
                title: '현재 위치',
              });
              map.setCenter(userLocation);
            },
            (error) => {
              console.error('현재 위치를 가져오는 데 실패했습니다:', error);
            }
          );
        }
      });
    };

    mapScript.addEventListener('load', initializeMap);

    return () => {
      mapScript.removeEventListener('load', initializeMap);
    };
  }, [KAKAO_MAP_KEY]);

  return (
    <>
      <Header />
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>
      {router.pathname === '/map' && <PopularSports />}
      <Indicator />
      {selectedFacility && <FacilityInfo facility={selectedFacility} />} 
    </>
  );
}
