import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { toggleState } from '@/states/toggleState';
import styles from './GNB.module.scss';
import { ICONS } from '@/constants/asset';
import IconComponent from '@/components/Asset/Icon';
import classNames from 'classnames';

export default function GNB() {
  const router = useRouter();
  const toggle = useRecoilValue(toggleState);
  const [iconState, setIconState] = useState<string>('');
  const [labelColor, setLabelColor] = useState<string>(styles.label);

  useEffect(() => {
    if (toggle === 'special') {
      setIconState('special');
      setLabelColor(styles.specialLabel);
    } else {
      setIconState('general');
      setLabelColor(styles.generalLabel);
    }
  }, [toggle]);

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
        const isActive =
          router.asPath === item.href ||
          (item.href === '/lesson' &&
            (router.asPath.startsWith('/lesson?tab=lesson') ||
              router.asPath.startsWith('/lesson?tab=popular')));

        const iconName = isActive
          ? iconState === 'special'
            ? item.icon.activeSpecial
            : item.icon.activeGeneral
          : item.icon.inactive;

        return (
          <Link href={item.href} key={item.href} passHref>
            <div className={styles.navItem}>
              <IconComponent
                name={iconName as keyof typeof ICONS}
                alt={item.label}
                width={24}
                height={24}
              />
              <p
                className={classNames({
                  [styles.label]: !isActive,
                  [labelColor]: isActive,
                })}
              >
                {item.label}
              </p>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
