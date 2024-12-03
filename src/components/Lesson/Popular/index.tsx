import {
  getNomalPopular,
  getSpecialPopular,
  NomalPopular,
  SpecialPopular,
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
import { specialTypeList } from '@/constants/specialList';
import Tooltip from '@/components/Tooltip/Tooltip';
import SpecialFilterForPopular from './SpecialFilterForPopular';
import { useRouter } from 'next/router';

export default function Popular() {
  const [facilities, setFacilities] = useState<
    NomalPopular[] | SpecialPopular[]
  >([]);
  const [topFacilities, setTopFacilities] = useState<
    NomalPopular[] | SpecialPopular[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLocalCode] = useRecoilState(selectedLocalCodeState);
  const [selectedSport, setSelectedSport] = useRecoilState(selectedSportState);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('total');
  const [selectedSortName, setSelectedSortName] = useState('누적 수강 수');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggle = useRecoilValue(toggleState);
  const [specialFilterValue, setSpecialFilterValue] = useState<string>('');
  const router = useRouter();

  const handleSpecialFilterChange = (type: string) => {
    setSpecialFilterValue(type);
  };

  // 인기 TOP5 데이터 페칭
  useEffect(() => {
    const fetchTopFacilities = async () => {
      if (!selectedLocalCode) return;
      setIsLoading(true);

      try {
        let fetchedFacilities;

        if (toggle === 'special') {
          const params = {
            localCode: selectedLocalCode,
            type: undefined,
          };
          fetchedFacilities = await getSpecialPopular(params);
        } else {
          const params = { localCode: selectedLocalCode };
          fetchedFacilities = await getNomalPopular(params);
        }

        setTopFacilities(fetchedFacilities.slice(0, 5));
      } catch (error) {
        console.error('TOP5 데이터를 불러오는 데 실패했습니다.', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopFacilities();
  }, [selectedLocalCode, toggle, specialFilterValue]);

  useEffect(() => {
    const fetchFacilities = async () => {
      if (!selectedLocalCode) return;
      setIsLoading(true);

      try {
        let fetchedFacilities;

        if (toggle === 'special') {
          const params = {
            localCode: selectedLocalCode,
            type: specialFilterValue || undefined,
          };
          fetchedFacilities = await getSpecialPopular(params);
        } else {
          const params = { localCode: selectedLocalCode };
          fetchedFacilities = await getNomalPopular(params);
        }
        setFacilities(fetchedFacilities);
      } catch (error) {
        console.error('필터링된 데이터를 불러오는 데 실패했습니다.', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, [selectedLocalCode, toggle, specialFilterValue]);

  const filterFacilitiesBySport = (
    facilities: NomalPopular[] | SpecialPopular[],
    sport: string
  ): NomalPopular[] | SpecialPopular[] => {
    if (!sport) return facilities;
    return facilities.filter(facility =>
      facility.items.some(item => item.trim() === sport.trim())
    );
  };

  const sortFacilities = (
    facilities: NomalPopular[] | SpecialPopular[],
    sort: string
  ): NomalPopular[] | SpecialPopular[] => {
    switch (sort) {
      case 'total':
        return [...facilities].sort(
          (a, b) => b.totalParticipantCount - a.totalParticipantCount
        );
      case 'average':
        return [...facilities].sort((a, b) => b.averageScore - a.averageScore);
      case 'review':
        return [...facilities].sort((a, b) => b.reviewCount - a.reviewCount);
      case 'favorite':
        return [...facilities].sort(
          (a, b) => b.favoriteCount - a.favoriteCount
        );
      default:
        return facilities;
    }
  };

  const handleSelectSort = (sort: string) => {
    setSelectedSort(sort);
    setIsDropdownOpen(false);
    if (sort === 'total') {
      setSelectedSortName('누적 수강 수');
    } else if (sort === 'average') {
      setSelectedSortName('별점 순');
    } else if (sort === 'review') {
      setSelectedSortName('후기 개수');
    } else if (sort === 'favorite') {
      setSelectedSortName('찜 개수');
    }

    const query = { ...router.query, sort };
    router.push({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (router.query.sort) {
      const sortValue = router.query.sort as string;
      setSelectedSort(sortValue);

      switch (sortValue) {
        case 'total':
          setSelectedSortName('누적 수강 수');
          break;
        case 'average':
          setSelectedSortName('별점 순');
          break;
        case 'review':
          setSelectedSortName('후기 개수');
          break;
        case 'favorite':
          setSelectedSortName('찜 개수');
          break;
        default:
          setSelectedSortName('누적 수강 수'); // 기본값
      }
    }
  }, [router.query.sort]);

  const filteredFacilities = filterFacilitiesBySport(facilities, selectedSport);
  const sortedFacilities = sortFacilities(filteredFacilities, selectedSort);

  const parseLocalCode = (localCode: string): string => {
    const cityCode = localCode.slice(0, 2);

    const city = localCodes[cityCode];
    if (!city) {
      return '알 수 없는 지역';
    }

    const cityName = cityCodes[cityCode];
    if (!cityName) {
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
              {`인기 시설 TOP ${topFacilities.length}`}
            </div>
            <div className={styles.bestContainer}>
              <Swiper
                spaceBetween={12}
                loop={true}
                pagination={{ clickable: true }}
                breakpoints={{
                  0: {
                    slidesPerView: 2,
                  },
                  390: {
                    slidesPerView: 2.2,
                  },
                  430: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 3.5,
                  },
                }}
              >
                {topFacilities.map((facility, index) => (
                  <SwiperSlide
                    className={styles.facilityCard}
                    key={`${facility.businessId}-${'serialNumber' in facility ? `/${facility.serialNumber}` : ''}`}
                  >
                    <Link
                      key={`${facility.businessId}-${'serialNumber' in facility ? `/${facility.serialNumber}` : ''}`}
                      href={`/details/${facility.businessId}${'serialNumber' in facility ? `/${facility.serialNumber}` : ''}`}
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
                        serialNumber={toggle === 'general' ? true : false}
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
                {toggle === 'special' && (
                  <Tooltip
                    text="유형에 따른 인기 강좌를 추천해드려요!"
                    position="center"
                  >
                    <SpecialFilterForPopular
                      options={specialTypeList}
                      value={specialFilterValue}
                      onChange={handleSpecialFilterChange}
                    />
                  </Tooltip>
                )}
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
                <div
                  className={styles.selectedSort}
                  onClick={toggleDropdown}
                  ref={dropdownRef}
                >
                  <span>{selectedSortName}</span>
                  <IconComponent
                    name={isDropdownOpen ? 'up' : 'down'}
                    size="s"
                    alt="sort arrow"
                  />
                </div>
                {isDropdownOpen && (
                  <div className={styles.sortOptions} ref={dropdownRef}>
                    <div
                      className={styles.sortOption}
                      onClick={() => handleSelectSort('total')}
                    >
                      누적 수강 수
                    </div>
                    <div
                      className={styles.sortOption}
                      onClick={() => handleSelectSort('average')}
                    >
                      별점 순
                    </div>
                    <div
                      className={styles.sortOption}
                      onClick={() => handleSelectSort('review')}
                    >
                      후기 개수
                    </div>
                    <div
                      className={styles.sortOption}
                      onClick={() => handleSelectSort('favorite')}
                    >
                      찜 개수
                    </div>
                  </div>
                )}
              </div>
            </div>
            {sortedFacilities.length > 0 ? (
              <div className={styles.listContainer}>
                {sortedFacilities.map(facility => (
                  <Link
                    key={`${facility.businessId}-${'serialNumber' in facility ? `/${facility.serialNumber}` : ''}`}
                    href={`/details/${facility.businessId}${'serialNumber' in facility ? `/${facility.serialNumber}` : ''}`}
                  >
                    <PopularSchedule facility={facility} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.resultContainer}>
                <IconComponent
                  name={toggle === 'general' ? 'noResult' : 'noResultSP'}
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
