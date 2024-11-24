// 유지보수
export const simplifyRegionName = (fullRegionName: string): string => {
  return (
    fullRegionName
      .replace(/(특별시|광역시|특별자치도|특별자치시)/g, '')
      .replace(/청$/, '')
      .match(/.+?(시|군|구)/)?.[0] || fullRegionName
  );
};

export const createMarkerImage = (src: string): kakao.maps.MarkerImage => {
  return new kakao.maps.MarkerImage(src, new kakao.maps.Size(28, 28), {
    offset: new kakao.maps.Point(14, 14),
  });
};

export const loadKakaoMapScript = (KAKAO_MAP_KEY: string) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;

  document.head.appendChild(script);

  return new Promise<void>((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Kakao Maps API'));
  });
};
