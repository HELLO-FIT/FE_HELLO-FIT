import BASE_URL from '@/constants/baseurl';

/* 일반 회원 */
export interface NomalPopular {
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
  totalParticipantCount: number;
  items: string[];
}

export interface getNomalPopularParams {
  localCode?: string;
}

export async function getNomalPopular(
  params: getNomalPopularParams
): Promise<NomalPopular[]> {
  // API 요청 시 undefined 값이 포함되지 않도록 처리
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined)
  );

  try {
    const response = await BASE_URL.get<NomalPopular[]>(
      '/normal/facilities/popular',
      {
        params: filteredParams,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching popular facilities:', error);
    throw new Error('Failed to fetch popular facilities');
  }
}

/* 특수 회원 */
export interface SpecialPopular {
  businessId: string;
  name: string;
  cityCode: string;
  cityName: string;
  localCode: string;
  localName: string;
  address: string;
  detailAddress: string;
  totalParticipantCount: number;
  items: string[];
}

export interface getSpecialPopularParams {
  localCode?: string;
  type?: string; // 장애유형
}

export async function getSpecialPopular(
  params: getSpecialPopularParams
): Promise<SpecialPopular[]> {
  // API 요청 시 undefined 값이 포함되지 않도록 처리
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined)
  );

  try {
    const response = await BASE_URL.get<SpecialPopular[]>(
      '/special/facilities/popular',
      {
        params: filteredParams,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching popular facilities:', error);
    throw new Error('Failed to fetch popular facilities');
  }
}
