import { useEffect, useCallback, useState, useRef } from 'react';
import { createMarkerImage } from '@/utils/markerUtils';
import throttle from 'lodash/throttle';
import {
  getSpecialFacilityDetails,
  getNomalFacilityDetails,
} from '@/apis/get/getFacilityDetails';
import { Facility } from '@/apis/get/getFacilities';

type UseFacilityMarkersProps = {
  map: kakao.maps.Map | null;
  facilities: Facility[];
  toggle: string;
  setSelectedFacility: (facility: any) => void;
  setIndicatorMode: (mode: 'sports' | 'facilityInfo') => void;
};

export default function useFacilityMarkers({
  map,
  facilities,
  toggle,
  setSelectedFacility,
  setIndicatorMode,
}: UseFacilityMarkersProps) {
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
  const selectedMarkerRef = useRef<kakao.maps.Marker | null>(null);

  // 기존 마커 제거
  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
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

  // 시설 주소를 좌표로 변환하는 함수 (카카오맵 로드 확인 추가)
  const fetchCoordinates = useCallback(
    (facility: Facility): Promise<{ lat: number; lng: number } | null> =>
      new Promise(resolve => {
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
            console.error('주소 변환 실패:', facility.address);
            resolve(null);
          }
        });
      }),
    []
  );

  // 마커 렌더링 함수 (좌표 변환을 포함)
  const renderMarkers = useCallback(
    throttle(async () => {
      if (!map || facilities.length === 0) return;
      clearMarkers();

      const newMarkers: kakao.maps.Marker[] = [];

      for (const facility of facilities) {
        const coords = await fetchCoordinates(facility);
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

        // 마커 클릭 이벤트 (기존 선택된 마커 초기화 후 새로운 마커 선택)
        kakao.maps.event.addListener(marker, 'click', async () => {
          if (
            selectedMarkerRef.current &&
            selectedMarkerRef.current !== marker
          ) {
            selectedMarkerRef.current.setImage(defaultMarkerImage);
          }

          marker.setImage(selectedMarkerImage);
          selectedMarkerRef.current = marker;

          try {
            let details = null;
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

      setMarkers(newMarkers);
    }, 3000), // 3초 단위로 API 요청 제한
    [map, facilities, toggle]
  );

  // 토글 변경 시 마커 이미지 업데이트
  useEffect(() => {
    markers.forEach(marker => {
      marker.setImage(
        createMarkerImage(
          toggle === 'special'
            ? '/image/marker-special.svg'
            : '/image/marker.svg'
        )
      );
    });
  }, [toggle]); // toggle 값이 변경될 때 실행

  useEffect(() => {
    if (map && facilities.length > 0) {
      renderMarkers();
    } else {
      clearMarkers();
    }
  }, [map, facilities]);

  return { markers, resetSelectedMarker };
}
