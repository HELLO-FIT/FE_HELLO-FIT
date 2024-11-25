// 유지보수
import { getNomalFacilities } from '@/apis/get/getFacilities';
/* eslint-disable */
export const fetchFacilitiesBySport = async (
  localCode: string | null,
  sport: string | null,
  setFacilities: (data: any) => void,
  setFilterItem: (item: string | null) => void
) => {
  try {
    setFacilities([]);
    setFilterItem(sport);
    const data = await getNomalFacilities({
      localCode: localCode || '11110',
      itemName: sport || undefined,
    });
    setFacilities(data);
  } catch (error) {
    console.error('Failed to fetch facilities:', error);
  }
};
/* eslint-enable */
