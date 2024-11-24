import React, { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/MapHome/PopularSports';
import FacilityInfo from '@/components/MapHome/FacilityInfo';
import { getNomalFacilities, NomalFacility } from '@/apis/get/getFacilities';
import {
  getNomalFacilityDetails,
  NomalFacilityDetails,
} from '@/apis/get/getFacilityDetails';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import styles from './map.module.scss';
import { useRouter } from 'next/router';
import classNames from 'classnames';

/* eslint-disable */
interface KakaoMapResult {
  y: string;
  x: string;
}

export default function Map() {
  const [facilities, setFacilities] = useState<NomalFacility[]>([]);
  const [selectedFacility, setSelectedFacility] =
    useState<NomalFacilityDetails | null>(null);
  const [indicatorMode, setIndicatorMode] = useState<'sports' | 'facilityInfo'>(
    'sports'
  );
  const [selectedRegion, setSelectedRegion] = useState('지역');
  const [filterItem, setFilterItem] = useState<string | null>(null);
  const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY!;
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<kakao.maps.LatLng | null>(
    null
  );
  const [localCode, setLocalCode] = useState<string | null>(null);

  const toggle = useRecoilValue(toggleState);
  const router = useRouter();

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

  const fetchFacilitiesBySport = async (sport: string | null = null) => {
    try {
      setFacilities([]);
      setFilterItem(sport);
      const data = await getNomalFacilities({
        localCode: localCode || '11110',
        itemName: sport || undefined,
      });
      setFacilities(data);
    } catch (error) {
      console.error('시설 데이터를 가져오는 중 오류 발생:', error);
    }
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
        if (status === kakao.maps.services.Status.OK && result[0].code) {
          const fullLocalCode = result[0].code.trim();
          const shortLocalCode = `${fullLocalCode.slice(0, 4)}0`;

          setLocalCode(shortLocalCode);
          localStorage.setItem('localCode', shortLocalCode);

          const simplifiedRegion = simplifyRegionName(result[0].address_name);
          setSelectedRegion(simplifiedRegion);

          fetchFacilitiesBySport(filterItem);
        } else {
          console.error('Failed to fetch region code:', status);
        }
      }
    );
  };

  const handleRegionSelect = (localCode: string, fullRegionName: string) => {
    if (!fullRegionName) {
      console.error('유효하지 않은 지역 이름:', localCode, fullRegionName);
      return;
    }

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(
      fullRegionName,
      (result: KakaoMapResult[], status: string) => {
        if (status === kakao.maps.services.Status.OK && result.length > 0) {
          const { y: latitude, x: longitude } = result[0];
          const coords = new kakao.maps.LatLng(
            parseFloat(latitude),
            parseFloat(longitude)
          );

          if (map) {
            map.setCenter(coords);
          }

          updateLocalCodeAndFetchFacilities(
            parseFloat(latitude),
            parseFloat(longitude)
          );
        } else {
          console.error(
            '지역 검색 실패 또는 결과 없음:',
            status,
            fullRegionName
          );
        }
      }
    );
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
    if (!map || facilities.length === 0) return;

    const newMarkers: kakao.maps.Marker[] = [];
    let selectedMarker: kakao.maps.Marker | null = null;

    facilities.forEach(facility => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(
        facility.address,
        (result: KakaoMapResult[], status: string) => {
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
                const details = await getNomalFacilityDetails(
                  facility.businessId,
                  facility.serialNumber
                );
                setSelectedFacility(details);
                setIndicatorMode('facilityInfo');
              } catch (error) {
                console.error('Failed to fetch facility details:', error);
              }
            });
          }
        }
      );
    });

    setMarkers(newMarkers);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, facilities, toggle]);

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
          onSelectSport={fetchFacilitiesBySport}
          mode={toggle}
          onRegionSelect={handleRegionSelect}
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
                  `/details/${selectedFacility.businessId}/${selectedFacility.serialNumber}`
                );
              }
            }}
          />
        )
      )}
    </>
  );
}
