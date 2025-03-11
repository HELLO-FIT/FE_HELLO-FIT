import {
  getNomalFacilities,
  getSpecialFacilities,
} from '@/apis/get/getFacilities';

type FetchFacilitiesParams = {
  localCode: string | null;
  sport: string | null;
  toggle: 'general' | 'special';
  signal?: AbortSignal;
};

export const fetchFacilities = async ({
  localCode,
  sport,
  toggle,
  signal,
}: FetchFacilitiesParams) => {
  try {
    const params = {
      localCode: localCode || '11110',
      itemName: sport || undefined,
      signal,
    };

    const data =
      toggle === 'special'
        ? await getSpecialFacilities(params)
        : await getNomalFacilities(params);

    return data;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.warn('요청이 중단되었습니다.');
      return [];
    }

    console.error('시설 데이터를 가져오는 중 오류 발생:', error);
    return [];
  }
};
