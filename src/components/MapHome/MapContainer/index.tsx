import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/MapHome/PopularSports';
import FacilityInfo from '@/components/MapHome/FacilityInfo';
import { fetchFacilities } from '@/apis/get/facilitiesAPI';
import { simplifyRegionName } from '@/utils/regionUtils';
import { createMarkerImage } from '@/utils/markerUtils';
import useKakaoMap from '@/hooks/useMap';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import styles from './MapContainer.module.scss';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { NomalFacility, SpecialFacility } from '@/apis/get/getFacilities';
import {
  NomalFacilityDetails,
  SpecialFacilityDetails,
  getSpecialFacilityDetails,
  getNomalFacilityDetails,
} from '@/apis/get/getFacilityDetails';
import { usePopup } from '@/utils/popupUtils';
import throttle from 'lodash/throttle'; 

/* eslint-disable */
type Facility = NomalFacility | SpecialFacility;

export default function MapContainer() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<
    NomalFacilityDetails | SpecialFacilityDetails | null
  >(null);
  const [indicatorMode, setIndicatorMode] = useState<'sports' | 'facilityInfo'>(
    'sports'
  );
  const [selectedRegion, setSelectedRegion] = useState('지역');
  const [filterItem, setFilterItem] = useState<string | null>(null);
  const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY!;
  const [userLocation, setUserLocation] = useState<kakao.maps.LatLng | null>(
    null
  );
  const [localCode, setLocalCode] = useState<string | null>(
    localStorage.getItem('localCode') || null
  );
  const [selectedLocation, setSelectedLocation] =
    useState<kakao.maps.LatLng | null>(null);
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
  const toggle = useRecoilValue(toggleState);
  const router = useRouter();
  const { openPopup } = usePopup();
  const { map, setMap } = useKakaoMap(KAKAO_MAP_KEY, null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

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

  const notifyNoFacilities = () => {
    openPopup({
      content: '등록된 시설이 없습니다.',
    });
  };

  const fetchFacilitiesBySport = useCallback(
    async (sport: string | null = null) => {
      const data = await fetchFacilities(
        localStorage.getItem('localCode'),
        sport,
        toggle
      );

      if (
        !data ||
        data.length === 0 ||
        (data && data.length > 0 && !data[0].items)
      ) {
        notifyNoFacilities(); // 중복 방지된 팝업 호출
      } else {
        setFacilities(data);
      }
    },
    [toggle]
  );

  // 좌표를 기반으로 지역 코드 및 시설 목록 갱신 함수
  const updateLocalCodeAndFetchFacilities = useCallback(
    throttle(async (latitude: number, longitude: number) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2RegionCode(
        longitude,
        latitude,
        (result: any[], status: string) => {
          if (status === kakao.maps.services.Status.OK && result.length > 0) {
            const fullLocalCode = result[0].code.trim();
            const shortLocalCode = `${fullLocalCode.slice(0, 4)}0`;

            localStorage.setItem('localCode', shortLocalCode);
            const simplifiedRegion = simplifyRegionName(result[0].address_name);
            setSelectedRegion(simplifiedRegion);

            fetchFacilitiesBySport(filterItem);
          } else {
            console.error('Failed to fetch region code:', status);
            setFacilities([]);
          }
        }
      );
    }, 2000), // 2초 동안 호출 제한
    [fetchFacilitiesBySport, filterItem]
  );

  // 지역을 선택했을 때 호출되는 함수
  const handleRegionSelect = useCallback(
    (localCode: string, fullRegionName: string) => {
      if (!fullRegionName) {
        console.error('유효하지 않은 지역 이름:', localCode, fullRegionName);
        return;
      }

      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(
        fullRegionName,
        (result: any[], status: string) => {
          if (status === kakao.maps.services.Status.OK && result.length > 0) {
            const { y: latitude, x: longitude } = result[0];
            const coords = new kakao.maps.LatLng(
              parseFloat(latitude),
              parseFloat(longitude)
            );

            if (map) {
              map.setCenter(coords);
            }

            setSelectedLocation(coords); // 선택한 지역을 따로 저장
            updateLocalCodeAndFetchFacilities(
              parseFloat(latitude),
              parseFloat(longitude)
            );

            fetchFacilitiesBySport(); // 지역 선택 후 해당 지역의 시설 목록 갱신
          } else {
            console.error(
              '지역 검색 실패 또는 결과 없음:',
              status,
              fullRegionName
            );
          }
        }
      );
    },
    [map, updateLocalCodeAndFetchFacilities, fetchFacilitiesBySport]
  );

  // 초기 카카오 지도 로드 및 위치 설정
  useEffect(() => {
    loadKakaoMapScript()
      .then(() => {
        kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center:
              selectedLocation ||
              userLocation ||
              new kakao.maps.LatLng(37.5665, 126.978), // 선택된 지역 우선
            level: 3,
          };
          const kakaoMap = new kakao.maps.Map(
            container as HTMLElement,
            options
          );
          setMap(kakaoMap);

          if (navigator.geolocation && !selectedLocation) {
            navigator.geolocation.getCurrentPosition(
              position => {
                const userLatLng = new kakao.maps.LatLng(
                  position.coords.latitude,
                  position.coords.longitude
                );
                setUserLocation(userLatLng);
                kakaoMap.setCenter(userLatLng);

                const userMarkerImage = createMarkerImage(
                  toggle === 'special'
                    ? '/image/my-location-special.svg'
                    : '/image/my-location.svg'
                );

                const userMarker = new kakao.maps.Marker({
                  map: kakaoMap,
                  position: userLatLng,
                  image: userMarkerImage,
                  title: '현재 위치',
                });

                kakao.maps.event.addListener(userMarker, 'click', () => {
                  moveToUserLocation();
                });

                updateLocalCodeAndFetchFacilities(
                  position.coords.latitude,
                  position.coords.longitude
                );
              },
              error => {
                console.error('현재 위치를 가져오는 데 실패했습니다:', error);
                setFacilities([]); // 위치를 가져오지 못한 경우 시설 목록을 비웁니다.
              }
            );
          }
        });
      })
      .catch(console.error);
  }, [
    KAKAO_MAP_KEY,
    toggle,
    updateLocalCodeAndFetchFacilities,
    selectedLocation,
  ]);

  // 현재 위치로 이동 함수
  const moveToUserLocation = () => {
    if (map && userLocation) {
      map.setCenter(userLocation);
      setSelectedLocation(null); // 현재 위치로 이동 시 선택된 지역 초기화
      updateLocalCodeAndFetchFacilities(
        userLocation.getLat(),
        userLocation.getLng()
      );
      fetchFacilitiesBySport(); // 현재 위치로 이동 후 시설 목록 갱신
    } else {
      console.warn('Map or userLocation is not available');
    }
  };

  // 시설 목록이 변경될 때 지도 마커 업데이트
  useEffect(() => {
    if (facilities.length > 0) {
      throttledRenderMarkers();
    } else {
      clearMarkers();
    }
  }, [map, facilities]);

  // 마커 렌더링 함수에 throttle 적용
  const throttledRenderMarkers = useCallback(
    throttle(() => {
      if (!map || facilities.length === 0) return;

      clearMarkers(); // 기존 마커 제거

      const newMarkers: kakao.maps.Marker[] = [];
      let selectedMarker: kakao.maps.Marker | null = null;

      facilities.forEach(facility => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(
          facility.address,
          (result: any[], status: string) => {
            if (status === kakao.maps.services.Status.OK) {
              const coords = new kakao.maps.LatLng(
                parseFloat(result[0].y),
                parseFloat(result[0].x)
              );

              const defaultMarkerImage = createMarkerImage(
                toggle === 'special'
                  ? '/image/marker-special.svg'
                  : '/image/marker.svg'
              );

              const selectedMarkerImage = createMarkerImage(
                toggle === 'special'
                  ? '/image/address-marker-special.svg'
                  : '/image/address-marker-normal.svg'
              );

              const marker = new kakao.maps.Marker({
                map,
                position: coords,
                image: defaultMarkerImage,
                title: facility.name,
              });

              newMarkers.push(marker);

              kakao.maps.event.addListener(marker, 'mouseover', () => {
                if (!selectedMarker || selectedMarker !== marker) {
                  marker.setImage(defaultMarkerImage);
                }
              });

              kakao.maps.event.addListener(marker, 'mouseout', () => {
                if (!selectedMarker || selectedMarker !== marker) {
                  marker.setImage(defaultMarkerImage);
                }
              });

              kakao.maps.event.addListener(marker, 'click', async () => {
                if (selectedMarker && selectedMarker !== marker) {
                  selectedMarker.setImage(defaultMarkerImage);
                }

                marker.setImage(selectedMarkerImage);
                selectedMarker = marker;

                try {
                  let details;
                  if (toggle === 'special') {
                    details = await getSpecialFacilityDetails(
                      facility.businessId
                    );
                  } else if ('serialNumber' in facility) {
                    details = await getNomalFacilityDetails(
                      facility.businessId,
                      facility.serialNumber
                    );
                  }

                  if (details) {
                    setSelectedFacility(details);
                    setIndicatorMode('facilityInfo');
                  }
                } catch (error) {
                  console.error('Failed to fetch facility details:', error);
                }
              });
            }
          }
        );
      });

      setMarkers(newMarkers);
    }, 2000), // 2초 동안 호출 제한
    [map, facilities, toggle]
  );

  // 기존 마커 제거 함수
  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  return (
    <>
      <Header />
      <div
        className={classNames(styles.positionButton, {
          [styles['position-special']]: toggle === 'special',
        })}
        onClick={moveToUserLocation}
      >
        <img
          src={
            toggle === 'special'
              ? '/image/position-special.svg'
              : '/image/position.svg'
          }
          alt="현재 위치로 돌아가기"
        />
      </div>
      <div
        id="map"
        style={{ width: '100%', height: '100vh', position: 'relative' }}
      ></div>
      {indicatorMode === 'sports' ? (
        <PopularSports
          onSelectSport={sport => {
            setFilterItem(sport);
            fetchFacilitiesBySport(sport);
          }}
          mode={toggle}
          onRegionSelect={handleRegionSelect} 
          selectedRegion={selectedRegion}
        />
      ) : (
        selectedFacility && (
          <FacilityInfo
            facility={selectedFacility}
            filterItem={filterItem || undefined}
            onBackClick={() => {
              setIndicatorMode('sports');
              clearMarkers();
              throttledRenderMarkers();
            }}
            onMoveToDetail={() => {
              if (selectedFacility) {
                router.push(
                  `/details/${selectedFacility.businessId}/${
                    'serialNumber' in selectedFacility
                      ? selectedFacility.serialNumber
                      : ''
                  }`
                );
              }
            }}
          />
        )
      )}
    </>
  );
}
/* eslint-enable */
