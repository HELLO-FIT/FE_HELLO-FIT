import { NomalFacility, SpecialFacility } from '@/apis/get/getFacilities';

export interface ScheduleProps {
  facility: NomalFacility | SpecialFacility;
}
