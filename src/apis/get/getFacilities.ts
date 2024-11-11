import BASE_URL from "@/constants/baseurl";

export interface Facility {
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
  items: string[];
}

interface GetFacilitiesParams {
  facilityName?: string;
  localCode?: string;
  itemName?: string;
}

export async function getFacilities(
  params: GetFacilitiesParams
): Promise<Facility[]> {
  // 필터링하여 undefined 값 제거
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined)
  );

  try {
    const response = await BASE_URL.get<Facility[]>('/normal/facilities', {
      params: filteredParams,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw new Error('Failed to fetch facilities');
  }
}
