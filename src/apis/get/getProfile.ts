import BASE_URL from '@/constants/baseurl';

export interface ProfileResponse {
  id: string;
  email: string;
  nickname: string;
  provider: string;
  createdAt: Date;
}

export async function getProfile(): Promise<ProfileResponse> {
  try {
    const response = await BASE_URL.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching Profile:', error);
    throw new Error('Failed to fetch Profile');
  }
}
