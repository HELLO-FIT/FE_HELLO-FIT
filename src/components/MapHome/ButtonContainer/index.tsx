import React from 'react';
import LikeButton from '@/components/Button/LikeButton';
import CustomButton from '@/components/Button/CustomButton';
import styles from './ButtonContainer.module.scss';
import { LikeButtonProps } from '@/components/Button/LikeButton/LikeButton.types';

export default function ButtonContainer({
  businessId,
  serialNumber,
}: LikeButtonProps) {
  const handleRedirect = () => {
    window.open('https://svoucher.kspo.or.kr/main.do', '_blank');
  };

  return (
    <div className={styles.container}>
      <div className={styles.likeButton}>
        <LikeButton businessId={businessId} serialNumber={serialNumber} />
      </div>
      <div className={styles.customButton}>
        <CustomButton label="신청하러 가기" onClick={handleRedirect} />
      </div>
    </div>
  );
}
