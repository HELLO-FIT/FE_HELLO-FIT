import { useEffect, useCallback, useState, useRef } from 'react';
import { createMarkerImage } from '@/utils/markerUtils';
import throttle from 'lodash/throttle';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  // 선택된 마커 초기화 함수 (FacilityInfo 패널 닫힐 때 호출)
  const resetSelectedMarker = () => {
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setImage(
        createMarkerImage(
          toggle === 'special'
            ? '/image/marker-special.svg'
            : '/image/marker.svg'
        )
      );
      selectedMarkerRef.current = null; // 상태 초기화
    }
  };

  // 마커 렌더링 함수
  const renderMarkers = useCallback(
    throttle(() => {
      if (!map || facilities.length === 0) return;
      clearMarkers();

      const newMarkers: kakao.maps.Marker[] = [];

      facilities.forEach(facility => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(
          facility.address,
          (result: any[], status: string) => {
            if (status === kakao.maps.services.Status.OK && result.length > 0) {
              const coords = new kakao.maps.LatLng(
                parseFloat(result[0].y),
                parseFloat(result[0].x)
              );

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
                position: coords,
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
                  selectedMarkerRef.current.setImage(defaultMarkerImage); // 이전 마커 기본 상태로 변경
                }

                marker.setImage(selectedMarkerImage);
                selectedMarkerRef.current = marker; // useRef로 선택된 마커 관리

                try {
                  let details;
                  if (toggle === 'special') {
                    details = await getSpecialFacilityDetails(
                      facility.businessId
                    );
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
                  console.error(
                    '시설 상세 정보를 가져오는 데 실패했습니다:',
                    error
                  );
                }
              });
            }
          }
        );
      });

      setMarkers(newMarkers);
    }, 2000),
    [map, facilities, toggle]
  );

  // 마커 새로고침 로직
  useEffect(() => {
    if (map && facilities.length > 0) {
      renderMarkers();
    } else {
      clearMarkers();
    }
  }, [map, facilities, renderMarkers]);

  return { markers, resetSelectedMarker };
}
