import React from 'react';
import { IMAGES, SPORTSIMAGES } from '@/constants/asset';
import Image from 'next/image';

interface ImageComponentProps {
  name: keyof typeof SPORTSIMAGES;
  alt?: string;
  width?: number;
  height?: number;
  rank: number;
}

export default function SportsImageComponent({
  name,
  alt = '',
  width = 152,
  height = 110,
  rank,
}: ImageComponentProps) {
  const imageSrc = SPORTSIMAGES[name] || SPORTSIMAGES['기타종목'];
  const badgeSrc = IMAGES[`badge${rank}` as keyof typeof IMAGES];

  return (
    <div style={{ position: 'relative', width, height }}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        style={{ borderRadius: '10px' }}
      />
      {badgeSrc && (
        <Image
          src={badgeSrc}
          alt={`Badge ${rank}`}
          width={37}
          height={50}
          style={{
            position: 'absolute',
            top: '5px',
            left: '5px',
          }}
        />
      )}
    </div>
  );
}
