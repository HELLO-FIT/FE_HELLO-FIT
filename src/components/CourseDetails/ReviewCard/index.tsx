import React from 'react';
import styles from './ReviewCard.module.scss';
import IconComponent from '@/components/Asset/Icon';

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
    name: '김*현',
    date: '2024. 2. 3',
    rating: 4,
    content: '시설 깔끔하고 강사님도 친절해요',
  },
  {
    id: 2,
    name: '김*현',
    date: '2024. 2. 3',
    rating: 5,
    content: '시설 깔끔하고 강사님도 친절해요',
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
      <h2 className={styles.title}>시설 리뷰 3</h2>
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
