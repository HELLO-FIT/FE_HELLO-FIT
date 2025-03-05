import { useCallback } from 'react';
import { simplifyRegionName } from '@/utils/regionUtils';
import throttle from 'lodash/throttle';

type SetSelectedRegion = (region: string) => void;
type FetchFacilitiesBySport = (sport?: string | null) => void;

interface RegionResult {
  address_name: string;
  code: string;
}

export default function useUpdateLocalCode(
  setSelectedRegion: SetSelectedRegion,
  fetchFacilitiesBySport: FetchFacilitiesBySport
) {
  const throttledGeocode = useCallback(
    throttle((latitude: number, longitude: number) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2RegionCode(
        longitude,
        latitude,
        (result: RegionResult[], status) => {
          if (status === kakao.maps.services.Status.OK && result.length > 0) {
            const shortLocalCode = `${result[0].code.slice(0, 4)}0`;
            localStorage.setItem('localCode', shortLocalCode);

            setSelectedRegion(simplifyRegionName(result[0].address_name));
            fetchFacilitiesBySport();
          } else {
            console.error('지역 코드를 가져오는 데 실패했습니다:', status);
          }
        }
      );
    }, 3000),
    []
  );

  return { updateLocalCodeAndFetchFacilities: throttledGeocode };
}
