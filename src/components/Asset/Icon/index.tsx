import React from 'react';
import { ICONS } from '@/constants/asset';
import Image from 'next/image';

interface IconComponentProps {
  name: keyof typeof ICONS;
  size?: 'l' | 'm' | 's' | 'fixed';
  alt?: string;
  width?: number;
  height?: number;
}

const DEFAULT_SIZES = { l: 24, m: 20, s: 16, fixed: 24 };

export default function IconComponent({
  name,
  size = 'fixed',
  alt = '',
  width,
  height,
}: IconComponentProps) {
  const iconSrc = ICONS[name];

  if (typeof iconSrc === 'string' && size === 'fixed') {
    return (
      <Image
        src={iconSrc}
        alt={alt}
        width={width || DEFAULT_SIZES.fixed}
        height={height || DEFAULT_SIZES.fixed}
      />
    );
  }

  const iconSizeSrc =
    typeof iconSrc !== 'string' ? iconSrc[size as 'l' | 'm' | 's'] : iconSrc;
  const imgSize = width || height || DEFAULT_SIZES[size];

  return <img src={iconSizeSrc} alt={alt} width={imgSize} height={imgSize} />;
}
