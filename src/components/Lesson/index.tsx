import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  Facility,
  getFacilities,
  GetFacilitiesParams,
} from '@/apis/get/getFacilities';
import {
  selectedCityCodeState,
  selectedLocalCodeState,
  selectedSportState,
} from '@/states/filterState';
import { cityCodes, localCodes } from '@/constants/localCode';
import styles from './Lesson.module.scss';
import SearchBar from '@/components/Search/SearchBar';
import LocalFilter from './LocalFilter';
import SportsFilter from './SportsFilter';
import Schedule from '../Schedule';
import Link from 'next/link';
import ImageComponent from '../Asset/Image';
import { sportsList } from '@/constants/sportsList';

export default function Lesson() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [currentOptions, setCurrentOptions] = useState<{
    [key: string]: string;
  }>({});
  const [isNextStep, setIsNextStep] = useState<boolean>(false);
  const [selectedCityCode, setSelectedCityCode] = useRecoilState(
    selectedCityCodeState
  );
  const [selectedLocalCode, setSelectedLocalCode] = useRecoilState(
    selectedLocalCodeState
  );
  const [selectedSport, setSelectedSport] = useRecoilState(selectedSportState);

  // 초기 데이터 로드 (localCode가 없으면 기본값으로 '11110' 설정)
  useEffect(() => {
    const fetchInitialFacilities = async () => {
      const initialLocalCode = selectedLocalCode || localStorage.getItem('localCode') || '11110';
      if (!selectedLocalCode) setSelectedLocalCode(initialLocalCode);

      try {
        const params: GetFacilitiesParams = {
          localCode: initialLocalCode,
        };

        const fetchedFacilities = await getFacilities(params);
        setFacilities(filterFacilitiesBySport(fetchedFacilities, selectedSport));
        setCurrentOptions(localCodes[selectedCityCode] || {});
      } catch {
        console.error('초기 시설 데이터를 불러오는 데 실패했습니다.');
      }
    };

    fetchInitialFacilities();
  }, [selectedLocalCode, selectedSport]);

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
      localStorage.setItem('localCode', key); // 로컬 스토리지에 로컬 코드 저장 => 확인 
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
    } catch {
      console.error('시설 데이터를 불러오는 데 실패했습니다.');
    }
  };

  const filterFacilitiesBySport = (
    facilities: Facility[],
    sport: string
  ): Facility[] => {
    if (!sport) return facilities;
    return facilities.filter(facility =>
      facility.items.some(item => item.trim() === sport.trim())
    );
  };

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
          <ImageComponent
            name="popularImage"
            width={46}
            height={44}
            alt="인기 강좌 버튼 이미지"
          />
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
          options={sportsList}
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
            href={`/details/${facility.businessId}/${facility.serialNumber}`}
          >
            <Schedule facility={facility} />
          </Link>
        ))}
      </div>
    </div>
  );
}
