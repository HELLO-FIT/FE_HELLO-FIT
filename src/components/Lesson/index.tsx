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
import IconComponent from '../Asset/Icon';

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

  // 초기 데이터 로드
  useEffect(() => {
    const fetchInitialData = async () => {
      const storedLocalCode = localStorage.getItem('localCode') || '11110';
      const defaultCityCode =
        Object.keys(localCodes).find(cityCode =>
          Object.keys(localCodes[cityCode]).includes(storedLocalCode)
        ) || '11'; // 기본 cityCode

      setSelectedLocalCode(storedLocalCode);
      setSelectedCityCode(defaultCityCode);

      try {
        const params: GetFacilitiesParams = {
          localCode: storedLocalCode,
        };

        const fetchedFacilities = await getFacilities(params);
        setFacilities(
          filterFacilitiesBySport(fetchedFacilities, selectedSport)
        );
        setCurrentOptions(localCodes[defaultCityCode] || {});
      } catch {
        console.error('초기 데이터를 불러오는 데 실패했습니다.');
      }
    };

    fetchInitialData();
  }, []);

  // 지역 변경 시 필터 업데이트
  useEffect(() => {
    if (selectedCityCode && localCodes[selectedCityCode]) {
      setCurrentOptions(localCodes[selectedCityCode]);
    } else {
      setCurrentOptions({});
    }
  }, [selectedCityCode]);

  // 필터 값 변경 처리
  const handleValueChange = (key: string) => {
    if (isNextStep) {
      setSelectedLocalCode(key);
    } else {
      setSelectedCityCode(key);
    }
  };

  // '다음' 버튼 클릭 처리
  const handleNextClick = () => {
    if (selectedCityCode) {
      setIsNextStep(true);
    }
  };

  // '선택 완료' 버튼 클릭 처리
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
      console.error('데이터를 불러오는 데 실패했습니다.');
    }
  };

  // 스포츠 필터링
  const filterFacilitiesBySport = (
    facilities: Facility[],
    sport: string
  ): Facility[] => {
    if (!sport) return facilities;
    return facilities.filter(facility =>
      facility.items.some(item => item.trim() === sport.trim())
    );
  };

  // 선택한 지역 placeholder
  const selectedRegion =
    selectedCityCode &&
    selectedLocalCode &&
    cityCodes[selectedCityCode] &&
    localCodes[selectedCityCode] &&
    localCodes[selectedCityCode][selectedLocalCode]
      ? `${cityCodes[selectedCityCode]} ${localCodes[selectedCityCode][selectedLocalCode]}`
      : `${cityCodes[selectedCityCode] || '-'} ${localCodes[selectedCityCode]?.[selectedLocalCode] || '-'}`;

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
    </div>
  );
}
