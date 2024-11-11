import { selectorFamily } from 'recoil';
import { getFacilities, Facility } from '@/apis/get/getFacilities';

interface FacilitySelectorParams {
  facilityName?: string;
  localCode?: string;
  itemName?: string;
}

export const facilitySelector = selectorFamily<Facility[], Readonly<FacilitySelectorParams>>({
  key: 'facilitySelector',
  get: (params) => async () => {
    return await getFacilities(params);
  },
});
