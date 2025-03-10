import { useEffect } from 'react';
import { simplifyRegionName } from '@/utils/regionUtils'; // ✅ 기존 유틸 임포트

const useKakaoMapLoader = (
  setMap: (map: kakao.maps.Map | null) => void,
  setUserLocation: (location: kakao.maps.LatLng | null) => void,
  setSelectedRegion: (region: string) => void // ✅ 지역명 업데이트 기능 추가
) => {
  useEffect(() => {
    const loadKakaoMapScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`;

      document.head.appendChild(script);

      return new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error('카카오 지도 API 로드에 실패했습니다.'));
      });
    };

    loadKakaoMapScript()
      .then(() => {
        kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new kakao.maps.LatLng(37.5665, 126.978), // 기본 위치: 서울
            level: 6,
          };
          const kakaoMap = new kakao.maps.Map(container as HTMLElement, options);
          setMap(kakaoMap);

          // ✅ 현재 위치 가져오기 & 지역명 업데이트
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              position => {
                const userLatLng = new kakao.maps.LatLng(
                  position.coords.latitude,
                  position.coords.longitude
                );
                setUserLocation(userLatLng);
                kakaoMap.setCenter(userLatLng);

                // ✅ 역지오코딩을 이용해 현재 지역명을 가져와 드롭다운 업데이트
                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.coord2RegionCode(
                  position.coords.longitude,
                  position.coords.latitude,
                  (result, status) => {
                    if (status === kakao.maps.services.Status.OK && result.length > 0) {
                      const simplifiedRegion = simplifyRegionName(result[0].address_name); // ✅ 시/군/구까지만 변환
                      setSelectedRegion(simplifiedRegion); // ✅ 지역명 업데이트
                    }
                  }
                );
              },
              error => {
                console.error('현재 위치를 가져오는 데 실패했습니다:', error);
              }
            );
          }
        });
      })
      .catch(console.error);
  }, [setMap, setUserLocation, setSelectedRegion]); // ✅ setSelectedRegion 추가
};

export default useKakaoMapLoader;
