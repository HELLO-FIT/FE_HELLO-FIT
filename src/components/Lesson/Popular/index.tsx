import {
  getNomalPopular,
  getNomalPopularParams,
  NomalPopular,
} from '@/apis/get/getPopular';
import styles from './Popular.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  selectedLocalCodeState,
  selectedSportState,
} from '@/states/filterState';
import Link from 'next/link';
import IconComponent from '@/components/Asset/Icon';
import LoadingSpinner from '@/components/LoadingSpinner';
import SportsFilter from '../SportsFilter';
import { sportsList } from '@/constants/sportsList';
import { cityCodes, localCodes } from '@/constants/localCode';
import Chips from '@/components/Button/Chips';
import SportsImageComponent from '@/components/Asset/SportsImage';
import { SPORTSIMAGES } from '@/constants/asset';
import { formatCurrency } from '@/utils/formatCurrency';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import useOutsideClick from '@/hooks/useOutsideClick';
import { toggleState } from '@/states/toggleState';
import PopularSchedule from '@/components/Schedule/PopularSchedule';

export default function Popular() {
  const [facilities, setFacilities] = useState<NomalPopular[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLocalCode] = useRecoilState(selectedLocalCodeState);
  const [selectedSport, setSelectedSport] = useRecoilState(selectedSportState);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('인기순');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const topFacilities = facilities.slice(0, 5);
  const toggle = useRecoilValue(toggleState);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleSelectSort = (sort: string) => {
    setSelectedSort(sort);
    setIsDropdownOpen(false);
  };

  useOutsideClick(dropdownRef, toggleDropdown);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={styles.topContainer}>
            <div className={styles.titleContainer}>
              <h2
                className={toggle === 'general' ? styles.title : styles.titleSP}
              >
                {parseLocalCode(selectedLocalCode)}
              </h2>
              인기 시설 TOP 5
            </div>
            <div className={styles.bestContainer}>
              <Swiper
                spaceBetween={12}
                loop={true}
                pagination={{ clickable: true }}
                breakpoints={{
                  // 모바일
                  0: {
                    slidesPerView: 2,
                  },
                  390: {
                    slidesPerView: 2.2,
                  },
                  430: {
                    slidesPerView: 2.5,
                  },
                  // PC
                  1024: {
                    slidesPerView: 3.5,
                  },
                }}
              >
                {topFacilities.map((facility, index) => (
                  <SwiperSlide
                    className={styles.facilityCard}
                    key={`${facility.businessId}-${facility.serialNumber}`}
                  >
                    <Link
                      key={`${facility.businessId}-${facility.serialNumber}`}
                      href={`/details/${facility.businessId}/${facility.serialNumber}`}
                    >
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
                          {facility.items.length > 1
                            ? `${facility.items[0]} 외`
                            : facility.items[0]}
                        </p>
                      </div>
                      <Chips
                        chipState="top"
                        text={`누적 수강 ${formatCurrency(facility.totalParticipantCount)}`}
                        serialNumber
                      />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
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
                  <p
                    className={
                      toggle === 'general'
                        ? styles.totalTextColor
                        : styles.totalTextColorSP
                    }
                  >
                    {filteredFacilities.length}
                  </p>
                  시설
                </div>
              </div>
              <div className={styles.sortContainer}>
                <div className={styles.sort} onClick={toggleDropdown}>
                  <span className={styles.selectedSort}>{selectedSort}</span>
                  <IconComponent
                    name={isDropdownOpen ? 'up' : 'down'}
                    size="s"
                    alt="sort arrow"
                  />
                </div>
                {isDropdownOpen && (
                  <div
                    className={styles.dropdown}
                    onClick={() => handleSelectSort('인기순')}
                    ref={dropdownRef}
                  >
                    <div className={styles.sort}>인기순</div>
                  </div>
                )}
              </div>
            </div>
            {filteredFacilities.length > 0 ? (
              <div className={styles.listContainer}>
                {filteredFacilities.map(facility => (
                  <Link
                    key={`${facility.businessId}-${facility.serialNumber}`}
                    href={`/details/${facility.businessId}/${facility.serialNumber}`}
                  >
                    <PopularSchedule facility={facility} />
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
