import { useCallback, useState } from 'react';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import styles from '../MapContainer.module.scss';

type UsePositionButtonProps = {
  map: kakao.maps.Map | null;
  userLocation: kakao.maps.LatLng | null;
  setSelectedLocation: (location: kakao.maps.LatLng | null) => void;
  updateLocalCodeAndFetchFacilities: (
    latitude: number,
    longitude: number
  ) => void;
  fetchFacilitiesBySport: (sport?: string | null) => void;
};

export default function usePositionButton({
  map,
  userLocation,
  setSelectedLocation,
  updateLocalCodeAndFetchFacilities,
  fetchFacilitiesBySport,
}: UsePositionButtonProps) {
  const toggle = useRecoilValue(toggleState);
  const [userMarker, setUserMarker] = useState<kakao.maps.Marker | null>(null);

  // 현재 위치로 이동하고, 사용자 마커도 업데이트
  const moveToUserLocation = useCallback(() => {
    if (map && userLocation) {
      map.setCenter(userLocation);
      setSelectedLocation(userLocation);

      updateLocalCodeAndFetchFacilities(
        userLocation.getLat(),
        userLocation.getLng()
      );
      fetchFacilitiesBySport();

      // 기존 마커가 있다면 제거 후 새로 생성
      if (userMarker) {
        userMarker.setMap(null);
      }

      const newMarker = new kakao.maps.Marker({
        position: userLocation,
        image: new kakao.maps.MarkerImage(
          toggle === 'special'
            ? '/image/my-location-special.svg'
            : '/image/my-location.svg',
          new kakao.maps.Size(28, 28),
          { offset: new kakao.maps.Point(14, 14) }
        ),
        map,
      });

      setUserMarker(newMarker);
    } else {
      console.warn('지도 객체 또는 사용자 위치가 사용 가능하지 않습니다.');
    }
  }, [
    map,
    userLocation,
    userMarker,
    setSelectedLocation,
    updateLocalCodeAndFetchFacilities,
    fetchFacilitiesBySport,
    toggle,
  ]);

  return {
    moveToUserLocation,
    buttonProps: {
      className: classNames(styles.positionButton, {
        [styles['position-special']]: toggle === 'special',
      }),
      src:
        toggle === 'special'
          ? '/image/position-special.svg'
          : '/image/position.svg',
      alt: '현재 위치로 돌아가기',
    },
  };
}
