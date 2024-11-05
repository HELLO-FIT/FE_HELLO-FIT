import IconComponent from '../Asset/Icon';
import styles from './Landing.module.scss';

export default function Landing() {
  return (
    <div className={styles.background}>
      <div className={styles.logoContainer}>
        <p className={styles.subtitle}>모두의 스포츠 시설 서비스</p>
        <IconComponent name="logo" alt="logo" width={115.3} height={37.752} />
        <div className={styles.logo}>
          <IconComponent
            name="landingDumbbell"
            alt="dumbbell icon"
            width={36}
            height={36}
          />
        </div>
      </div>
      <div className={styles.btnContainer}>
        <div className={styles.kakaoBtn} role="button" tabIndex={0}>
          <div className={styles.kakaoIcon}>
            <IconComponent
              name="landingKakao"
              alt="dumbbell icon"
              width={24}
              height={24}
            />
          </div>
          카카오로 계속하기
        </div>
        <div className={styles.serviceBtn} role="button" tabIndex={0}>
          서비스 둘러보기
        </div>
      </div>
    </div>
  );
}
