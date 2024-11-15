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
  const [localCode, setLocalCode] = useState<string>('11110'); // 기본값으로 서울 종로구 설정

  // 시설 정보를 특정 스포츠 종목과 지역 코드에 맞게 가져오기
  const fetchFacilitiesBySport = async (sport: string | null = null) => {
    try {
      const data = await getFacilities({
        localCode: localCode || '11110', // 로컬 코드가 없으면 기본값 사용
        itemName: sport || undefined,
      });
      setFacilities(data);
    } catch (error) {
      console.error('시설 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  // 사용자 위치 기반으로 지역 코드를 가져오고 시설 데이터를 업데이트
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
          const fullLocalCode = result[0].code || '11110'; // 10자리 코드
          const shortLocalCode = fullLocalCode.slice(0, 5); // 앞 5자리만 사용
          setLocalCode(shortLocalCode); // 로컬 코드 상태 업데이트
          localStorage.setItem('localCode', shortLocalCode); // 로컬 스토리지에 저장
          fetchFacilitiesBySport(); // 새로 설정된 로컬 코드에 맞춰 시설 데이터 로드
        }
      }
    );
  };

  // 지도 초기화 및 사용자 위치 설정
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

  // 시설 데이터에 따른 마커 표시
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
