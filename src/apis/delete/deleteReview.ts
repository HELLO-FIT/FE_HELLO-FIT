import BASE_URL from '@/constants/baseurl';
import { AxiosError } from 'axios';
import { ReviewResponse } from '../post/postReview';

export async function deleteReview(reviewId: string): Promise<ReviewResponse> {
  try {
    const response = await BASE_URL.delete(`/reviews/${reviewId}`);

    if (response.status === 204) {
      return {
        success: true,
        message: '후기 삭제 성공',
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

    console.error('Error processing review deletion:', error);
    throw new Error('Error processing review deletion');
  }
}
