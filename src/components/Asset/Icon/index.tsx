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

type IconRecord = { l?: string; m?: string; s?: string };

function isSizeRecord(icon: unknown): icon is IconRecord {
  return (
    typeof icon === 'object' &&
    icon !== null &&
    ('l' in icon || 'm' in icon || 's' in icon)
  );
}

export default function IconComponent({
  name,
  size = 'custom',
  alt = '',
  width,
  height,
}: IconComponentProps) {
  const iconSrc = ICONS[name];

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found in ICONS`);
    return null;
  }

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

  if (isSizeRecord(iconSrc)) {
    // 기본 크기 `m`으로 fallback 처리
    const iconSizeSrc = iconSrc[size] || iconSrc.m;
    const imgSize = width || height || DEFAULT_SIZES[size];
    return (
      <Image src={iconSizeSrc} alt={alt} width={imgSize} height={imgSize} />
    );
  }

  // 아이콘 미등록 경우
  console.warn(`Icon "${name}" with size "${size}" not found`);
  return null;
}
