import { useCallback } from 'react';
import { fetchFacilities } from '@/apis/get/facilitiesAPI';
import { Facility } from '@/apis/get/getFacilities';

type FetchFacilitiesHook = (
  setFacilities: (facilities: Facility[]) => void,
  openPopup: (args: { content: string }) => void,
  toggle: 'general' | 'special'
) => (sport?: string | null) => Promise<void>;

const useFetchFacilities: FetchFacilitiesHook = (
  setFacilities,
  openPopup,
  toggle
) => {
  const fetchFacilitiesBySport = useCallback(
    async (sport: string | null = null) => {
      const localCode = localStorage.getItem('localCode') ?? '';

      const data: Facility[] | null = await fetchFacilities(
        localCode,
        sport,
        toggle
      );

      if (!data || data.length === 0) {
        openPopup({ content: '등록된 시설이 없습니다.' });
      } else {
        setFacilities(data);
      }
    },
    [toggle, setFacilities, openPopup]
  );

  return fetchFacilitiesBySport;
};

export default useFetchFacilities;
