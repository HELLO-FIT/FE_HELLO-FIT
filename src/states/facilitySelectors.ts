import { selectorFamily } from 'recoil';
import { getNomalFacilities, NomalFacility } from '@/apis/get/getFacilities';
import {
  getNomalFacilityDetails,
  NomalFacilityDetails,
} from '@/apis/get/getFacilityDetails';

interface FacilitySelectorParams {
  facilityName?: string;
  localCode?: string;
  itemName?: string;
  [key: string]: string | undefined;
}

// 시설 목록 셀렉터
export const facilitiesListSelector = selectorFamily<
  NomalFacility[],
  FacilitySelectorParams
>({
  key: 'facilitiesListSelector',
  get: params => async () => {
    return await getNomalFacilities(params);
  },
});

// 시설 상세 셀렉터
export const facilityDetailsSelector = selectorFamily<
  NomalFacilityDetails | null,
  { businessId: string; serialNumber: string }
>({
  key: 'facilityDetailsSelector',
  get:
    ({ businessId, serialNumber }) =>
    async () => {
      try {
        const details = await getNomalFacilityDetails(businessId, serialNumber);
        return details;
      } catch (error) {
        console.error('Error fetching facility details:', error);
        return null;
      }
    },
});
