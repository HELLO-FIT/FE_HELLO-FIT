import BASE_URL from '@/constants/baseurl';

export interface FavoritesItem {
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

export async function getFavorites(): Promise<FavoritesItem[]> {
  try {
    const response = await BASE_URL.get<FavoritesItem[]>('/users/favorites');
    return response.data.reverse();
  } catch (error) {
    console.error('Error fetching Favorites:', error);
    throw new Error('Failed to fetch Favorites');
  }
}
