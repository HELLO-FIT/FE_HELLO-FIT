import React, { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/MapHome/PopularSports';
import FacilityInfo from '@/components/MapHome/FacilityInfo';
import {
  getNomalFacilities,
  getSpecialFacilities,
  NomalFacility,
  SpecialFacility,
} from '@/apis/get/getFacilities';
import {
  getNomalFacilityDetails,
  getSpecialFacilityDetails,
  NomalFacilityDetails,
  SpecialFacilityDetails,
} from '@/apis/get/getFacilityDetails';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import styles from './MapContainer.module.scss';
import { useRouter } from 'next/router';
import classNames from 'classnames';

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
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<kakao.maps.LatLng | null>(
    null
  );
  const [localCode, setLocalCode] = useState<string | null>(null);
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);

  const toggle = useRecoilValue(toggleState);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (filterItem !== null) {
      fetchFacilities();
    }
  }, [filterItem]);

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

  const simplifyRegionName = (fullRegionName: string): string => {
    return (
      fullRegionName
        .replace(/(특별시|광역시|특별자치도|특별자치시)/g, '')
        .replace(/청$/, '')
        .match(/.+?(시|군|구)/)?.[0] || fullRegionName
    );
  };

  const createMarkerImage = (src: string): kakao.maps.MarkerImage => {
    return new kakao.maps.MarkerImage(src, new kakao.maps.Size(28, 28), {
      offset: new kakao.maps.Point(14, 14),
    });
  };

  const updateLocalCodeAndFetchFacilities = async (
    latitude: number,
    longitude: number
  ) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(
      longitude,
      latitude,
      (result: any[], status: string) => {
        if (status === kakao.maps.services.Status.OK && result.length > 0) {
          const fullLocalCode = result[0].code.trim();
          const shortLocalCode = `${fullLocalCode.slice(0, 4)}0`;

          setLocalCode(shortLocalCode);
          localStorage.setItem('localCode', shortLocalCode);

          const simplifiedRegion = simplifyRegionName(result[0].address_name);
          setSelectedRegion(simplifiedRegion);

          fetchFacilities();
        } else if (
          status === kakao.maps.services.Status.OK &&
          result.length === 0
        ) {
          console.warn('No results returned for the given coordinates.');
        } else {
          console.error('Failed to fetch region code:', status);
        }
      }
    );
  };

  // const fetchFacilities = async (localCodeOverride?: string) => {
  //   try {
  //     setFacilities([]);
  //     const params = {
  //       localCode: localCodeOverride || localCode || '11110',
  //       itemName: filterItem || undefined,
  //     };

  //     const data =
  //       toggle === 'special'
  //         ? await getSpecialFacilities(params)
  //         : await getNomalFacilities(params);

  //     setFacilities(data);
  //   } catch (error) {
  //     console.error('시설 데이터를 가져오는 중 오류 발생:', error);
  //   }
  // };

  const fetchFacilityDetails = async (
    businessId: string,
    serialNumber?: string
  ) => {
    try {
      const details =
        toggle === 'special'
          ? await getSpecialFacilityDetails(businessId)
          : await getNomalFacilityDetails(businessId, serialNumber!);
      setSelectedFacility(details);
      setIndicatorMode('facilityInfo');
    } catch (error) {
      console.error('Failed to fetch facility details:', error);
    }
  };

  // const renderMarkers = () => {
  //   if (!map || facilities.length === 0) return;

  //   const newMarkers: kakao.maps.Marker[] = [];
  //   facilities.forEach(facility => {
  //     if (filterItem && !facility.items.includes(filterItem)) return;

  //     const geocoder = new kakao.maps.services.Geocoder();
  //     geocoder.addressSearch(
  //       facility.address,
  //       (result: any[], status: string) => {
  //         if (status === kakao.maps.services.Status.OK) {
  //           const coords = new kakao.maps.LatLng(
  //             parseFloat(result[0].y),
  //             parseFloat(result[0].x)
  //           );

  //           const markerImage = createMarkerImage(
  //             toggle === 'special'
  //               ? '/image/marker-special.svg'
  //               : '/image/marker.svg'
  //           );

  //           const marker = new kakao.maps.Marker({
  //             map,
  //             position: coords,
  //             image: markerImage,
  //             title: facility.name,
  //           });

  //           kakao.maps.event.addListener(marker, 'click', () => {
  //             fetchFacilityDetails(
  //               facility.businessId,
  //               'serialNumber' in facility ? facility.serialNumber : undefined
  //             );
  //           });

  //           newMarkers.push(marker);
  //         }
  //       }
  //     );
  //   });

  //   markers.forEach(marker => marker.setMap(null));
  //   setMarkers(newMarkers);
  // };

  const moveToUserLocation = () => {
    if (map && userLocation) {
      map.setCenter(userLocation);
      updateLocalCodeAndFetchFacilities(
        userLocation.getLat(),
        userLocation.getLng()
      );
    } else {
      console.warn('Map or userLocation is not available');
    }
  };

  useEffect(() => {
    loadKakaoMapScript()
      .then(() => {
        kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          };
          const kakaoMap = new kakao.maps.Map(
            container as HTMLElement,
            options
          );
          setMap(kakaoMap);

          if (navigator.geolocation) {
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

                new kakao.maps.Marker({
                  map: kakaoMap,
                  position: userLatLng,
                  image: userMarkerImage,
                  title: '현재 위치',
                });

                updateLocalCodeAndFetchFacilities(
                  position.coords.latitude,
                  position.coords.longitude
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
  }, [KAKAO_MAP_KEY, toggle]);

  useEffect(() => {
    renderMarkers();
  }, [map, facilities]);

  /** 기존 마커를 삭제 */
  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  /** 마커를 생성 및 렌더링 */
  const renderMarkers = () => {
    if (!map || facilities.length === 0) return;

    const newMarkers: kakao.maps.Marker[] = [];
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

            const markerImage = createMarkerImage(
              toggle === 'special'
                ? '/image/marker-special.svg'
                : '/image/marker.svg'
            );

            const marker = new kakao.maps.Marker({
              map,
              position: coords,
              image: markerImage,
              title: facility.name,
            });

            kakao.maps.event.addListener(marker, 'click', () => {
              if (toggle === 'special') {
                // 특수 시설의 경우 serialNumber가 필요하지 않음
                getSpecialFacilityDetails(facility.businessId)
                  .then(details => setSelectedFacility(details))
                  .catch(console.error);
              } else if ('serialNumber' in facility) {
                // 일반 시설의 경우 serialNumber를 포함하여 API 호출
                getNomalFacilityDetails(
                  facility.businessId,
                  facility.serialNumber
                )
                  .then(details => setSelectedFacility(details))
                  .catch(console.error);
              }
              setIndicatorMode('facilityInfo');
            });

            newMarkers.push(marker);
          }
        }
      );
    });

    // 기존 마커 제거 후 새로운 마커 설정
    markers.forEach(marker => marker.setMap(null));
    setMarkers(newMarkers);
  };

  /** 시설 데이터 가져오기 */
  const fetchFacilities = async () => {
    try {
      const params = {
        localCode: localCode || '11110',
        itemName: filterItem || undefined,
      };
      const data =
        toggle === 'special'
          ? await getSpecialFacilities(params)
          : await getNomalFacilities(params);

      setFacilities(data);
    } catch (error) {
      console.error('시설 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  /** 지도 초기화 및 이벤트 핸들러 */
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const container = document.getElementById('map') as HTMLElement;
        const kakaoMap = new kakao.maps.Map(container, {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        });
        setMap(kakaoMap);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const userLatLng = new kakao.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
              );
              setUserLocation(userLatLng);
              kakaoMap.setCenter(userLatLng);
              fetchFacilities();
            },
            error => console.error('Failed to get user location:', error)
          );
        }

        kakao.maps.event.addListener(kakaoMap, 'zoom_changed', fetchFacilities);
        kakao.maps.event.addListener(kakaoMap, 'dragend', fetchFacilities);
      });
    };
  }, []);

  /** `toggle` 상태 변경 시 시설 목록 및 마커 업데이트 */
  useEffect(() => {
    fetchFacilities();
  }, [toggle, filterItem]);

  /** 시설 데이터 변경 시 마커 업데이트 */
  useEffect(() => {
    renderMarkers();
  }, [facilities]);

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
          }}
          mode={toggle}
          onRegionSelect={(localCode, region) => {
            setLocalCode(localCode);
            setSelectedRegion(region);
            fetchFacilities(); // 매개변수 전달 없이 호출
          }}
          selectedRegion={selectedRegion}
        />
      ) : (
        selectedFacility && (
          <FacilityInfo
            facility={selectedFacility}
            filterItem={filterItem || undefined}
            onBackClick={() => setIndicatorMode('sports')}
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
