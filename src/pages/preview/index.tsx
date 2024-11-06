import React from 'react';
import IconComponent from '@/components/Asset/Icon';
import ToggleButton from '@/components/ToggleButton';
import Header from '@/components/Header';
import CustomButton from '@/components/Button/CustomButton';
import LikeButton from '@/components/Button/LikeButton';
import ButtonContainer from '@/components/ButtonContainer';
import SportButton from '@/components/Button/SportButton';
import SportButtonList from '@/components/SportButtonList';
import styles from './preview.module.scss';

export default function Preview() {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Component Preview</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Icon Preview</h2>
        <p>Sizes: Small, Medium, Large</p>
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
        <h2 className={styles.sectionTitle}>Header</h2>
        <Header />
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
        <h2 className={styles.sectionTitle}>Button Container</h2>
        <ButtonContainer />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sport Button</h2>
        <SportButton icon={'/icon/custom/logo-blue.svg'} label="테스트" />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sport Button List</h2>
        <SportButtonList />
      </section>
    </div>
  );
}
