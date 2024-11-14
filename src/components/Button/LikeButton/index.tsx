import React, { useState, useEffect } from 'react';
import IconComponent from '@/components/Asset/Icon';
import { LikeButtonProps } from './LikeButton.types';
import { putFavorite } from '@/apis/put/putFavorite';
import { getFavorites } from '@/apis/get/getFavorites';

export default function LikeButton({
  businessId,
  serialNumber,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const favorites = await getFavorites();
        const isFavorite = favorites.some(
          item =>
            item.businessId === businessId && item.serialNumber === serialNumber
        );
        setIsLiked(isFavorite);
      } catch (err) {
        console.log('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    checkIfLiked();
  }, [businessId, serialNumber]);

  const handleClick = async () => {
    try {
      const result = await putFavorite(businessId, serialNumber);

      if (result.success) {
        setIsLiked(!isLiked);
      }
    } catch (err) {
      console.log('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <IconComponent
        name={isLiked ? 'blueHeartFull' : 'blueHeartBlank'}
        width={44}
        height={44}
      />
    </div>
  );
}
