import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/MapHome/PopularSports';
import FacilityInfo from '@/components/MapHome/FacilityInfo';
import useKakaoMap from '@/hooks/useMap';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import { useRouter } from 'next/router';
import { Facility } from '@/apis/get/getFacilities';
import {
  NomalFacilityDetails,
  SpecialFacilityDetails,
} from '@/apis/get/getFacilityDetails';
import { usePopup } from '@/utils/popupUtils';
import useFetchFacilities from './hooks/useFetchFacilities';
import useUpdateLocalCode from './hooks/useUpdateLocalCode';
import useFacilityMarkers from './hooks/useFacilityMarkers';
import usePositionButton from './hooks/usePositionButton';

interface KakaoMapResult {
  address_name: string;
  code: string;
  x: string;
  y: string;
}

const loadKakaoMapScript = () => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`;

  document.head.appendChild(script);

  return new Promise<void>((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('카카오 지도 API 로드에 실패했습니다.'));
  });
};

export default function MapContainer() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<
    NomalFacilityDetails | SpecialFacilityDetails | null
  >(null);
  const [indicatorMode, setIndicatorMode] = useState<'sports' | 'facilityInfo'>(
    'sports'
  );
  const [selectedRegion, setSelectedRegion] = useState('지역');
  const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY!;
  const [userLocation, setUserLocation] = useState<kakao.maps.LatLng | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] =
    useState<kakao.maps.LatLng | null>(null);
  const toggle = useRecoilValue(toggleState);
  const router = useRouter();
  const { openPopup } = usePopup();
  const { map, setMap } = useKakaoMap(KAKAO_MAP_KEY, null);
  const fetchFacilitiesBySport = useFetchFacilities(
    setFacilities,
    openPopup,
    toggle
  );
  const { resetSelectedMarker } = useFacilityMarkers({
    map,
    facilities,
    toggle,
    setSelectedFacility,
    setIndicatorMode,
  });

  const { updateLocalCodeAndFetchFacilities } = useUpdateLocalCode(
    setSelectedRegion,
    fetchFacilitiesBySport
  );

  const { moveToUserLocation, buttonProps } = usePositionButton({
    map,
    userLocation,
    setSelectedLocation,
    updateLocalCodeAndFetchFacilities,
    fetchFacilitiesBySport,
  });

  const handleRegionSelect = useCallback(
    (localCode: string, fullRegionName: string) => {
      if (!fullRegionName) {
        console.error('유효하지 않은 지역 이름:', localCode, fullRegionName);
        return;
      }

      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(
        fullRegionName,
        (
          result: KakaoMapResult[],
          status: string
        ) => {
          if (status === kakao.maps.services.Status.OK && result.length > 0) {
            const { y: latitude, x: longitude } = result[0];
            const coords = new kakao.maps.LatLng(
              parseFloat(latitude),
              parseFloat(longitude)
            );

            if (map) {
              map.setCenter(coords);
            }

            setSelectedLocation(coords);
            updateLocalCodeAndFetchFacilities(
              parseFloat(latitude),
              parseFloat(longitude)
            );

            fetchFacilitiesBySport();
          } else {
            console.error(
              '지역 검색 실패 또는 결과 없음:',
              status,
              fullRegionName
            );
          }
        }
      );
    },
    [map, updateLocalCodeAndFetchFacilities, fetchFacilitiesBySport]
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    loadKakaoMapScript()
      .then(() => {
        kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center:
              selectedLocation ||
              userLocation ||
              new kakao.maps.LatLng(37.5665, 126.978),
            level: 6,
          };
          const kakaoMap = new kakao.maps.Map(
            container as HTMLElement,
            options
          );
          setMap(kakaoMap);

          if (navigator.geolocation && !userLocation) {
            navigator.geolocation.getCurrentPosition(
              position => {
                const userLatLng = new kakao.maps.LatLng(
                  position.coords.latitude,
                  position.coords.longitude
                );
                setUserLocation(userLatLng);
                kakaoMap.setCenter(userLatLng);

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
      })
      .catch(console.error);
  }, [KAKAO_MAP_KEY, toggle, selectedLocation]);

  useEffect(() => {
    if (map && selectedLocation) {
      map.setCenter(selectedLocation);
    }
  }, [map, selectedLocation]);

  return (
    <>
      <Header />
      <div {...buttonProps} onClick={moveToUserLocation}>
        <img src={buttonProps.src} alt={buttonProps.alt} />
      </div>
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>
      {indicatorMode === 'sports' ? (
        <PopularSports
          onSelectSport={sport => {
            fetchFacilitiesBySport(sport);
          }}
          mode={toggle}
          onRegionSelect={handleRegionSelect}
          selectedRegion={selectedRegion}
        />
      ) : (
        selectedFacility && (
          <FacilityInfo
            facility={selectedFacility}
            onBackClick={() => {
              resetSelectedMarker();
              setIndicatorMode('sports');
            }}
            onMoveToDetail={() => {
              if (selectedFacility) {
                router.push(
                  `/details/${selectedFacility.businessId}${
                    'serialNumber' in selectedFacility
                      ? `/${selectedFacility.serialNumber}`
                      : ''
                  }`
                );
              }
            }}
            resetSelectedMarker={resetSelectedMarker}
          />
        )
      )}
    </>
  );
}
