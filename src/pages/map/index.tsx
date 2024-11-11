import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Layout/Header';
// import Indicator from '@/components/MapHome/Indicator';
import { getFacilities, Facility } from '@/apis/get/getFacilities';
import Indicator from '@/components/MapHome/Indicator';

/* eslint-disable */
declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapResult {
  y: string;
  x: string;
}

export default function Map() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [indicatorMode, setIndicatorMode] = useState<'sports' | 'facilityInfo'>('sports');
  const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  const [map, setMap] = useState<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null); // 현재 선택된 마커

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await getFacilities({ localCode: '11680' }); // 예시 지역 코드
        setFacilities(data);
      } catch (error) {
        console.error('시설 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchFacilities();

    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;

    document.head.appendChild(mapScript);

    const initializeMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
          level: 3,
        };
        const kakaoMap = new window.kakao.maps.Map(mapContainer, mapOption);
        setMap(kakaoMap);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = new window.kakao.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              );
              const userMarkerImage = new window.kakao.maps.MarkerImage(
                '/image/my-location.svg', // 사용자 위치 아이콘
                new window.kakao.maps.Size(40, 40),
                { offset: new window.kakao.maps.Point(20, 40) }
              );
              new window.kakao.maps.Marker({
                map: kakaoMap,
                position: userLocation,
                image: userMarkerImage,
                title: '현재 위치',
              });
              kakaoMap.setCenter(userLocation); // 지도의 중심을 현재 위치로 설정
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

  // 시설 마커 표시 (facilities가 업데이트될 때만 실행)
  useEffect(() => {
    if (!map || facilities.length === 0) return;

    facilities.forEach((facility) => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(
        facility.address,
        (result: KakaoMapResult[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(
              parseFloat(result[0].y),
              parseFloat(result[0].x)
            );
            const defaultMarkerImage = new window.kakao.maps.MarkerImage(
              '/image/marker.svg', // 기본 시설 마커 아이콘
              new window.kakao.maps.Size(28, 28),
              { offset: new window.kakao.maps.Point(20, 40) }
            );

            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
              image: defaultMarkerImage,
            });

            // 마커 클릭 시 선택된 마커 아이콘으로 변경하고 시설 정보 표시
            window.kakao.maps.event.addListener(marker, 'click', () => {
              // 이전에 선택된 마커가 있다면 기본 이미지로 되돌림
              if (selectedMarker) {
                selectedMarker.setImage(defaultMarkerImage); // 이전 마커를 기본 아이콘으로 되돌림
              }

              // 현재 마커를 선택된 상태로 설정
              const selectedMarkerImage = new window.kakao.maps.MarkerImage(
                '/image/address-marker-normal.svg', // 선택된 시설 마커 아이콘
                new window.kakao.maps.Size(40, 40),
                { offset: new window.kakao.maps.Point(20, 40) }
              );
              marker.setImage(selectedMarkerImage); // 선택된 마커 아이콘 적용
              setSelectedMarker(marker); // 선택된 마커 업데이트
              setSelectedFacility(facility); // 선택된 시설 정보 설정
              setIndicatorMode('facilityInfo'); // 표시 모드를 시설 정보로 변경
            });
          } else {
            console.error('주소 검색 실패:', status);
          }
        }
      );
    });
  }, [map, facilities, selectedMarker]);

  return (
    <>
      <Header />
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>
      <Indicator selectedFacility={selectedFacility} indicatorMode={indicatorMode} />
    </>
  );
}
