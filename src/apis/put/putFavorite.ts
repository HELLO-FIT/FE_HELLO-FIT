import BASE_URL from '@/constants/baseurl';
import { AxiosError } from 'axios';

export interface FavoriteResponse {
  success: boolean;
  message: string;
}

export async function putFavorite(
  businessId: string,
  serialNumber: string
): Promise<FavoriteResponse> {
  try {
    const response = await BASE_URL.put(
      `/normal/facilities/${businessId}/${serialNumber}/favorite`
    );

    if (response.status === 204) {
      return {
        success: true,
        message: '시설 찜하기(토글) 성공',
      };
    } else {
      return {
        success: false,
        message: '알 수 없는 오류가 발생했습니다.',
      };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const { status } = error.response || {};

      if (status === 400) {
        return {
          success: false,
          message: '유효성 검사 실패',
        };
      } else if (status === 401) {
        return {
          success: false,
          message: '로그인이 필요합니다.',
        };
      }
    }

    console.error('Error adding facility to favorites:', error);
    throw new Error('Failed to add facility to favorites');
  }
}
