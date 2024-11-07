import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './GNB.module.scss';
import { ICONS } from '@/constants/asset';
import IconComponent from '@/components/Asset/Icon';

export default function GNB() {
  const router = useRouter();

  const navItems = [
    {
      href: '/map',
      icon: { active: 'markerFull', inactive: 'markerEmpty' },
      label: '지도',
    },
    {
      href: '/lesson',
      icon: { active: 'gridFull', inactive: 'gridEmpty' },
      label: '강좌',
    },
    {
      href: '/likelist',
      icon: { active: 'heartFull', inactive: 'heartEmpty' },
      label: '찜',
    },
    {
      href: '/noti',
      icon: { active: 'bellFull', inactive: 'bellEmpty' },
      label: '알림',
    },
  ];

  return (
    <nav className={styles.gnb}>
      {navItems.map(item => {
        const isActive = router.asPath === item.href;
        const iconName = isActive ? item.icon.active : item.icon.inactive;
        const labelClass = isActive ? styles.activeLabel : styles.label;

        return (
          <Link href={item.href} key={item.href} passHref>
            <div className={styles.navItem}>
              <IconComponent
                name={iconName as keyof typeof ICONS}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className={labelClass}>{item.label}</p>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
