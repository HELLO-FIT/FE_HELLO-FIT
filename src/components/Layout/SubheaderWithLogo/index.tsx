import { useRouter } from 'next/router';
import IconComponent from '@/components/Asset/Icon';
import styles from './SubheaderWithLogo.module.scss';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';

export default function SubheaderWithLogo() {
  const router = useRouter();
  const toggle = useRecoilValue(toggleState);

  const handleLogoClick = () => {
    router.push('/map');
  };

  const handleMenuClick = () => {
    router.push('/setting');
  };

  return (
    <header className={styles.container}>
      <div className={styles.btnContainer} onClick={handleLogoClick}>
        <IconComponent
          name={toggle === 'general' ? 'logoBlue' : 'logoGreen'}
          width={60}
          height={34}
        />
      </div>
      <div className={styles.btnContainer} onClick={handleMenuClick}>
        <IconComponent name="menu" size="l" />
      </div>
    </header>
  );
}
