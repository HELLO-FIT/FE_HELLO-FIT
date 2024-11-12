import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar/SearchBar';
import styles from './Lesson.module.scss';
import ImageComponent from '../Asset/Image';
import IconComponent from '../Asset/Icon';
import Schedule from '../Schedule';
import {
  Facility,
  getFacilities,
  GetFacilitiesParams,
} from '@/apis/get/getFacilities';
import Checkbox from '../Checkbox/Checkbox';
import Link from 'next/link';
import { cityCodes, localCodes } from '@/constants/localCode';

export default function Lesson() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedCityCode, setSelectedCityCode] = useState<string>(''); // cityCode 선택
  const [selectedLocalCode, setSelectedLocalCode] = useState<string>(''); // localCode 선택
  const [localCodeList, setLocalCodeList] = useState<{ [key: string]: string }>(
    {}
  );
  const [isLocalCodeVisible, setIsLocalCodeVisible] = useState<boolean>(false); // localCode 드롭다운 표시 여부

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        if (selectedLocalCode) {
          const params: GetFacilitiesParams = {
            localCode: selectedLocalCode,
          };

          const fetchedFacilities = await getFacilities(params);
          setFacilities(fetchedFacilities);
        }
      } catch (error) {
        console.log(error, '시설 데이터를 불러오는 데 실패했습니다.');
      }
    };

    if (selectedLocalCode) {
      fetchFacilities();
    }
  }, [selectedLocalCode]);

  useEffect(() => {
    if (selectedCityCode) {
      setLocalCodeList(localCodes[selectedCityCode] || {});
      setIsLocalCodeVisible(true);
      setSelectedLocalCode('');
    } else {
      setIsLocalCodeVisible(false);
    }
  }, [selectedCityCode]);

  const handleCityCodeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCityCode(event.target.value);
  };

  const handleLocalCodeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLocalCode(event.target.value);
  };

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
        <IconComponent name="right" size="l" />
      </div>
      <div className={styles.locationSelectors}>
        <select onChange={handleCityCodeChange} value={selectedCityCode}>
          <option value="">시도를 선택하세요</option>
          {Object.entries(cityCodes).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        {isLocalCodeVisible && (
          <select
            onChange={handleLocalCodeChange}
            value={selectedLocalCode}
            disabled={!selectedCityCode}
          >
            <option value="">시군구를 선택하세요</option>
            {Object.entries(localCodeList).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className={styles.checkboxContainer}>
        <Checkbox>장애 지원 시설</Checkbox>
        <div className={styles.totalText}>
          총<p className={styles.totalTextColor}>{facilities.length}</p>시설
        </div>
      </div>
      <div className={styles.listContainer}>
        {facilities.map(facility => (
          <Link
            key={facility.businessId}
            href={`/details/${facility.businessId}`}
          >
            <Schedule facility={facility} />
          </Link>
        ))}
      </div>
    </div>
  );
}
