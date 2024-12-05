import { Facility } from '@/apis/get/getFacilities';
import {
  getNomalFacilityDetails,
  getSpecialFacilityDetails,
} from '@/apis/get/getFacilityDetails';
/* eslint-disable */
export const createMarkerImage = (
  src: string,
  scale: number = 1 // 스케일 인자 추가, 기본값은 1
): kakao.maps.MarkerImage => {
  const originalSize = 28; // 기존 마커 이미지 크기
  const newSize = originalSize * scale; // 스케일에 따라 이미지 크기 조정

  return new kakao.maps.MarkerImage(
    src,
    new kakao.maps.Size(newSize, newSize),
    {
      offset: new kakao.maps.Point(newSize / 2, newSize / 2), // 중심점 유지
    }
  );
};

export const renderMarkers = (
  map: kakao.maps.Map,
  facilities: Facility[],
  setSelectedFacility: React.Dispatch<React.SetStateAction<any>>,
  setIndicatorMode: React.Dispatch<React.SetStateAction<string>>,
  toggle: string
) => {
  // 마커 렌더링 로직
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
                details = await getSpecialFacilityDetails(facility.businessId);
              } else if (facility.serialNumber !== undefined) {
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

  return newMarkers;
};

export const clearMarkers = (markers: kakao.maps.Marker[]) => {
  markers.forEach(marker => marker.setMap(null));
};
/* eslint-enable */
