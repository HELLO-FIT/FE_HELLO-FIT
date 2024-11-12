import BASE_URL from '@/constants/baseurl';

export interface FacilityDetails {
  businessId: string;
  serialNumber: string;
  name: string;
  cityCode: string;
  cityName: string;
  localCode: string;
  localName: string;
  address: string;
  detailAddress: string;
  owner: string;
  phone: string;
  items: string[];
  courses: Array<{
    courseId: string;
    courseName: string;
    itemName: string;
    instructor: string;
    startTime: string;
    endTime: string;
    workday: string;
    price: number;
  }>;
}

export async function getFacilityDetails(
  businessId: string,
  serialNumber: string
): Promise<FacilityDetails> {
  try {
    const response = await BASE_URL.get<FacilityDetails>(
      `/normal/facilities/${businessId}/${serialNumber}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching facility details:', error);
    throw new Error('Failed to fetch facility details');
  }
}
