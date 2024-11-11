export interface Facility {
  businessId: string;
  serialNumber: string;
  name: string;
  cityCode: string;
  cityName: string;
  districtCode: string;
  districtName: string;
  localCode: string;
  localName: string;
  items: string[];
  itemsK: string;
}

interface GetFacilitiesParams {
  facilityName?: string;
  localCode?: string;
  itemName?: string;
}

export async function getFacilities(
  params: GetFacilitiesParams
): Promise<Facility[]> {
  // undefined 값을 제거하기 위해 필터링
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined)
  );

  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>
  ).toString();

  const response = await fetch(`/normal/facilities?${queryString}`);

  if (!response.ok) {
    throw new Error('Failed to fetch facilities');
  }

  return response.json();
}
