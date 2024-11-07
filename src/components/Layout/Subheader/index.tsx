import { useRouter } from 'next/router';
import IconComponent from '@/components/Asset/Icon';
import { SubheaderProps } from './Subheader.types';
import styles from './Subheader.module.scss';

export default function Subheader({ subheaderText }: SubheaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <header className={styles.container}>
      <div className={styles.backBtn} onClick={handleBackClick}>
        <IconComponent name="left" size="l" />
      </div>
      <p className={styles.title}>{subheaderText}</p>
      <div className={styles.empty} />
    </header>
  );
}
