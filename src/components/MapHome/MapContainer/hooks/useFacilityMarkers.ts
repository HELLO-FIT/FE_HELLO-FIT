import { useEffect, useCallback, useState } from 'react';
import { createMarkerImage } from '@/utils/markerUtils';
import throttle from 'lodash/throttle';
import { useRouter } from 'next/router';
import {
  getSpecialFacilityDetails,
  getNomalFacilityDetails,
} from '@/apis/get/getFacilityDetails';
import { Facility } from '@/apis/get/getFacilities';

type UseFacilityMarkersProps = {
  map: kakao.maps.Map | null;
  facilities: Facility[];
  toggle: string;
  setSelectedFacility: (facility: any) => void;
  setIndicatorMode: (mode: 'sports' | 'facilityInfo') => void;
};

export default function useFacilityMarkers({
  map,
  facilities,
  toggle,
  setSelectedFacility,
  setIndicatorMode,
}: UseFacilityMarkersProps) {
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
  const router = useRouter();

  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  const renderMarkers = useCallback(
    throttle(() => {
      if (!map || facilities.length === 0) return;
      clearMarkers();

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
                  : '/image/address-marker-normal.svg',
                1.5
              );

              const marker = new kakao.maps.Marker({
                map,
                position: coords,
                image: defaultMarkerImage,
                title: facility.name,
              });

              newMarkers.push(marker);

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
                  } else if (facility.serialNumber) {
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
                  console.error(
                    '시설 상세 정보를 가져오는 데 실패했습니다:',
                    error
                  );
                }
              });

              kakao.maps.event.addListener(marker, 'dblclick', () => {
                router.push(`/details/${facility.businessId}`);
              });
            }
          }
        );
      });

      setMarkers(newMarkers);
    }, 2000),
    [map, facilities, toggle]
  );

  useEffect(() => {
    if (facilities.length > 0) {
      renderMarkers();
    } else {
      clearMarkers();
    }
  }, [facilities, renderMarkers]);

  return { markers };
}
