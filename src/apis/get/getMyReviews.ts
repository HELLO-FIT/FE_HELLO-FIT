import BASE_URL from '@/constants/baseurl';

export interface MyReviewsResponse {
  id: string;
  businessId: string;
  serialNumber?: string;
  nickname: string;
  score: number;
  content: string;
  createdAt: Date;
  facilityName: string;
}

export async function getMyReviews(): Promise<MyReviewsResponse[]> {
  try {
    const response = await BASE_URL.get<MyReviewsResponse[]>('/reviews/my');
    return response.data;
  } catch (error) {
    console.error('Error fetching Reviews:', error);
    throw new Error('Failed to fetch Reviews');
  }
}
