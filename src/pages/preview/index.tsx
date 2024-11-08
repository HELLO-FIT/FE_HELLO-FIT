import React from 'react';
import IconComponent from '@/components/Asset/Icon';
import ToggleButton from '@/components/ToggleButton';
import Schedule from '@/components/Schedule';
import Notification from '@/components/Noti/Notification';
import CustomButton from '@/components/Button/CustomButton';
import LikeButton from '@/components/Button/LikeButton';
import ButtonContainer from '@/components/ButtonContainer';
import SportButton from '@/components/Button/SportButton';
import SportButtonList from '@/components/SportButtonList';
import styles from './preview.module.scss';
import Checkbox from '@/components/Checkbox/Checkbox';
import SearchBar from '@/components/SearchBar/SearchBar';
import Chips from '@/components/Button/Chips';
import SpecialInfoCard from '@/components/CourseDetails/SpecialInfoCard';

export default function Preview() {
  const data = {
    coach: 2,
    vehicle: true,
    specialType: ['지체', '시각', '언어'],
    amenities: ['장애인 화장실', '장애인 주차구역', '휠체어 경사로'],
  };

  return (
    <div className={styles.previewPage}>
      <h1 className={styles.mainTitle}>Component Preview</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Icon Preview</h2>
        <p className={styles.description}>Sizes: Small, Medium, Large</p>
        <div className={styles.iconGroup}>
          <IconComponent name="search" size="s" />
          <IconComponent name="search" size="m" />
          <IconComponent name="search" size="l" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Custom Icon Sizes</h2>
        <div className={styles.iconGroup}>
          <IconComponent name="blueHeartBlank" width={36} height={36} />
          <IconComponent name="kakao" alt="Kakao logo" width={48} height={48} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Toggle Button</h2>
        <ToggleButton />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Schedule</h2>
        <Schedule id={1} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Notification</h2>
        <Notification
          key={1}
          isRead={false}
          onClick={() => null}
          notification={{
            id: 1,
            title: '삼성라이온즈 우승',
            content: '“게시글 내용 첫줄 15글자”',
            time: '1시간 전',
            isRead: false,
          }}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Custom Button</h2>
        <CustomButton label="텍스트를 자유롭게 써주세요." />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Like Button</h2>
        <LikeButton />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sport Button</h2>
        <SportButton icon={'/icon/custom/logo-blue.svg'} label="테스트" />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sport Button List</h2>
        <SportButtonList />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CheckBox</h2>
        <Checkbox>체크박스</Checkbox>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>SearchBar</h2>
        <SearchBar />
      </section>

      <section className={styles.sectionBlue}>
        <h2 className={styles.sectionTitle}>Chips</h2>
        <Chips text="장애인 화장실" chipState="label" />
        <Chips text="장애인 화장실" chipState="checked" />
        <Chips text="장애인 화장실" chipState="unchecked" />
        <Chips text="복싱" chipState="sports" />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>SearchBar</h2>
        <SpecialInfoCard
          coach={data.coach}
          vehicle={data.vehicle}
          specialType={data.specialType}
          amenities={data.amenities}
        />
      </section>
    </div>
  );
}
