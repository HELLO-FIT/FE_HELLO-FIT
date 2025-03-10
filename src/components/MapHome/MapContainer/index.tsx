import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import Header from '@/components/Layout/Header';
import PopularSports from '@/components/MapHome/PopularSports';
import FacilityInfo from '@/components/MapHome/FacilityInfo';
import { toggleState } from '@/states/toggleState';
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
import useKakaoMap from './hooks/useMap';
import useKakaoMapLoader from './hooks/useKakaoMapLoader';

const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY!;

export default function MapContainer() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<
    NomalFacilityDetails | SpecialFacilityDetails | null
  >(null);
  const [indicatorMode, setIndicatorMode] = useState<'sports' | 'facilityInfo'>(
    'sports'
  );

  const [selectedRegion, setSelectedRegion] = useState('지역');
  const [userLocation, setUserLocation] = useState<kakao.maps.LatLng | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] =
    useState<kakao.maps.LatLng | null>(null);

  const toggle = useRecoilValue(toggleState);
  const router = useRouter();
  const { openPopup } = usePopup();

  const { map, setMap } = useKakaoMap(KAKAO_MAP_KEY, null);
  useKakaoMapLoader(setMap, setUserLocation, setSelectedRegion);

  const fetchFacilitiesBySport = useFetchFacilities(
    setFacilities,
    openPopup,
    toggle
  );

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

  const { handleRegionSelect } = useRegionSearch(
    map,
    setFacilities,
    clearMarkers,
    setSelectedLocation,
    updateLocalCodeAndFetchFacilities,
    fetchFacilitiesBySport
  );

  useEffect(() => {
    let isMounted = true;

    const updateFacilities = async () => {
      clearMarkers();
      setFacilities([]);
      setSelectedFacility(null);

      await fetchFacilitiesBySport();
      if (!isMounted) return;
    };

    updateFacilities();

    return () => {
      isMounted = false;
    };
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
          selectedRegion={selectedRegion}
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
