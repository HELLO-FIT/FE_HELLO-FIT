import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import styles from './GNB.module.scss';
import { ICONS } from '@/constants/asset';
import IconComponent from '@/components/Asset/Icon';

export default function GNB() {
  const router = useRouter();
  const toggle = useRecoilValue(toggleState);

  const navItems = [
    {
      href: '/map',
      icon: {
        activeGeneral: 'markerFull',
        activeSpecial: 'markerFullSpecial',
        inactive: 'markerEmpty',
      },
      label: '지도',
    },
    {
      href: '/lesson',
      icon: {
        activeGeneral: 'gridFull',
        activeSpecial: 'gridFullSpecial',
        inactive: 'gridEmpty',
      },
      label: '강좌',
    },
    {
      href: '/likelist',
      icon: {
        activeGeneral: 'heartFull',
        activeSpecial: 'heartFullSpecial',
        inactive: 'heartEmpty',
      },
      label: '찜',
    },
    {
      href: '/noti',
      icon: {
        activeGeneral: 'bellFull',
        activeSpecial: 'bellFullSpecial',
        inactive: 'bellEmpty',
      },
      label: '알림',
    },
  ];

  return (
    <nav className={styles.gnb}>
      {navItems.map(item => {
        const isActive = router.asPath === item.href;
        const iconName = isActive
          ? toggle === 'special'
            ? item.icon.activeSpecial
            : item.icon.activeGeneral
          : item.icon.inactive;

        let labelClass = styles.label;

        if (isActive) {
          if (toggle === 'special') {
            labelClass = styles.specialLabel;
          } else if (toggle === 'general') {
            labelClass = styles.generalLabel;
          }
        }

        return (
          <Link href={item.href} key={item.href} passHref>
            <div className={styles.navItem}>
              <IconComponent
                name={iconName as keyof typeof ICONS}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className={`${styles.label} ${labelClass}`}>{item.label}</p>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
