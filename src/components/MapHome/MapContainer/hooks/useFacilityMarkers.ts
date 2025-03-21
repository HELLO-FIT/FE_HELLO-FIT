import { useEffect, useCallback, useRef } from 'react';
import { createMarkerImage } from '@/utils/markerUtils';
import throttle from 'lodash/throttle';
import {
  getSpecialFacilityDetails,
  getNomalFacilityDetails,
  NomalFacilityDetails,
  SpecialFacilityDetails,
} from '@/apis/get/getFacilityDetails';
import { Facility } from '@/apis/get/getFacilities';

type FacilityDetails = NomalFacilityDetails | SpecialFacilityDetails | null;

type UseFacilityMarkersProps = {
  map: kakao.maps.Map | null;
  facilities: Facility[];
  toggle: 'general' | 'special';
  setFacilities: (facilities: Facility[]) => void;
  setSelectedFacility: (facility: FacilityDetails) => void;
  setIndicatorMode: (mode: 'sports' | 'facilityInfo') => void;
};

export default function useFacilityMarkers({
  map,
  facilities,
  toggle,
  setFacilities,
  setSelectedFacility,
  setIndicatorMode,
}: UseFacilityMarkersProps) {
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const selectedMarkerRef = useRef<kakao.maps.Marker | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const latestRequestRef = useRef<Promise<void> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 기존 마커 제거
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  // 선택된 마커 초기화
  const resetSelectedMarker = () => {
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setImage(
        createMarkerImage(
          toggle === 'special'
            ? '/image/marker-special.svg'
            : '/image/marker.svg'
        )
      );
      selectedMarkerRef.current = null;
    }
  };

  // 시설 주소를 좌표로 변환하는 함수 (병렬 실행)
  const fetchCoordinates = useCallback(async (facility: Facility) => {
    return new Promise<{ lat: number; lng: number } | null>(resolve => {
      if (!window.kakao?.maps?.services) {
        console.error('카카오맵 API가 아직 로드되지 않았습니다.');
        resolve(null);
        return;
      }

      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(facility.address, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result.length > 0) {
          resolve({
            lat: parseFloat(result[0].y),
            lng: parseFloat(result[0].x),
          });
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  // 마커 렌더링 (모든 좌표 변환 후 한 번에 실행)
  const renderMarkers = useCallback(
    throttle(async () => {
      if (!map || facilities.length === 0) return;

      // 기존 요청 중단
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      clearMarkers(); // 기존 마커 삭제

      // 모든 좌표 변환을 병렬로 실행하여 속도 개선
      const coordinates = await Promise.all(
        facilities.map(facility => fetchCoordinates(facility))
      );

      const newMarkers: kakao.maps.Marker[] = [];

      for (let i = 0; i < facilities.length; i++) {
        const facility = facilities[i];
        const coords = coordinates[i];
        if (!coords) continue; // 좌표 변환 실패 시 스킵

        const defaultMarkerImage = createMarkerImage(
          toggle === 'special'
            ? '/image/marker-special.svg'
            : '/image/marker.svg'
        );

        const selectedMarkerImage = createMarkerImage(
          toggle === 'special'
            ? '/image/address-marker-special.svg'
            : '/image/address-marker-normal.svg',
          1.5
        );

        const marker = new kakao.maps.Marker({
          map,
          position: new kakao.maps.LatLng(coords.lat, coords.lng),
          image: defaultMarkerImage,
          title: facility.name,
        });

        newMarkers.push(marker);

        // 마커 클릭 이벤트 (선택된 마커 초기화 후 새로운 마커 선택)
        kakao.maps.event.addListener(marker, 'click', async () => {
          if (
            selectedMarkerRef.current &&
            selectedMarkerRef.current !== marker
          ) {
            selectedMarkerRef.current.setImage(
              createMarkerImage(
                toggle === 'special'
                  ? '/image/marker-special.svg'
                  : '/image/marker.svg'
              )
            );
          }

          marker.setImage(selectedMarkerImage);
          selectedMarkerRef.current = marker;

          try {
            let details: FacilityDetails = null;
            if (toggle === 'special') {
              details = await getSpecialFacilityDetails(facility.businessId);
            } else if (facility.serialNumber) {
              details = await getNomalFacilityDetails(
                facility.businessId,
                facility.serialNumber
              );
            }

            if (details) {
              setSelectedFacility(details);
              setIndicatorMode('facilityInfo');
            }
          } catch (error) {
            console.error('시설 상세 정보를 가져오는 데 실패했습니다:', error);
          }
        });
      }

      markersRef.current = newMarkers;
      isFetchingRef.current = false; // 요청 완료
    }, 2000),
    [map, facilities, toggle]
  );

  // 토글 변경 시 기존 마커 및 시설 초기화
  useEffect(() => {
    if (isFetchingRef.current) return;

    clearMarkers();
    setFacilities([]);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    latestRequestRef.current = (async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    })();
  }, [toggle]);

  // 지도 로드 후 마커 생성
  useEffect(() => {
    if (!map) return;

    clearMarkers(); // 기존 마커 제거 후 새 마커 추가

    if (facilities.length > 0) {
      renderMarkers();
    }
  }, [map, facilities]);

  return { resetSelectedMarker, clearMarkers };
}
