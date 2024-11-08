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

interface KakaoLatLng {
  new (lat: number, lng: number): KakaoLatLng;
}

interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

interface KakaoMap {
  new (container: HTMLElement, options: KakaoMapOptions): KakaoMap;
  setCenter(position: KakaoLatLng): void;
}

interface KakaoMarkerImage {
  new (
    src: string,
    size: { width: number; height: number },
    options?: { offset: { x: number; y: number } }
  ): KakaoMarkerImage;
}

interface KakaoMarker {
  setImage(image: KakaoMarkerImage): void;
  setMap(map: KakaoMap | null): void;
  position: KakaoLatLng;
}

interface KakaoGeocoder {
  addressSearch(
    address: string,
    callback: (result: Array<{ y: string; x: string }>, status: string) => void
  ): void;
}

interface Facility {
  id: number;
  name: string;
  item_nm: string;
  location: string;
  address: string;
}

export default function Map() {
  const router = useRouter();
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
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
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        facilityData.forEach(facility => {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(
            facility.address,
            (
              result: {
                y: string;
                x: string;
              }[],
              status: any
            ) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(
                  parseFloat(result[0].y),
                  parseFloat(result[0].x)
                );
                const markerImage = new window.kakao.maps.MarkerImage(
                  '/image/marker.svg',
                  new window.kakao.maps.Size(40, 40),
                  { offset: new window.kakao.maps.Point(20, 40) }
                );

                const marker = new window.kakao.maps.Marker({
                  position: coords,
                  image: markerImage,
                });
                marker.setMap(map);

                window.kakao.maps.event.addListener(marker, 'click', () => {
                  marker.setImage(
                    new window.kakao.maps.MarkerImage(
                      '/image/address-marker-normal.svg',
                      new window.kakao.maps.Size(40, 40),
                      { offset: new window.kakao.maps.Point(20, 40) }
                    )
                  );
                  setSelectedFacility(facility);
                });
              } else {
                console.error('주소 검색 실패:', status);
              }
            }
          );
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const userLocation = new window.kakao.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              );
              const userMarkerImage = new window.kakao.maps.MarkerImage(
                '/image/my-location.svg',
                new window.kakao.maps.Size(40, 40),
                { offset: new window.kakao.maps.Point(20, 40) }
              );
              const userMarker = new window.kakao.maps.Marker({
                position: userLocation,
                image: userMarkerImage,
              });
              userMarker.setMap(map);
              map.setCenter(userLocation);
            },
            error => {
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
