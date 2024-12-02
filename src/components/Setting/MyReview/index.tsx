import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './MyReview.module.scss';
import { formattedDate } from '@/utils/formatDate';
import { getMyReviews, MyReviewsResponse } from '@/apis/get/getMyReviews';
import LoadingSpinner from '@/components/LoadingSpinner';
import IconComponent from '@/components/Asset/Icon';
import { hideNickname } from '@/utils/hideNickname';
import { deleteReview } from '@/apis/delete/deleteReview';
import { useModal } from '@/utils/modalUtils';

export default function MyReview() {
  const [reviews, setReviews] = useState<MyReviewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const router = useRouter();
  const { openModal } = useModal();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getMyReviews();
        setReviews(data);
      } catch (err) {
        console.log('후기 데이터를 불러오는 데 실패했습니다.', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleFacilityClick = (businessId: string, serialNumber?: string) => {
    router.push(`/details/${businessId}/${serialNumber || ''}`);
  };

  const handleModifyReview = (
    reviewId: string,
    businessId: string,
    serialNumber?: string
  ) => {
    router.push(
      `/details/${businessId}/${(serialNumber as string) || ''}/review/${reviewId}`
    );
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const result = await deleteReview(reviewId);

      if (result.success) {
        router.reload();
      }
    } catch (err) {
      console.error('후기 삭제 도중 문제가 발생했습니다.', err);
    }
  };

  const deleteReviewModal = (reviewId: string) => {
    openModal({
      content: '후기를 삭제',
      onConfirm: () => handleDeleteReview(reviewId),
    });
  };

  const toggleDropdown = (reviewId: string) => {
    setDropdownOpen(prev => (prev === reviewId ? null : reviewId));
  };

  return (
    <div className={styles.container}>
      {reviews.length > 0 ? (
        <div className={styles.reviewList}>
          <h2 className={styles.title}>총 {reviews.length}건</h2>
          <div className={styles.bar} />
          <div className={styles.cardContainer}>
            {reviews.map(review => (
              <div key={review.id} className={styles.reviewCard}>
                <h3
                  className={styles.facilityName}
                  onClick={() =>
                    handleFacilityClick(review.businessId, review.serialNumber)
                  }
                >
                  {review.facilityName}
                </h3>
                <div className={styles.profile}>
                  <div className={styles.nameDate}>
                    <IconComponent
                      name="profile"
                      size="custom"
                      width={32}
                      height={32}
                    />
                    <p className={styles.name}>
                      {hideNickname(review.nickname)}
                    </p>
                    <div className={styles.rating}>
                      {Array.from({ length: review.score }, (_, index) => (
                        <IconComponent
                          key={`filled-${review.id}-${index}`}
                          name={review.serialNumber ? 'starFull' : 'starFullSP'}
                          width={14}
                          height={14}
                        />
                      ))}
                      {Array.from({ length: 5 - review.score }, (_, index) => (
                        <IconComponent
                          key={`empty-${review.id}-${index}`}
                          name="starEmpty"
                          width={14}
                          height={14}
                        />
                      ))}
                    </div>
                    <span className={styles.date}>
                      {formattedDate(review.createdAt)}
                    </span>
                  </div>
                  <div className={styles.meatBallWrapper}>
                    <div
                      className={styles.meatball}
                      onClick={() => toggleDropdown(review.id)}
                    >
                      <IconComponent
                        name="meatBall"
                        size="custom"
                        width={20}
                        height={20}
                      />
                    </div>
                    {dropdownOpen === review.id && (
                      <div className={styles.dropdown}>
                        <button
                          className={styles.dropdownButton}
                          onClick={() =>
                            handleModifyReview(
                              review.id,
                              review.businessId,
                              review.serialNumber
                            )
                          }
                        >
                          수정하기
                        </button>
                        <button
                          className={styles.dropdownButton}
                          onClick={() => deleteReviewModal(review.id)}
                        >
                          삭제하기
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className={styles.content}>{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyContainer}>
          <IconComponent
            name="emptyReview"
            width={48}
            height={48}
            alt="emptyReview"
          />
          <p className={styles.mainText}>작성한 후기가 없어요.</p>
        </div>
      )}
    </div>
  );
}
