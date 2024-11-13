import React from 'react';
import IconComponent from '@/components/Asset/Icon';
import ToggleButton from '@/components/Button/ToggleButton';
import Notification from '@/components/Noti/Notification';
import CustomButton from '@/components/Button/CustomButton';
import LikeButton from '@/components/Button/LikeButton';
import SportButton from '@/components/Button/SportButton';
import SportButtonList from '@/components/MapHome/SportButtonList';
import styles from './preview.module.scss';
import Checkbox from '@/components/Checkbox/Checkbox';
import SearchBar from '@/components/SearchBar/SearchBar';
import Chips from '@/components/Button/Chips';
import SpecialInfoCard from '@/components/CourseDetails/SpecialInfoCard';
import DropDown from '@/components/DropDown';
import LoadingSpinner from '@/components/LoadingSpinner';

// 위치 목업 데이터
const locationOptions = [
  '서울 종로구',
  '서울 중구',
  '서울 용산구',
  '서울 성동구',
  '서울 광진구',
  '서울 동대문구',
  '서울 중랑구',
  '서울 성북구',
  '서울 강북구',
  '서울 도봉구',
  '서울 노원구',
  '서울 은평구',
  '서울 서대문구',
  '서울 마포구',
  '서울 양천구',
  '서울 강서구',
  '서울 구로구',
  '서울 금천구',
  '서울 영등포구',
  '서울 동작구',
  '서울 관악구',
  '서울 서초구',
  '서울 강남구',
  '서울 송파구',
  '서울 강동구',
];

// 스포츠 종목 목업 데이터
const sportsOptions = [
  '축구',
  '농구',
  '배구',
  '수영',
  '테니스',
  '야구',
  '탁구',
  '배드민턴',
  '유도',
  '골프',
];

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
        <SportButton iconName={'logoBlue'} label={'Sport Button Test'} />
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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Chips</h2>
        <Chips text="장애인 화장실" chipState="label" />
        <Chips text="장애인 화장실" chipState="checked" />
        <Chips text="장애인 화장실" chipState="unchecked" />
        <Chips text="복싱" chipState="sports" />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>SpecialInfoCard</h2>
        <SpecialInfoCard
          coach={data.coach}
          vehicle={data.vehicle}
          specialType={data.specialType}
          amenities={data.amenities}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Location DropDown</h2>
        <DropDown
          placeholder={'지역'}
          options={locationOptions}
          onSelect={selectedLocation =>
            console.log('선택된 위치:', selectedLocation)
          }
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sports DropDown</h2>
        <DropDown
          placeholder={'종목 선택'}
          options={sportsOptions}
          onSelect={selectedSport =>
            console.log('선택된 스포츠:', selectedSport)
          }
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Loading Spinner</h2>
        <div className={styles.spinnerContainer}>
          <LoadingSpinner />
        </div>
      </section>
    </div>
  );
}
