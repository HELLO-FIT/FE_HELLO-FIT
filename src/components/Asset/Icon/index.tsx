import React from 'react';
import Image from 'next/image';
import { ICONS } from '@/constants/asset';

interface IconComponentProps {
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

  // `size`가 'custom'일 때 별도로 처리
  if (typeof iconSrc === 'string' || size === 'custom') {
    return (
      <Image
        src={iconSrc as string}
        alt={alt}
        width={width || DEFAULT_SIZES.custom}
        height={height || DEFAULT_SIZES.custom}
      />
    );
  }

  // 'l', 'm', 's' 크기에서만 `Record` 접근
  const iconSizeSrc = (iconSrc as Record<'l' | 'm' | 's', string>)[size as 'l' | 'm' | 's'];
  const imgSize = width || height || DEFAULT_SIZES[size];

  return <Image src={iconSizeSrc} alt={alt} width={imgSize} height={imgSize} />;
}
