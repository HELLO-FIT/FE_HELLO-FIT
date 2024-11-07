import React from 'react';
import { ICONS } from '@/constants/asset';
import Image from 'next/image';

export interface IconComponentProps {
  name: keyof typeof ICONS;
  size?: 'l' | 'm' | 's' | 'custom';
  alt?: string;
  width?: number;
  height?: number;
}

const DEFAULT_SIZES = { l: 24, m: 20, s: 16, custom: 24 };

export default function IconComponent({
  name,
  size = 'custom',
  alt = '',
  width,
  height,
}: IconComponentProps) {
  const iconSrc = ICONS[name];

  if (typeof iconSrc === 'string' && size === 'custom') {
    return (
      <Image
        src={iconSrc}
        alt={alt}
        width={width || DEFAULT_SIZES.custom}
        height={height || DEFAULT_SIZES.custom}
      />
    );
  }

  const iconSizeSrc =
    typeof iconSrc !== 'string' ? iconSrc[size as 'l' | 'm' | 's'] : iconSrc;
  const imgSize = width || height || DEFAULT_SIZES[size];

  return <Image src={iconSizeSrc} alt={alt} width={imgSize} height={imgSize} />;
}
