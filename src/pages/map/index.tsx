import React, { useEffect, useState, useRef } from 'react';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/MapHome/PopularSports';
import FacilityInfo from '@/components/MapHome/FacilityInfo';
import { getFacilities, Facility } from '@/apis/get/getFacilities';
import {
  getFacilityDetails,
  FacilityDetails,
} from '@/apis/get/getFacilityDetails';

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
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] =
    useState<FacilityDetails | null>(null);
  const [indicatorMode, setIndicatorMode] = useState<'sports' | 'facilityInfo'>(
    'sports'
  );
  const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  const [map, setMap] = useState<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [userLocation, setUserLocation] = useState(null);
  const popularSportsRef = useRef<HTMLDivElement>(null);
  const [buttonBottom, setButtonBottom] = useState(20);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

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
            position => {
              const userLocation = new window.kakao.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              );
              setUserLocation(userLocation);
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

  useEffect(() => {
    if (!map || facilities.length === 0) return;

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

    facilities.forEach(facility => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(
        facility.address,
        (result: KakaoMapResult[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(
              parseFloat(result[0].y),
              parseFloat(result[0].x)
            );

            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
              image: defaultMarkerImage,
            });

            window.kakao.maps.event.addListener(marker, 'click', async () => {
              if (selectedMarker && selectedMarker !== marker) {
                selectedMarker.setImage(defaultMarkerImage);
              }

              marker.setImage(selectedMarkerImage);
              setSelectedMarker(marker);

              try {
                const details = await getFacilityDetails(
                  facility.businessId,
                  facility.serialNumber
                );
                setSelectedFacility(details);
                setIndicatorMode('facilityInfo');
              } catch (error) {
                console.error('Failed to fetch facility details:', error);
              }
            });
          } else {
            console.error('주소 검색 실패:', status);
          }
        }
      );
    });
  }, [map, facilities]);

  const moveToUserLocation = () => {
    if (map && userLocation) {
      map.setCenter(userLocation);
    } else {
      console.warn('Map or userLocation is not available');
    }
  };

  useEffect(() => {
    const updateButtonPosition = () => {
      const popularSportsHeight = popularSportsRef.current
        ? popularSportsRef.current.clientHeight
        : 0;
      setButtonBottom(popularSportsHeight + 20);
    };

    updateButtonPosition();

    window.addEventListener('resize', updateButtonPosition);
    return () => window.removeEventListener('resize', updateButtonPosition);
  }, [indicatorMode]);

  return (
    <>
      <Header />
      <div
        id="map"
        style={{ width: '100%', height: '100vh', position: 'relative' }}
      >
        <div
          onClick={moveToUserLocation}
          style={{
            position: 'fixed',
            right: '20px',
            bottom: `${buttonBottom}px`,
            cursor: 'pointer',
            zIndex: 100,
          }}
        >
          <img
            src="/image/position.svg"
            alt="현재 위치로 돌아가기"
            style={{ width: '40px', height: '40px' }}
          />
        </div>
      </div>
      <div
        ref={popularSportsRef}
        style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 10 }}
      >
        {indicatorMode === 'sports' ? (
          <PopularSports />
        ) : (
          selectedFacility && <FacilityInfo facility={selectedFacility} />
        )}
      </div>
    </>
  );
}
/* eslint-enable */
