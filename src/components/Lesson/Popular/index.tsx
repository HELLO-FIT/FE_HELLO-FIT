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
import { localCodes } from '@/constants/localCode';

export default function Popular() {
  const [facilities, setFacilities] = useState<NomalPopular[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLocalCode] = useRecoilState(selectedLocalCodeState);
  const [selectedSport, setSelectedSport] = useRecoilState(selectedSportState);

  useEffect(() => {
    const fetchFacilities = async () => {
      if (!selectedLocalCode) return;
      setIsLoading(true);

      try {
        const params: getNomalPopularParams = {
          localCode: selectedLocalCode,
        };

        const fetchedFacilities = await getNomalPopular(params);
        setFacilities(
          filterFacilitiesBySport(fetchedFacilities, selectedSport)
        );
      } catch {
        console.error('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, [selectedLocalCode, selectedSport]);

  // 스포츠 필터링
  const filterFacilitiesBySport = (
    facilities: NomalPopular[],
    sport: string
  ): NomalPopular[] => {
    if (!sport) return facilities;
    return facilities.filter(facility =>
      facility.items.some(item => item.trim() === sport.trim())
    );
  };

  const parseLocalCode = (code: string): string => {
    const localCode = code;

    const localName = localCodes[localCode];

    if (!localName) {
      return '알 수 없는 지역';
    }

    return `${localName}`;
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={styles.topContainer}>
            <h2>{parseLocalCode(selectedLocalCode)}</h2>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.checkboxContainer}>
              <div className={styles.filterContainer}>
                <SportsFilter
                  options={sportsList}
                  value={selectedSport}
                  onChange={setSelectedSport}
                />
                <div className={styles.totalText}>
                  총<p className={styles.totalTextColor}>{facilities.length}</p>
                  시설
                </div>
              </div>
              <div className={styles.sort}>
                인기순
                <IconComponent name="down" size="s" alt="sort arrow" />
              </div>
            </div>
            {facilities.length > 0 ? (
              <div className={styles.listContainer}>
                {facilities.map(facility => (
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
