import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import styles from '../MapContainer.module.scss';

type UsePositionButtonProps = {
  map: kakao.maps.Map | null;
  userLocation: kakao.maps.LatLng | null;
  setSelectedLocation: (location: kakao.maps.LatLng | null) => void;
  setSelectedRegion: (region: string) => void;
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
  setSelectedRegion,
  updateLocalCodeAndFetchFacilities,
  fetchFacilitiesBySport,
}: UsePositionButtonProps) {
  const toggle = useRecoilValue(toggleState);

  const moveToUserLocation = useCallback(() => {
    if (map && userLocation) {
      map.setCenter(userLocation);
      setSelectedLocation(userLocation);

      updateLocalCodeAndFetchFacilities(
        userLocation.getLat(),
        userLocation.getLng()
      );

      fetchFacilitiesBySport();
    } else {
      console.warn('지도 객체 또는 사용자 위치가 사용 가능하지 않습니다.');
    }
  }, [
    map,
    userLocation,
    setSelectedLocation,
    updateLocalCodeAndFetchFacilities,
    fetchFacilitiesBySport,
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
