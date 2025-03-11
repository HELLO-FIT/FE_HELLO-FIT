import { useCallback, useRef } from 'react';
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchFacilitiesBySport = useCallback(
    async (sport: string | null = null) => {
      // 기존 요청이 있다면 중단
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 새로운 요청을 위한 AbortController 생성
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const localCode = localStorage.getItem('localCode') ?? '';
      setFacilities([]); // 기존 시설 초기화

      try {
        const data: Facility[] | null = await fetchFacilities({
          localCode,
          sport,
          toggle,
          signal: abortController.signal,
        });

        if (!data || data.length === 0) {
          openPopup({ content: '등록된 시설이 없습니다.' });
        } else {
          setFacilities(data);
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.log('이전 요청이 취소되었습니다.');
        } else {
          console.error('시설 데이터를 가져오는 중 오류 발생:', error);
        }
      }
    },
    [toggle, setFacilities, openPopup]
  );

  return fetchFacilitiesBySport;
};

export default useFetchFacilities;
