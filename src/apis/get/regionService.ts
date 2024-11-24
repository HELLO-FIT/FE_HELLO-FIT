// // 유지보수
// import { simplifyRegionName } from "@/utils/regionUtils";

// export const updateLocalCodeAndFetchFacilities = async (
//   latitude: number,
//   longitude: number,
//   geocoder: kakao.maps.services.Geocoder,
//   fetchFacilities: (filterItem: string | null) => void,
//   setLocalCode: (code: string) => void,
//   setSelectedRegion: (region: string) => void,
//   filterItem: string | null
// ) => {
//   try {
//     const result = await new Promise<any[]>((resolve, reject) => {
//       geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
//         if (status === kakao.maps.services.Status.OK) {
//           resolve(result);
//         } else {
//           reject(new Error(`Failed to fetch region code: ${status}`));
//         }
//       });
//     });

//     if (result[0]?.code) {
//       const fullLocalCode = result[0].code.trim();
//       const shortLocalCode = `${fullLocalCode.slice(0, 4)}0`;

//       setLocalCode(shortLocalCode);
//       try {
//         localStorage.setItem('localCode', shortLocalCode);
//       } catch (error) {
//         console.warn('Could not save localCode to localStorage:', error);
//       }

//       const simplifiedRegion = simplifyRegionName(result[0].address_name || '');
//       setSelectedRegion(simplifiedRegion);

//       if (filterItem !== null && typeof filterItem === 'string') {
//         fetchFacilities(filterItem);
//       }
//     }
//   } catch (error) {
//     console.error('Error in updateLocalCodeAndFetchFacilities:', error);
//   }
// };
