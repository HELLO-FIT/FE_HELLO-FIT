import { useCallback } from 'react';
import { simplifyRegionName } from '@/utils/regionUtils';
import throttle from 'lodash/throttle';

type SetSelectedRegion = (region: string) => void;
type FetchFacilitiesBySport = (sport?: string | null) => void;

export default function useUpdateLocalCode(
  setSelectedRegion: SetSelectedRegion,
  fetchFacilitiesBySport: FetchFacilitiesBySport
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
    [setSelectedRegion, fetchFacilitiesBySport] // ✅ 최소한의 의존성
  );

  return { updateLocalCodeAndFetchFacilities };
}
