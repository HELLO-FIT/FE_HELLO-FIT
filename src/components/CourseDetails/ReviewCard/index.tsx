import React, { useEffect, useState } from 'react';
import styles from './ReviewCard.module.scss';
import IconComponent from '@/components/Asset/Icon';
import { ReviewCardProps } from './ReviewCard.types';
import router from 'next/router';
import { formattedDate } from '@/utils/formatDate';
import { hideNickname } from '@/utils/hideNickname';
import { getProfile, ProfileResponse } from '@/apis/get/getProfile';

export default function ReviewCard({
  businessId,
  serialNumber,
  averageScore,
  reviews,
}: ReviewCardProps) {
  const [profile, setProfile] = useState<ProfileResponse>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.log('프로필 정보를 가져오는데 실패했습니다.', err);
      }
    };

    fetchProfile();
  }, []);

  const handleOpenReviewWrite = () => {
    router.push(`/details/${businessId}/${serialNumber}/review`);
  };

  // 작성한 리뷰가 있는지 확인
  const hasReviewed = reviews.some(review => review.userId === profile?.id);

  return (
    <div className={styles.reviewWrapper}>
      <div className={styles.reviewHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.reviewTitle}>시설 후기</span>
          <div className={styles.ratingSummary}>
            <IconComponent name="starFull" width={14} height={14} />
            <span className={styles.averageRating}>{averageScore}</span>
            <span className={styles.reviewCount}>({reviews.length})</span>
          </div>
        </div>
        {!hasReviewed && (
          <button
            className={styles.writeReviewButton}
            onClick={handleOpenReviewWrite}
          >
            후기 작성
          </button>
        )}
      </div>
      {reviews.length > 0 ? (
        <div className={styles.reviewContainer}>
          {reviews.map(review => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.header}>
                <div className={styles.profile}>
                  <IconComponent
                    name="profile"
                    size="custom"
                    width={32}
                    height={32}
                  />
                  <div className={styles.nameDate}>
                    <span className={styles.name}>
                      {hideNickname(review.nickname)}
                    </span>
                    <div className={styles.rating}>
                      {Array.from({ length: review.score }, (_, index) => (
                        <IconComponent
                          key={`filled-${review.id}-${index}`}
                          name="starFull"
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
                </div>
                <IconComponent
                  name="meatBall"
                  size="custom"
                  width={20}
                  height={20}
                />
              </div>
              <p className={styles.content}>{review.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyContainer}>
          <IconComponent
            name="emptyReview"
            width={20}
            height={20}
            alt="emptyReview"
          />
          <p>현재 작성된 후기가 없어요.</p>
        </div>
      )}
    </div>
  );
}
