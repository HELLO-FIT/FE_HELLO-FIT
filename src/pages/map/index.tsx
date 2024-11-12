import React, { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/MapHome/PopularSports';
import FacilityInfo from '@/components/MapHome/FacilityInfo';
import { getFacilities, Facility } from '@/apis/get/getFacilities';

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
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [indicatorMode, setIndicatorMode] = useState<'sports' | 'facilityInfo'>('sports');
  const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  const [map, setMap] = useState<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await getFacilities({ localCode: '11680' });
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
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
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
                '/image/my-location.svg',
                new window.kakao.maps.Size(40, 40),
                { offset: new window.kakao.maps.Point(20, 40) }
              );
              new window.kakao.maps.Marker({
                map: kakaoMap,
                position: userLocation,
                image: userMarkerImage,
                title: '현재 위치',
              });
              kakaoMap.setCenter(userLocation);
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

  useEffect(() => {
    if (!map || facilities.length === 0) return;

    // 기본 마커 이미지와 선택된 마커 이미지 설정
    const defaultMarkerImage = new window.kakao.maps.MarkerImage(
      '/image/marker.svg',
      new window.kakao.maps.Size(28, 28),
      { offset: new window.kakao.maps.Point(20, 40) }
    );

    const selectedMarkerImage = new window.kakao.maps.MarkerImage(
      '/image/address-marker-normal.svg',
      new window.kakao.maps.Size(28, 28),
      { offset: new window.kakao.maps.Point(20, 40) }
    );

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

            // 기본 마커 생성
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
              image: defaultMarkerImage,
            });

            // 마커 클릭 이벤트 추가
            window.kakao.maps.event.addListener(marker, 'click', () => {
              // 이전에 선택된 마커가 있다면 기본 이미지로 변경
              if (selectedMarker && selectedMarker !== marker) {
                selectedMarker.setImage(defaultMarkerImage);
              }

              // 현재 마커를 선택된 이미지로 변경
              marker.setImage(selectedMarkerImage);

              // 선택된 마커와 시설 상태 업데이트
              setSelectedMarker(marker);
              setSelectedFacility(facility);
              setIndicatorMode('facilityInfo');
            });
          } else {
            console.error('주소 검색 실패:', status);
          }
        }
      );
    });
  }, [map, facilities]);

  return (
    <>
      <Header />
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>
      <div style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 10 }}>
        {indicatorMode === 'sports' ? (
          <PopularSports />
        ) : (
          selectedFacility && <FacilityInfo facility={selectedFacility} />
        )}
      </div>
    </>
  );
}
