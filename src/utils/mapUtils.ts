// 유지보수
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

export const initializeKakaoMap = (
  containerId: string,
  userLocation: kakao.maps.LatLng | null
): kakao.maps.Map => {
  const container = document.getElementById(containerId);
  const options = {
    center: userLocation || new kakao.maps.LatLng(37.5665, 126.978),
    level: 3,
  };
  return new kakao.maps.Map(container as HTMLElement, options);
};
