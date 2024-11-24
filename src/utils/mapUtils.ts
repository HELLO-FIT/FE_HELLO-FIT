import { useEffect, useState } from 'react';

export default function useKakaoMap(
  KAKAO_MAP_KEY: string,
  userLocation: kakao.maps.LatLng | null
) {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  useEffect(() => {
    const loadKakaoMapScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;

      document.head.appendChild(script);

      return new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Kakao Maps API'));
      });
    };

    loadKakaoMapScript()
      .then(() => {
        kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: userLocation || new kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          };
          const kakaoMap = new kakao.maps.Map(container as HTMLElement, options);
          setMap(kakaoMap);
        });
      })
      .catch(console.error);
  }, [KAKAO_MAP_KEY, userLocation]);

  return { map, setMap };
}
