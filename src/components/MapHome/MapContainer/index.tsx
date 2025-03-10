import React, { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/MapHome/PopularSports';
import FacilityInfo from '@/components/MapHome/FacilityInfo';
import useKakaoMap from './hooks/useMap';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import { useRouter } from 'next/router';
import { Facility } from '@/apis/get/getFacilities';
import {
  NomalFacilityDetails,
  SpecialFacilityDetails,
} from '@/apis/get/getFacilityDetails';
import { usePopup } from '@/utils/popupUtils';
import useFetchFacilities from './hooks/useFetchFacilities';
import useUpdateLocalCode from './hooks/useUpdateLocalCode';
import useFacilityMarkers from './hooks/useFacilityMarkers';
import usePositionButton from './hooks/usePositionButton';
import useRegionSearch from './hooks/useRegionSearch';
import useKakaoMapLoader from './hooks/useKakaoMapLoader';

// ✅ KAKAO_MAP_KEY 추가
const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY!;

export default function MapContainer() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<
    NomalFacilityDetails | SpecialFacilityDetails | null
  >(null);
  const [indicatorMode, setIndicatorMode] = useState<'sports' | 'facilityInfo'>(
    'sports'
  );
  const [selectedRegion, setSelectedRegion] = useState('지역'); // ✅ 지역명 상태 추가
  const [userLocation, setUserLocation] = useState<kakao.maps.LatLng | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] =
    useState<kakao.maps.LatLng | null>(null);
  const toggle = useRecoilValue(toggleState);
  const router = useRouter();
  const { openPopup } = usePopup();

  // ✅ KAKAO_MAP_KEY를 인자로 전달
  const { map, setMap } = useKakaoMap(KAKAO_MAP_KEY, null);

  // ✅ 지역명을 `setSelectedRegion`을 통해 업데이트하도록 훅 적용
  useKakaoMapLoader(setMap, setUserLocation, setSelectedRegion);

  // ✅ 시설 데이터 가져오기
  const fetchFacilitiesBySport = useFetchFacilities(
    setFacilities,
    openPopup,
    toggle
  );

  // ✅ 마커 관련 기능
  const { resetSelectedMarker, clearMarkers } = useFacilityMarkers({
    map,
    facilities,
    toggle,
    setSelectedFacility,
    setIndicatorMode,
    setFacilities,
  });

  const { updateLocalCodeAndFetchFacilities } = useUpdateLocalCode(
    setSelectedRegion,
    fetchFacilitiesBySport
  );

  const { moveToUserLocation, buttonProps } = usePositionButton({
    map,
    userLocation,
    setSelectedLocation,
    updateLocalCodeAndFetchFacilities,
    fetchFacilitiesBySport,
  });

  // ✅ 지역 검색 기능 분리
  const { handleRegionSelect } = useRegionSearch(
    map,
    setFacilities,
    clearMarkers,
    setSelectedLocation,
    updateLocalCodeAndFetchFacilities,
    fetchFacilitiesBySport
  );

  useEffect(() => {
    clearMarkers();
    setFacilities([]);
    setSelectedFacility(null);

    fetchFacilitiesBySport();
  }, [toggle]);

  return (
    <>
      <Header />
      <div {...buttonProps} onClick={moveToUserLocation}>
        <img src={buttonProps.src} alt={buttonProps.alt} />
      </div>
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>
      {indicatorMode === 'sports' ? (
        <PopularSports
          onSelectSport={sport => {
            setFacilities([]);
            clearMarkers();
            fetchFacilitiesBySport(sport);
          }}
          mode={toggle}
          onRegionSelect={handleRegionSelect}
          selectedRegion={selectedRegion} // ✅ 드롭다운에 지역 정보 반영
        />
      ) : (
        selectedFacility && (
          <FacilityInfo
            facility={selectedFacility}
            onBackClick={() => {
              resetSelectedMarker();
              setIndicatorMode('sports');
            }}
            onMoveToDetail={() =>
              router.push(`/details/${selectedFacility.businessId}`)
            }
            resetSelectedMarker={resetSelectedMarker}
          />
        )
      )}
    </>
  );
}
