import React, { useState } from 'react';
import IconComponent from '@/components/Asset/Icon';

export default function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <IconComponent
        name={isLiked ? 'blueHeartFull' : 'blueHeartBlank'}
        width={44}
        height={44}
      />
    </div>
  );
}
