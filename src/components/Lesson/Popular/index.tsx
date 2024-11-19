import {
  getNomalPopular,
  getNomalPopularParams,
  NomalPopular,
} from '@/apis/get/getPopular';
import styles from './Popular.module.scss';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  selectedLocalCodeState,
  selectedSportState,
} from '@/states/filterState';
import Link from 'next/link';
import Schedule from '@/components/Schedule';
import IconComponent from '@/components/Asset/Icon';
import LoadingSpinner from '@/components/LoadingSpinner';
import SportsFilter from '../SportsFilter';
import { sportsList } from '@/constants/sportsList';
import { cityCodes, localCodes } from '@/constants/localCode';
import Chips from '@/components/Button/Chips';
import SportsImageComponent from '@/components/Asset/SportsImage';
import { SPORTSIMAGES } from '@/constants/asset';
import { formatCurrency } from '@/utils/formatCurrency';

export default function Popular() {
  const [facilities, setFacilities] = useState<NomalPopular[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLocalCode] = useRecoilState(selectedLocalCodeState);
  const [selectedSport, setSelectedSport] = useRecoilState(selectedSportState);
  const topFacilities = facilities.slice(0, 5);

  useEffect(() => {
    const fetchFacilities = async () => {
      if (!selectedLocalCode) return;
      setIsLoading(true);

      try {
        const params: getNomalPopularParams = {
          localCode: selectedLocalCode,
        };

        const fetchedFacilities = await getNomalPopular(params);
        setFacilities(fetchedFacilities);
      } catch {
        console.error('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, [selectedLocalCode]);

  // 스포츠 필터링 함수
  const filterFacilitiesBySport = (
    facilities: NomalPopular[],
    sport: string
  ): NomalPopular[] => {
    if (!sport) return facilities;
    return facilities.filter(facility =>
      facility.items.some(item => item.trim() === sport.trim())
    );
  };

  const filteredFacilities = filterFacilitiesBySport(facilities, selectedSport);

  const parseLocalCode = (localCode: string): string => {
    const cityCode = localCode.slice(0, 2);

    const city = localCodes[cityCode];
    if (!city) {
      return '알 수 없는 지역';
    }

    const cityName = cityCodes[cityCode];
    if (!city) {
      return '알 수 없는 지역';
    }

    const localName = city[localCode];
    if (!localName) {
      return '알 수 없는 지역';
    }

    return `${cityName} ${localName}`;
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={styles.topContainer}>
            <div className={styles.titleContainer}>
              <h2 className={styles.title}>
                {parseLocalCode(selectedLocalCode)}
              </h2>
              인기 시설 TOP 5
            </div>
            <div className={styles.bestContainer}>
              {topFacilities.map((facility, index) => (
                <Link
                  key={`${facility.businessId}-${facility.serialNumber}`}
                  href={`/details/${facility.businessId}/${facility.serialNumber}`}
                >
                  <div className={styles.facilityCard}>
                    <SportsImageComponent
                      name={facility.items[0] as keyof typeof SPORTSIMAGES}
                      width={152}
                      height={110}
                      alt={facility.items[0]}
                      rank={index + 1}
                    />
                    <div className={styles.nameItems}>
                      <p className={styles.facilityName}>{facility.name}</p>
                      <p className={styles.facilityItems}>
                        {facility.items[0]}
                      </p>
                    </div>
                    <Chips
                      chipState="top"
                      text={`누적 수강 ${formatCurrency(facility.totalParticipantCount)}`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.midContainer} />
          <div className={styles.bottomContainer}>
            <div className={styles.checkboxContainer}>
              <div className={styles.filterContainer}>
                <SportsFilter
                  options={sportsList}
                  value={selectedSport}
                  onChange={setSelectedSport}
                />
                <div className={styles.totalText}>
                  총
                  <p className={styles.totalTextColor}>
                    {filteredFacilities.length}
                  </p>
                  시설
                </div>
              </div>
              <div className={styles.sort}>
                인기순
                <IconComponent name="down" size="s" alt="sort arrow" />
              </div>
            </div>
            {filteredFacilities.length > 0 ? (
              <div className={styles.listContainer}>
                {filteredFacilities.map(facility => (
                  <Link
                    key={`${facility.businessId}-${facility.serialNumber}`}
                    href={`/details/${facility.businessId}/${facility.serialNumber}`}
                  >
                    <Schedule facility={facility} isPopular />
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.resultContainer}>
                <IconComponent
                  name="noResult"
                  width={48}
                  height={48}
                  alt="결과 없음"
                />
                <div className={styles.textContainer}>
                  <p className={styles.mainText}>해당하는 시설이 없어요.</p>
                  <p className={styles.subText}>종목을 변경해주세요.</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
