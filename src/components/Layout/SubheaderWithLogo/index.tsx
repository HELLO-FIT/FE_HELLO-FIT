import { useRouter } from 'next/router';
import IconComponent from '@/components/Asset/Icon';
import styles from './SubheaderWithLogo.module.scss';
import { SubheaderWithLogoProps } from './SubheaderWithLogo.types';

export default function SubheaderWithLogo({
  showMenu = true,
}: SubheaderWithLogoProps) {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/map');
  };

  const handleMenuClick = () => {
    if (showMenu) {
      router.push('/setting');
    }
  };

  return (
    <header className={styles.container}>
      <div className={styles.btnContainer} onClick={handleLogoClick}>
        <IconComponent name="logoBlue" width={60} height={34} />
      </div>
      <div
        className={`${styles.btnContainer} ${showMenu ? styles.show : ''}`}
        onClick={handleMenuClick}
      >
        {showMenu && <IconComponent name="menu" size="l" />}
      </div>
    </header>
  );
}
