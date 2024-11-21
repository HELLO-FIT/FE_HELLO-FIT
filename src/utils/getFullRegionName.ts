import { cityCodes, localCodes } from "@/constants/localCode";

export const getFullRegionName = (cityCode: string, localCode: string): string => {
  const cityName = cityCodes[cityCode];
  const localName = localCodes[cityCode]?.[localCode];

  if (!cityName || !localName) {
    console.error('유효하지 않은 지역 코드:', cityCode, localCode);
    return '';
  }

  if (cityName === '서울') return `서울특별시 ${localName}`;
  if (cityName === '부산') return `부산광역시 ${localName}`;
  if (cityName === '대구') return `대구광역시 ${localName}`;
  if (cityName === '인천') return `인천광역시 ${localName}`;
  if (cityName === '광주') return `광주광역시 ${localName}`;
  if (cityName === '대전') return `대전광역시 ${localName}`;
  if (cityName === '울산') return `울산광역시 ${localName}`;
  if (cityName === '세종') return `세종특별자치시`;

  return `${cityName} ${localName}`;
};
