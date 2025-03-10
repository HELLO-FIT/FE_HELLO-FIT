import { useCallback, useEffect, useMemo, useRef } from 'react';
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
  const userMarkerRef = useRef<kakao.maps.Marker | null>(null); 

  // 사용자 위치에 my-location 마커를 표시하는 함수
  const updateUserMarker = useCallback(() => {
    if (!map || !userLocation) return;

    // 기존 마커가 있다면 삭제
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    // 새로운 마커 생성
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

    userMarkerRef.current = newMarker;
  }, [map, userLocation, toggle]); // userMarkerRef는 의존성에서 제거

  // 현재 위치로 이동하는 기능
  const moveToUserLocation = useCallback(() => {
    if (map && userLocation) {
      map.setCenter(userLocation);
      setSelectedLocation(userLocation);

      updateLocalCodeAndFetchFacilities(
        userLocation.getLat(),
        userLocation.getLng()
      );
      fetchFacilitiesBySport();

      updateUserMarker(); // 마커 업데이트
    } else {
      console.warn('지도 객체 또는 사용자 위치가 사용 가능하지 않습니다.');
    }
  }, [
    map,
    userLocation,
    setSelectedLocation,
    updateLocalCodeAndFetchFacilities,
    fetchFacilitiesBySport,
    updateUserMarker,
  ]);

  // 지도 로드 시 my-location 마커 표시
  useEffect(() => {
    if (userLocation) {
      updateUserMarker();
    }
  }, [userLocation, updateUserMarker]);

  // useMemo로 buttonProps 최적화
  const buttonProps = useMemo(
    () => ({
      className: classNames(styles.positionButton, {
        [styles['position-special']]: toggle === 'special',
      }),
      src:
        toggle === 'special'
          ? '/image/position-special.svg'
          : '/image/position.svg',
      alt: '현재 위치로 돌아가기',
    }),
    [toggle]
  );

  return { moveToUserLocation, buttonProps };
}
