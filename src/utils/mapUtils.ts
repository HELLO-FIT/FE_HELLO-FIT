// // 유지보수
// export const loadKakaoMapScript = (appKey: string): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     if (typeof window !== "undefined" && window.kakao) {
//       // 이미 kakao 객체가 로드된 경우
//       resolve();
//       return;
//     }

//     const script = document.createElement("script");
//     script.async = true;
//     script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;

//     script.onload = () => {
//       if (typeof window !== "undefined" && window.kakao) {
//         resolve();
//       } else {
//         reject(new Error("Kakao Maps API is not available after loading."));
//       }
//     };

//     script.onerror = () => reject(new Error("Failed to load Kakao Maps API."));
//     document.head.appendChild(script);
//   });
// };

// export const createMarkerImage = (src: string): kakao.maps.MarkerImage | null => {
//   if (typeof window !== "undefined" && window.kakao) {
//     const { kakao } = window;
//     return new kakao.maps.MarkerImage(src, new kakao.maps.Size(28, 28), {
//       offset: new kakao.maps.Point(14, 14),
//     });
//   }
//   console.error("Kakao Maps is not initialized.");
//   return null;
// };

// export const updateLocalCodeAndFetchFacilities = async (
//   latitude: number,
//   longitude: number,
//   fetchFacilitiesBySport: (localCode: string | null, sport: string | null) => void,
//   setLocalCode: (code: string) => void,
//   setSelectedRegion: (region: string) => void,
//   filterItem: string | null
// ) => {
//   if (typeof window !== "undefined" && window.kakao) {
//     const { kakao } = window;

//     const geocoder = new kakao.maps.services.Geocoder();
//     geocoder.coord2RegionCode(longitude, latitude, (result: string | any[], status: any) => {
//       if (status === kakao.maps.services.Status.OK && result.length > 0) {
//         const fullLocalCode = result[0].code.trim();
//         const shortLocalCode = `${fullLocalCode.slice(0, 4)}0`;

//         setLocalCode(shortLocalCode);
//         const simplifiedRegion = result[0].address_name.split(" ")[0];
//         setSelectedRegion(simplifiedRegion);

//         fetchFacilitiesBySport(shortLocalCode, filterItem);
//       } else {
//         console.error("Failed to fetch region code:", status);
//       }
//     });
//   } else {
//     console.error("Kakao Maps is not initialized.");
//   }
// };
