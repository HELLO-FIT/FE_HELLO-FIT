import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import IconComponent from '../Asset/Icon';
import styles from './Landing.module.scss';
import Login from './Login';
import { authState } from '@/states/authState';

export default function Landing() {
  const { isLoggedIn } = useRecoilValue(authState);

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
        {!isLoggedIn && <Login />}
        <Link href="/map">
          <div className={styles.serviceBtn} role="button" tabIndex={0}>
            서비스 둘러보기
          </div>
        </Link>
      </div>
    </div>
  );
}
