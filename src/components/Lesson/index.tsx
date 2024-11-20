import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  NomalFacility,
  getNomalFacilities,
  GetNomalFacilitiesParams,
} from '@/apis/get/getFacilities';
import {
  selectedCityCodeState,
  selectedLocalCodeState,
  selectedSportState,
} from '@/states/filterState';
import styles from './Lesson.module.scss';
import SearchBar from '@/components/Search/SearchBar';
import SportsFilter from './SportsFilter';
import Schedule from '../Schedule';
import Link from 'next/link';
import ImageComponent from '../Asset/Image';
import { sportsList } from '@/constants/sportsList';
import IconComponent from '../Asset/Icon';
import LoadingSpinner from '@/components/LoadingSpinner';

interface LessonProps {
  onPopularClick: () => void;
}

export default function Lesson({ onPopularClick }: LessonProps) {
  const [facilities, setFacilities] = useState<NomalFacility[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCityCode] = useRecoilState(selectedCityCodeState);
  const [selectedLocalCode] = useRecoilState(selectedLocalCodeState);
  const [selectedSport, setSelectedSport] = useRecoilState(selectedSportState);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params: GetNomalFacilitiesParams = {
          localCode: selectedLocalCode,
        };

        const fetchedFacilities = await getNomalFacilities(params);
        setFacilities(
          filterFacilitiesBySport(fetchedFacilities, selectedSport)
        );
      } catch {
        console.error('시설 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCityCode && selectedLocalCode) {
      fetchData();
    }
  }, [selectedCityCode, selectedLocalCode, selectedSport]);

  // 스포츠 필터링
  const filterFacilitiesBySport = (
    facilities: NomalFacility[],
    sport: string
  ): NomalFacility[] => {
    if (!sport) return facilities;
    return facilities.filter(facility =>
      facility.items.some(item => item.trim() === sport.trim())
    );
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={styles.popularBtn} onClick={onPopularClick}>
            <div className={styles.titleContainer}>
              <p className={styles.buttonSubtitle}>시설 고르기가 어렵다면?</p>
              <div className={styles.buttonTitle}>
                인기 스포츠 시설 추천
                <IconComponent name="arrow_right" size="m" alt="arrow icon" />
              </div>
            </div>
            <ImageComponent
              name="popularImage"
              width={97}
              height={64}
              alt="인기 강좌 버튼 이미지"
            />
          </div>
          <SearchBar />
          <div className={styles.checkboxContainer}>
            <SportsFilter
              options={sportsList}
              value={selectedSport}
              onChange={setSelectedSport}
            />
            <div className={styles.totalText}>
              총<p className={styles.totalTextColor}>{facilities.length}</p>시설
            </div>
          </div>
          {facilities.length > 0 ? (
            <div className={styles.listContainer}>
              {facilities.map(facility => (
                <Link
                  key={`${facility.businessId}-${facility.serialNumber}`}
                  href={`/details/${facility.businessId}/${facility.serialNumber}`}
                >
                  <Schedule facility={facility} />
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
        </>
      )}
    </div>
  );
}
