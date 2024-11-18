import IconComponent from '@/components/Asset/Icon';
import styles from './TabNav.module.scss';
import LocalFilter from '@/components/Lesson/LocalFilter';
import { useRouter } from 'next/router';
import {
  getNomalPopular,
  getNomalPopularParams,
  NomalPopular,
} from '@/apis/get/getPopular';
import { cityCodes, localCodes } from '@/constants/localCode';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  selectedCityCodeState,
  selectedLocalCodeState,
} from '@/states/filterState';
import { TabNavProps } from './TabNav.types';
import Tooltip from '@/components/Tooltip/Tooltip';

export default function TabNav({ showmenu = true }: TabNavProps) {
  const router = useRouter();
  const [facilities, setFacilities] = useState<NomalPopular[]>([]);
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

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  // 초기 데이터 로드
  useEffect(() => {
    const fetchInitialData = async () => {
      const storedLocalCode = localStorage.getItem('localCode') || '11110';
      const defaultCityCode =
        Object.keys(localCodes).find(cityCode =>
          Object.keys(localCodes[cityCode]).includes(storedLocalCode)
        ) || '11';

      setSelectedLocalCode(storedLocalCode);
      setSelectedCityCode(defaultCityCode);

      try {
        const params: getNomalPopularParams = {
          localCode: storedLocalCode,
        };

        const fetchedFacilities = await getNomalPopular(params);
        setFacilities(fetchedFacilities);
        setCurrentOptions(localCodes[storedLocalCode] || {});
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

  const handleMenuClick = () => {
    router.push('/setting');
  };

  const handleValueChange = (key: string) => {
    if (isNextStep) {
      setSelectedLocalCode(key);
    } else {
      setSelectedCityCode(key);
    }
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
    <header className={styles.container}>
      <div className={styles.headerContainer}>
        <LocalFilter
          options={isNextStep ? currentOptions : cityCodes}
          value={isNextStep ? selectedLocalCode : selectedCityCode}
          onChange={handleValueChange}
          title={isNextStep ? '시군구 선택 (2/2)' : '시도 선택 (1/2)'}
          placeholder={selectedRegion}
          onNextClick={() => setIsNextStep(true)}
          onCompleteClick={() => setIsNextStep(false)}
          isNextStep={isNextStep}
          placeholderType="lesson"
        />
        {showmenu && (
          <div className={styles.btnContainer} onClick={handleMenuClick}>
            <IconComponent name="menu" size="l" />
          </div>
        )}
      </div>
      <div className={styles.tabs}>
        <button
          className={`${styles.button} ${router.pathname === '/lesson' ? styles.active : ''}`}
          onClick={() => handleTabClick('/lesson')}
        >
          전체
        </button>
        <Tooltip text="시설을 추천해드려요!">
          <button
            className={`${styles.button} ${router.pathname === '/popular' ? styles.active : ''}`}
            onClick={() => handleTabClick('/popular')}
          >
            인기
          </button>
        </Tooltip>
      </div>
    </header>
  );
}
