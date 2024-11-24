// // 유지보수
// import {
//   getNomalFacilities,
//   getSpecialFacilities,
// } from '@/apis/get/getFacilities';

// export const fetchFacilities = async (
//   localCode: string | null,
//   sport: string | null,
//   toggle: string
// ) => {
//   try {
//     const params = {
//       localCode: localCode || '11110',
//       itemName: sport || undefined,
//     };

//     const data =
//       toggle === 'special'
//         ? await getSpecialFacilities(params)
//         : await getNomalFacilities(params);
//     return data;
//   } catch (error) {
//     console.error('시설 데이터를 가져오는 중 오류 발생:', error);
//     return [];
//   }
// };
