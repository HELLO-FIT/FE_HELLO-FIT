import { useCallback, useMemo } from 'react';
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
  const throttledGeocode = useMemo(
    () =>
      throttle(
        (latitude: number, longitude: number) => {
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2RegionCode(
            longitude,
            latitude,
            (
              result: RegionResult[],
              status: (typeof kakao.maps.services.Status)[keyof typeof kakao.maps.services.Status]
            ) => {
              if (
                status === kakao.maps.services.Status.OK &&
                result.length > 0
              ) {
                const fullLocalCode = result[0].code.trim();
                const shortLocalCode = `${fullLocalCode.slice(0, 4)}0`;

                localStorage.setItem('localCode', shortLocalCode);
                const simplifiedRegion = simplifyRegionName(
                  result[0].address_name
                );
                setSelectedRegion(simplifiedRegion);

                fetchFacilitiesBySport();
              } else {
                console.error('지역 코드를 가져오는 데 실패했습니다:', status);
              }
            }
          );
        },
        2000,
        { leading: true, trailing: false }
      ),
    [setSelectedRegion, fetchFacilitiesBySport]
  );

  const updateLocalCodeAndFetchFacilities = useCallback(
    (latitude: number, longitude: number) => {
      throttledGeocode(latitude, longitude);
    },
    [throttledGeocode]
  );

  return { updateLocalCodeAndFetchFacilities };
}
