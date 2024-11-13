import { useEffect, useState } from 'react';
import {
  Facility,
  getFacilities,
  GetFacilitiesParams,
} from '@/apis/get/getFacilities';
import { cityCodes, localCodes } from '@/constants/localCode';
import styles from './Lesson.module.scss';
import SearchBar from '@/components/SearchBar/SearchBar';
import LocalFilter from './LocalFilter';
import SportsFilter from './SportsFilter';
import Schedule from '../Schedule';
import Link from 'next/link';

export default function Lesson() {
  const DEFAULT_CITY_CODE = '11'; // 서울
  const DEFAULT_LOCAL_CODE = '11680'; // 서울 강남구

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedCityCode, setSelectedCityCode] =
    useState<string>(DEFAULT_CITY_CODE);
  const [selectedLocalCode, setSelectedLocalCode] =
    useState<string>(DEFAULT_LOCAL_CODE);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [currentOptions, setCurrentOptions] = useState<{
    [key: string]: string;
  }>({});
  const [isNextStep, setIsNextStep] = useState<boolean>(false);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchInitialFacilities = async () => {
      try {
        const params: GetFacilitiesParams = {
          localCode: DEFAULT_LOCAL_CODE,
        };

        const fetchedFacilities = await getFacilities(params);
        setFacilities(
          filterFacilitiesBySport(fetchedFacilities, selectedSport)
        );
        setCurrentOptions(localCodes[DEFAULT_CITY_CODE]);
      } catch (error) {
        console.error('초기 시설 데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchInitialFacilities();
  }, []);

  // 지역 데이터 필터링
  useEffect(() => {
    if (selectedCityCode && localCodes[selectedCityCode]) {
      setCurrentOptions(localCodes[selectedCityCode]);
    } else {
      setCurrentOptions({});
    }
  }, [selectedCityCode]);

  const handleNextClick = () => {
    if (selectedCityCode) {
      setIsNextStep(true);
    }
  };

  const handleValueChange = (key: string) => {
    if (isNextStep) {
      setSelectedLocalCode(key);
    } else {
      setSelectedCityCode(key);
    }
  };

  const handleCompleteClick = async () => {
    if (!selectedCityCode || !selectedLocalCode) return;
    setIsNextStep(false);

    try {
      const params: GetFacilitiesParams = {
        localCode: selectedLocalCode,
      };

      const fetchedFacilities = await getFacilities(params);
      setFacilities(filterFacilitiesBySport(fetchedFacilities, selectedSport));
    } catch (error) {
      console.error('시설 데이터를 불러오는 데 실패했습니다:', error);
    }
  };

  const filterFacilitiesBySport = (
    facilities: Facility[],
    sport: string
  ): Facility[] => {
    if (!sport) return facilities; // 스포츠 선택이 없으면 전체 반환
    return facilities.filter(facility =>
      facility.items.some(item => item.trim() === sport.trim())
    );
  };

  // 스포츠 변경 시 데이터 다시 가져오기
  useEffect(() => {
    const fetchFilteredFacilities = async () => {
      if (!selectedCityCode || !selectedLocalCode) return;

      try {
        const params: GetFacilitiesParams = {
          localCode: selectedLocalCode,
        };

        const fetchedFacilities = await getFacilities(params);
        setFacilities(
          filterFacilitiesBySport(fetchedFacilities, selectedSport)
        );
      } catch (error) {
        console.error('스포츠 필터링 데이터 가져오기에 실패했습니다:', error);
      }
    };

    fetchFilteredFacilities();
  }, [selectedSport, selectedCityCode, selectedLocalCode]);

  const selectedRegion =
    selectedCityCode &&
    selectedLocalCode &&
    cityCodes[selectedCityCode] &&
    localCodes[selectedCityCode] &&
    localCodes[selectedCityCode][selectedLocalCode]
      ? `${cityCodes[selectedCityCode]} ${localCodes[selectedCityCode][selectedLocalCode]}`
      : '지역';

  return (
    <div className={styles.container}>
      <SearchBar />
      <div className={styles.popularBtn}>
        <div className={styles.leftContainer}>
          <div className={styles.titleContainer}>
            <p className={styles.buttonSubtitle}>살펴보세요!</p>
            <p className={styles.buttonTitle}>우리 동네 인기 스포츠 강좌</p>
          </div>
        </div>
      </div>
      <div className={styles.locationSelectors}>
        <LocalFilter
          options={isNextStep ? currentOptions : cityCodes}
          value={isNextStep ? selectedLocalCode : selectedCityCode}
          onChange={handleValueChange}
          title={isNextStep ? '시군구 선택 (2/2)' : '시도 선택 (1/2)'}
          placeholder={selectedRegion}
          onNextClick={handleNextClick}
          onCompleteClick={handleCompleteClick}
          isNextStep={isNextStep}
        />
        <SportsFilter
          options={['축구', '농구', '배드민턴']}
          value={selectedSport}
          onChange={setSelectedSport}
        />
      </div>
      <div className={styles.checkboxContainer}>
        <div className={styles.totalText}>
          총<p className={styles.totalTextColor}>{facilities.length}</p>시설
        </div>
      </div>
      <div className={styles.listContainer}>
        {facilities.map(facility => (
          <Link
            key={`${facility.businessId}-${facility.serialNumber}`}
            href={`/details/${facility.businessId}`}
          >
            <Schedule facility={facility} />
          </Link>
        ))}
      </div>
    </div>
  );
}
