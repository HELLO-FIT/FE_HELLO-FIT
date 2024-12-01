import React, { useEffect, useState } from 'react';
import { RatingProps } from './Rating.types';
import IconComponent from '@/components/Asset/Icon';
import styles from './Rating.module.scss';

export default function Rating({ currentRating, onRatingChange }: RatingProps) {
  const [rating, setRating] = useState(currentRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const totalStars = 5;

  useEffect(() => {
    setRating(currentRating);
  }, [currentRating]);

  const handleMouseEnter = (index: number) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    const newRating = index;
    setRating(newRating);
    onRatingChange(newRating);
  };

  const getStarIcon = (index: number) => {
    const ratingValue = hoverRating || rating;

    if (index > Math.floor(ratingValue)) {
      return 'starEmpty';
    } else if (
      index === Math.floor(ratingValue) + 0.5 ||
      (ratingValue % 1 !== 0 && index === Math.floor(ratingValue) + 1)
    ) {
      return 'starHalf';
    } else {
      return 'starFull';
    }
  };

  return (
    <div>
      {Array.from({ length: totalStars }, (_, index) => (
        <div
          onMouseEnter={() => handleMouseEnter(index + 1)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index + 1)}
          key={index}
          className={styles.starWrapper}
        >
          <IconComponent name={getStarIcon(index + 1)} width={30} height={30} />
        </div>
      ))}
    </div>
  );
}
