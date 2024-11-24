import {
  getNomalFacilities,
  getSpecialFacilities,
} from '@/apis/get/getFacilities';

export const fetchFacilities = async (
  localCode: string | null,
  sport: string | null,
  toggle: string
) => {
  try {
    const params = {
      localCode: localCode || '11110',
      itemName: sport || undefined,
    };

    if (toggle === 'special') {
      return await getSpecialFacilities(params);
    } else {
      return await getNomalFacilities(params);
    }
  } catch (error) {
    console.error('시설 데이터를 가져오는 중 오류 발생:', error);
    return [];
  }
};
