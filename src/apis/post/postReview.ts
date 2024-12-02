import { AxiosError } from 'axios';
import BASE_URL from '@/constants/baseurl';

export interface ReviewRequest {
  score: number;
  content: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
}

/* 일반 회원 */
export async function postNormalReview(
  businessId: string,
  serialNumber: string,
  reviewData: ReviewRequest
): Promise<ReviewResponse> {
  try {
    const response = await BASE_URL.post(
      `/normal/facilities/${businessId}/${serialNumber}/review`,
      reviewData
    );

    if (response.status === 201) {
      return {
        success: true,
        message: '리뷰 작성 성공',
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
      } else if (status === 409) {
        return {
          success: false,
          message: '이미 리뷰를 작성하셨습니다.',
        };
      }
    }

    console.error('리뷰 작성 중 오류 발생:', error);
    throw new Error('리뷰 작성 실패');
  }
}

/* 특수 회원 */
export async function postSpecialReview(
  businessId: string,
  reviewData: ReviewRequest
): Promise<ReviewResponse> {
  try {
    const response = await BASE_URL.post(
      `/special/facilities/${businessId}/review`,
      reviewData
    );

    if (response.status === 201) {
      return {
        success: true,
        message: '리뷰 작성 성공',
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
      } else if (status === 409) {
        return {
          success: false,
          message: '이미 리뷰를 작성하셨습니다.',
        };
      }
    }

    console.error('리뷰 작성 중 오류 발생:', error);
    throw new Error('리뷰 작성 실패');
  }
}
