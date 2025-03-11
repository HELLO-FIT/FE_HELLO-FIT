export const simplifyRegionName = (fullRegionName: string): string => {
  // 세종특별자치시는 예외적으로 "세종 세종시"로 변환
  if (fullRegionName.includes('세종특별자치시')) {
    return '세종 세종시';
  }

  return (
    fullRegionName
      .replace(/(특별시|광역시|특별자치도|특별자치시)/g, '') // "광역시" 등 제거
      .replace(/청$/, '') // "청" 제거
      .match(/.+?(?:시|군|구)(?:\s.+?(?:구|군))?/)?.[0] || fullRegionName
  );
};
