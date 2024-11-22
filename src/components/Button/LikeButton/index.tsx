import React, { useState, useEffect } from 'react';
import IconComponent from '@/components/Asset/Icon';
import { LikeButtonProps } from './LikeButton.types';
import { putNomalFavorite, putSpecialFavorite } from '@/apis/put/putFavorite';
import { getFavorites } from '@/apis/get/getFavorites';
import { useModal } from '@/utils/modalUtils';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import { ICONS } from '@/constants/asset';

export default function LikeButton({
  businessId,
  serialNumber,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const toggle = useRecoilValue(toggleState);
  const { openModal } = useModal();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return;
    }

    const checkIfLiked = async () => {
      try {
        const favorites = await getFavorites();
        const isFavorite = favorites.some(
          item =>
            item.businessId === businessId && item.serialNumber === serialNumber
        );
        setIsLiked(isFavorite);
      } catch (err) {
        console.log('찜한 항목을 확인할 수 없습니다.', err);
      }
    };

    checkIfLiked();
  }, [businessId, serialNumber]);

  const handleClick = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      showModal();
      return;
    }

    try {
      let result;

      if (toggle === 'general') {
        if (!serialNumber) {
          console.error('general 상태에서는 serialNumber가 필요합니다.');
          return;
        }
        result = await putNomalFavorite(businessId, serialNumber);
      } else {
        result = await putSpecialFavorite(businessId);
      }

      if (result.success) {
        setIsLiked(!isLiked);
      }
    } catch (err) {
      console.log('네트워크 오류가 발생했습니다. 다시 시도해주세요.', err);
    }
  };

  const showModal = () => {
    openModal({
      content: '로그인',
      onConfirm: () => (window.location.href = '/'),
    });
  };

  let iconName: keyof typeof ICONS = 'blueHeartBlank';

  if (isLiked && toggle === 'general') {
    iconName = 'blueHeartFull';
  } else if (!isLiked && toggle === 'general') {
    iconName = 'blueHeartBlank';
  } else if (isLiked && toggle !== 'general') {
    iconName = 'greenHeartFull';
  }

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <IconComponent name={iconName} width={44} height={44} />
    </div>
  );
}
