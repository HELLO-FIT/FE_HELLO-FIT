import BASE_URL from '@/constants/baseurl';

/* 일반 회원 */
export interface NomalFacilityDetails {
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
  isFavorite: boolean;
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
  averageScore: number;
  reviews: Array<{
    id: string;
    userId: string;
    nickname: string;
    score: number;
    content: string;
    createdAt: Date;
    isMine: boolean;
  }>;
}

export async function getNomalFacilityDetails(
  businessId: string,
  serialNumber: string
): Promise<NomalFacilityDetails> {
  try {
    const response = await BASE_URL.get<NomalFacilityDetails>(
      `/normal/facilities/${businessId}/${serialNumber}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching facility details:', error);
    throw new Error('Failed to fetch facility details');
  }
}

/* 특수 회원 */
export interface SpecialFacilityDetails {
  businessId: string;
  name: string;
  cityCode: string;
  cityName: string;
  localCode: string;
  localName: string;
  address: string;
  detailAddress: string;
  phone: string;
  items: string[];
  types: string[];
  isFavorite: boolean;
  courses: Array<{
    courseId: string;
    courseName: string;
    itemName: string;
    startTime: string;
    endTime: string;
    workday: string;
    price: number;
  }>;
  averageScore: number;
  reviews: Array<{
    id: string;
    userId: string;
    nickname: string;
    score: number;
    content: string;
    createdAt: Date;
    isMine: boolean;
  }>;
}

export async function getSpecialFacilityDetails(
  businessId: string
): Promise<SpecialFacilityDetails> {
  try {
    const response = await BASE_URL.get<SpecialFacilityDetails>(
      `/special/facilities/${businessId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching facility details:', error);
    throw new Error('Failed to fetch facility details');
  }
}
