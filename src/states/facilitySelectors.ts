import { selectorFamily } from 'recoil';
import { getFacilities, Facility } from '@/apis/get/getFacilities';
import {
  getFacilityDetails,
  FacilityDetails,
} from '@/apis/get/getFacilityDetails';

interface FacilitySelectorParams {
  facilityName?: string;
  localCode?: string;
  itemName?: string;
  [key: string]: string | undefined;
}

// 시설 목록 셀렉터
export const facilitiesListSelector = selectorFamily<
  Facility[],
  FacilitySelectorParams
>({
  key: 'facilitiesListSelector',
  get: params => async () => {
    return await getFacilities(params);
  },
});

// 시설 상세 셀렉터
export const facilityDetailsSelector = selectorFamily<
  FacilityDetails | null,
  { businessId: string; serialNumber: string }
>({
  key: 'facilityDetailsSelector',
  get:
    ({ businessId, serialNumber }) =>
    async () => {
      try {
        const details = await getFacilityDetails(businessId, serialNumber);
        return details;
      } catch (error) {
        console.error('Error fetching facility details:', error);
        return null;
      }
    },
});
