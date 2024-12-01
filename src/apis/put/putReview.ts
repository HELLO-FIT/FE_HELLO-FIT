import BASE_URL from '@/constants/baseurl';
import { AxiosError } from 'axios';
import { ReviewRequest, ReviewResponse } from '../post/postReview';

export async function putReview(
  reviewId: string,
  reviewData: ReviewRequest
): Promise<ReviewResponse> {
  try {
    const response = await BASE_URL.put(`/reviews/${reviewId}`, reviewData);

    if (response.status === 204) {
      return {
        success: true,
        message: '후기 수정 성공',
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

    console.error('리뷰 수정 중 오류 발생:', error);
    throw new Error('리뷰 수정 실패');
  }
}
