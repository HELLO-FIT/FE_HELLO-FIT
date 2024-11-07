import React from 'react';
import { IMAGES } from '@/constants/asset';
import Image from 'next/image';

interface ImageComponentProps {
  name: keyof typeof IMAGES;
  alt?: string;
  width?: number;
  height?: number;
}

export default function ImageComponent({
  name,
  alt = '',
  width,
  height,
}: ImageComponentProps) {
  const imageSrc = IMAGES[name];

  return (
    <Image src={imageSrc} alt={alt} width={width || 24} height={height || 24} />
  );
}
