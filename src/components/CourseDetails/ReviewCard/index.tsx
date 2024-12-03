import React, { useEffect, useRef, useState } from 'react';
import styles from './ReviewCard.module.scss';
import IconComponent from '@/components/Asset/Icon';
import { ReviewCardProps } from './ReviewCard.types';
import router from 'next/router';
import { formattedDate } from '@/utils/formatDate';
import { hideNickname } from '@/utils/hideNickname';
import { getProfile, ProfileResponse } from '@/apis/get/getProfile';
import { deleteReview } from '@/apis/delete/deleteReview';
import { useModal } from '@/utils/modalUtils';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useRecoilValue } from 'recoil';
import { authState } from '@/states/authState';

export default function ReviewCard({
  businessId,
  serialNumber,
  averageScore,
  reviews,
  isNormal,
}: ReviewCardProps & { isNormal: boolean }) {
  const [profile, setProfile] = useState<ProfileResponse>();
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();
  const { isLoggedIn } = useRecoilValue(authState);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.log('프로필 정보를 가져오는데 실패했습니다.', err);
      }
    };

    if (isLoggedIn) {
      fetchProfile();
    }
  }, []);

  const handleOpenReviewWrite = () => {
    router.push(`/details/${businessId}/${serialNumber || ''}/review`);
  };

  const handleModifyReview = (reviewId: string) => {
    router.push(
      `/details/${businessId}/${serialNumber || ''}/review/${reviewId}`
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

  // 작성한 리뷰가 있는지 확인
  const hasReviewed = reviews.some(review => review.userId === profile?.id);

  const toggleDropdown = (reviewId: string) => {
    setDropdownOpen(prev => (prev === reviewId ? null : reviewId));
  };

  useOutsideClick(dropdownRef, () => setDropdownOpen(null));

  return (
    <div className={styles.reviewWrapper}>
      <div className={styles.reviewHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.reviewTitle}>시설 후기</span>
          <div className={styles.ratingSummary}>
            <IconComponent
              name={isNormal ? 'starFull' : 'starFullSP'}
              width={14}
              height={14}
            />
            <span className={styles.averageRating}>{averageScore}</span>
            <span className={styles.reviewCount}>({reviews.length})</span>
          </div>
        </div>
        {isLoggedIn && !hasReviewed && (
          <button
            className={
              isNormal ? styles.writeReviewButton : styles.writeReviewButtonSP
            }
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
                      {Array.from(
                        { length: Math.floor(review.score) },
                        (_, index) => (
                          <IconComponent
                            key={`filled-${review.id}-${index}`}
                            name={isNormal ? 'starFull' : 'starFullSP'}
                            width={14}
                            height={14}
                          />
                        )
                      )}
                      {review.score % 1 !== 0 && (
                        <IconComponent
                          key={`half-${review.id}`}
                          name={isNormal ? 'starHalf' : 'starHalfSP'}
                          width={14}
                          height={14}
                        />
                      )}
                      {Array.from(
                        { length: 5 - Math.ceil(review.score) },
                        (_, index) => (
                          <IconComponent
                            key={`empty-${review.id}-${index}`}
                            name="starEmpty"
                            width={14}
                            height={14}
                          />
                        )
                      )}
                    </div>
                    <span className={styles.date}>
                      {formattedDate(review.createdAt)}
                    </span>
                  </div>
                </div>
                {review.userId === profile?.id && (
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
                      <div className={styles.dropdown} ref={dropdownRef}>
                        <button
                          className={styles.dropdownButton}
                          onClick={() => handleModifyReview(review.id)}
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
                )}
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
