import React, { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/MapHome/PopularSports';
import FacilityInfo from '@/components/MapHome/FacilityInfo';
import { getFacilities, Facility } from '@/apis/get/getFacilities';
import {
  getFacilityDetails,
  FacilityDetails,
} from '@/apis/get/getFacilityDetails';
import styles from './map.module.scss';

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
  const [userLocation, setUserLocation] = useState<any>(null);
  const [localCode, setLocalCode] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // 특정 스포츠 종목에 따른 시설 정보 가져오기
  const fetchFacilitiesBySport = async (sport: string | null = null) => {
    try {
      const data = await getFacilities({
        localCode: localCode || '11680', // 로컬 코드가 없으면 기본값으로 '11680' 사용
        itemName: sport || undefined,
      });
      setFacilities(data);
    } catch (error) {
      console.error('시설 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  // 로컬 코드와 시설 데이터를 현재 위치 기반으로 설정
  const updateLocalCodeAndFetchFacilities = (
    latitude: number,
    longitude: number
  ) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(
      longitude,
      latitude,
      (result: any, status: string) => {
        if (status === window.kakao.maps.services.Status.OK && result[0].code) {
          setLocalCode(result[0].code); // API에서 받은 로컬 코드로 상태 업데이트
          fetchFacilitiesBySport(); // 새로 설정된 로컬 코드에 맞춰 시설 데이터 로드
        }
      }
    );
  };

  useEffect(() => {
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

        // 사용자 위치 표시와 로컬 코드 설정
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const userLatLng = new window.kakao.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              );
              setUserLocation(userLatLng);
              kakaoMap.setCenter(userLatLng);

              const userMarkerImage = new window.kakao.maps.MarkerImage(
                '/image/my-location.svg',
                new window.kakao.maps.Size(40, 40),
                { offset: new window.kakao.maps.Point(20, 40) }
              );
              new window.kakao.maps.Marker({
                map: kakaoMap,
                position: userLatLng,
                image: userMarkerImage,
                title: '현재 위치',
              });

              // 현재 위치 기반으로 로컬 코드 업데이트 및 시설 데이터 로드
              updateLocalCodeAndFetchFacilities(
                position.coords.latitude,
                position.coords.longitude
              );
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

    const markers: any[] = [];

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
            markers.push(marker);

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

    // cleanup 함수에서 이전 마커 삭제
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, facilities]);

  const moveToUserLocation = () => {
    if (map && userLocation) {
      map.setCenter(userLocation);
    } else {
      console.warn('Map or userLocation is not available');
    }
  };

  const handleBackClick = () => {
    setIndicatorMode('sports');
  };

  return (
    <>
      <Header />
      <div className={styles.positionButton} onClick={moveToUserLocation}>
        <img src="/image/position.svg" alt="현재 위치로 돌아가기" />
      </div>
      <div
        id="map"
        style={{ width: '100%', height: '100vh', position: 'relative' }}
      ></div>
      {indicatorMode === 'sports' ? (
        <PopularSports onSelectSport={fetchFacilitiesBySport} />
      ) : (
        selectedFacility && (
          <FacilityInfo
            facility={selectedFacility}
            onBackClick={handleBackClick}
          />
        )
      )}
    </>
  );
}
