import { useCallback } from 'react';
import { fetchFacilities } from '@/apis/get/facilitiesAPI';

export default function useFetchFacilities(
  setFacilities: (facilities: any[]) => void,
  openPopup: (args: { content: string }) => void,
  toggle: string
) {
  const fetchFacilitiesBySport = useCallback(
    async (sport: string | null = null) => {
      const data = await fetchFacilities(
        localStorage.getItem('localCode'),
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
}
