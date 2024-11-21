import BASE_URL from '@/constants/baseurl';

/* 일반 회원 */
export interface NomalFacility {
  businessId: string;
  serialNumber?: string;
  name: string;
  cityCode: string;
  cityName: string;
  localCode: string;
  localName: string;
  address: string;
  detailAddress: string;
  owner: string;
  items: string[];
}

export interface GetNomalFacilitiesParams {
  facilityName?: string;
  localCode?: string;
  itemName?: string;
}

export async function getNomalFacilities(
  params: GetNomalFacilitiesParams
): Promise<NomalFacility[]> {
  // API 요청 시 undefined 값이 포함되지 않도록 처리
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined)
  );

  try {
    const response = await BASE_URL.get<NomalFacility[]>('/normal/facilities', {
      params: filteredParams,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw new Error('Failed to fetch facilities');
  }
}

/* 특수 회원 */
export interface SpecialFacility {
  businessId: string;
  name: string;
  cityCode: string;
  cityName: string;
  localCode: string;
  localName: string;
  address: string;
  detailAddress: string;
  items: string[];
}

export interface GetSpecialFacilitiesParams {
  facilityName?: string; // 시설 명
  localCode?: string; // 5자리 지역코드
  itemName?: string; // 종목 명
  type?: string; // 장애 유형
}

export async function getSpecialFacilities(
  params: GetSpecialFacilitiesParams
): Promise<SpecialFacility[]> {
  // API 요청 시 undefined 값이 포함되지 않도록 처리
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined)
  );

  try {
    const response = await BASE_URL.get<SpecialFacility[]>(
      '/special/facilities',
      {
        params: filteredParams,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw new Error('Failed to fetch facilities');
  }
}
