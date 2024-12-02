import { useEffect, useState } from 'react';
import styles from './ReviewWrite.module.scss';
import { getProfile, ProfileResponse } from '@/apis/get/getProfile';
import { formattedDate } from '@/utils/formatDate';
import IconComponent from '@/components/Asset/Icon';
import Rating from './Rating';
import CustomButton from '@/components/Button/CustomButton';
import { usePopup } from '@/utils/popupUtils';
import { postNormalReview, postSpecialReview } from '@/apis/post/postReview';
import router from 'next/router';
import { hideNickname } from '@/utils/hideNickname';

export default function ReviewWrite({
  businessId,
  serialNumber,
}: {
  businessId: string;
  serialNumber?: string;
}) {
  const [profile, setProfile] = useState<ProfileResponse>();
  const [text, setText] = useState<string>('');
  const [rating, setRating] = useState<number>(1);
  const { openPopup } = usePopup();

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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    if (inputText.length <= 100) {
      setText(inputText);
    }
  };

  const handleSubmit = async () => {
    if (text.length < 15) {
      openPopup({
        content: '내용은 15자 이상 작성해 주세요.',
      });
      return;
    }

    if (rating === 0) {
      openPopup({
        content: '별점을 입력해 주세요.',
      });
      return;
    }

    try {
      const reviewData = {
        score: rating,
        content: text,
      };

      let response;

      if (serialNumber) {
        response = await postNormalReview(businessId, serialNumber, reviewData);
      } else {
        response = await postSpecialReview(businessId, reviewData);
      }

      if (response.success) {
        openPopup({
          content: '후기 작성을 완료했어요.',
        });
        setText('');
        setRating(1);
        router.back();
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.log('리뷰 작성 중 문제가 발생했습니다.', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.writerContainer}>
        <IconComponent name="profile2" size="custom" width={32} height={32} />
        <p className={styles.nickname}>
          {profile?.nickname && hideNickname(profile?.nickname)}
        </p>
        <p className={styles.date}>{formattedDate(new Date())}</p>
      </div>
      <div className={styles.textareaContainer}>
        <textarea
          className={styles.textarea}
          placeholder="시설 이용 후기를 작성해주세요."
          value={text}
          onChange={handleTextChange}
        />
        {!text.length && (
          <span className={styles.message}>
            *주의: 사실이 아닌 내용, 욕설, 비방 목적 혹은 명예 훼손성 내용은
            작성 시 삭제 처리 될 수 있습니다.
          </span>
        )}
      </div>
      <div className={styles.messageContainer}>
        <p className={styles.message}>최소 15자 이상 작성</p>
        <span className={serialNumber ? styles.counter : styles.counterSP}>
          {text.length}
          <p className={styles.total}>/ 100</p>
        </span>
      </div>
      <div className={styles.ratingContainer}>
        <Rating
          onRatingChange={rating => setRating(rating)}
          currentRating={rating}
          isNormal={serialNumber ? true : false}
        />
      </div>
      <div className={styles.btnContainer}>
        <CustomButton label="작성 완료" onClick={handleSubmit} />
      </div>
    </div>
  );
}
