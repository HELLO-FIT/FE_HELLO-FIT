import BASE_URL from '@/constants/baseurl';
import { AxiosError } from 'axios';

export interface NotificationsResponse {
  success: boolean;
  message: string;
}

export async function putNotifications(
  id: string
): Promise<NotificationsResponse> {
  try {
    const response = await BASE_URL.put(`/notifications/${id}`);

    if (response.status === 204) {
      return {
        success: true,
        message: '알림 확인 처리 성공',
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

      if (status === 401) {
        return {
          success: false,
          message: '로그인이 필요합니다.',
        };
      }
    }

    console.error('Error processing notification verification:', error);
    throw new Error('Error processing notification verification');
  }
}
