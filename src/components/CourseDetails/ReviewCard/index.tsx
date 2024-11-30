import React from 'react';
import styles from './ReviewCard.module.scss';
import IconComponent from '@/components/Asset/Icon';

// api 확인 전이라 임의로 작성해서 types로 분리하지않음
interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  content: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: '조*진',
    date: '2024. 2. 3',
    rating: 4,
    content: '세상에 프론트의 신이 있다면',
  },
  {
    id: 2,
    name: '송*진',
    date: '2024. 2. 3',
    rating: 1,
    content: '송영진이 누구냐면 케이티 소닉붐의 감독인데,',
  },
  {
    id: 3,
    name: '김*현',
    date: '2024. 2. 3',
    rating: 3,
    content: '시설 깔끔하고 강사님도 친절해요',
  },
];

export default function ReviewCard() {
  return (
    <div className={styles.reviewWrapper}>
      <div className={styles.reviewHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.reviewTitle}>시설 후기</span>
          <div className={styles.ratingSummary}>
            <IconComponent name="BlueStar" size="custom" width={16} height={16} />
            <span className={styles.averageRating}>4.0</span>
            <span className={styles.reviewCount}>(3)</span>
          </div>
        </div>
        <button className={styles.writeReviewButton}>후기 작성</button>
      </div>

      <div className={styles.reviewContainer}>
        <div className={styles.card}>
          {reviews.map(review => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.header}>
                <div className={styles.profile}>
                  <IconComponent
                    name="profile"
                    size="custom"
                    width={40}
                    height={40}
                  />
                  <div className={styles['name-date']}>
                    <span className={styles.name}>{review.name}</span>
                    <span className={styles.date}>{review.date}</span>
                  </div>
                </div>
                <IconComponent
                  name="meatBall"
                  size="custom"
                  width={20}
                  height={20}
                />
              </div>
              <div className={styles.rating}>
                {Array.from({ length: review.rating }, (_, index) => (
                  <IconComponent
                    key={`filled-${index}`}
                    name="BlueStar"
                    size="custom"
                  />
                ))}
                {Array.from({ length: 5 - review.rating }, (_, index) => (
                  <IconComponent
                    key={`empty-${index}`}
                    name="defaultStar"
                    size="custom"
                  />
                ))}
              </div>
              <p className={styles.content}>{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
