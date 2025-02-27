import { useCallback } from 'react';
import { simplifyRegionName } from '@/utils/regionUtils';
import throttle from 'lodash/throttle';

export default function useLocationHandler(
  setSelectedRegion: (region: string) => void,
  fetchFacilitiesBySport: (sport?: string | null) => void
) {
  const updateLocalCodeAndFetchFacilities = useCallback(
    throttle(async (latitude: number, longitude: number) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2RegionCode(
        longitude,
        latitude,
        (result: any[], status: string) => {
          if (status === kakao.maps.services.Status.OK && result.length > 0) {
            const fullLocalCode = result[0].code.trim();
            const shortLocalCode = `${fullLocalCode.slice(0, 4)}0`;

            localStorage.setItem('localCode', shortLocalCode);
            const simplifiedRegion = simplifyRegionName(result[0].address_name);
            setSelectedRegion(simplifiedRegion);

            fetchFacilitiesBySport();
          } else {
            console.error('지역 코드를 가져오는 데 실패했습니다:', status);
          }
        }
      );
    }, 2000),
    [fetchFacilitiesBySport, setSelectedRegion]
  );

  const handleRegionSelect = useCallback(
    (localCode: string, fullRegionName: string) => {
      if (!fullRegionName) {
        console.error('유효하지 않은 지역 이름:', localCode, fullRegionName);
        return;
      }

      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(
        fullRegionName,
        (result: any[], status: string) => {
          if (status === kakao.maps.services.Status.OK && result.length > 0) {
            const { y: latitude, x: longitude } = result[0];
            const coords = new kakao.maps.LatLng(
              parseFloat(latitude),
              parseFloat(longitude)
            );

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
    [updateLocalCodeAndFetchFacilities, fetchFacilitiesBySport]
  );

  return { updateLocalCodeAndFetchFacilities, handleRegionSelect };
}
