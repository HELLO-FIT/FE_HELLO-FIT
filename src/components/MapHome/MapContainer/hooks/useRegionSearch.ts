import { useCallback } from 'react';
import { Facility } from '@/apis/get/getFacilities';

interface KakaoMapResult {
  address_name: string;
  code: string;
  x: string;
  y: string;
}

export default function useRegionSearch(
  map: kakao.maps.Map | null,
  setFacilities: (facilities: Facility[]) => void,
  clearMarkers: () => void,
  setSelectedLocation: (location: kakao.maps.LatLng | null) => void,
  updateLocalCodeAndFetchFacilities: (lat: number, lng: number) => void,
  fetchFacilitiesBySport: () => void
) {
  const handleRegionSelect = useCallback(
    (localCode: string, fullRegionName: string) => {
      if (!fullRegionName) {
        console.error('유효하지 않은 지역 이름:', localCode, fullRegionName);
        return;
      }

      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(
        fullRegionName,
        (result: KakaoMapResult[], status: string) => {
          if (status === kakao.maps.services.Status.OK && result.length > 0) {
            const { y: latitude, x: longitude } = result[0];
            const coords = new kakao.maps.LatLng(
              parseFloat(latitude),
              parseFloat(longitude)
            );

            if (map) {
              map.setCenter(coords);
            }

            setFacilities([]);
            clearMarkers();
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

  return { handleRegionSelect };
}
