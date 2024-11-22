import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import {
  NomalFacility,
  getNomalFacilities,
  GetNomalFacilitiesParams,
  SpecialFacility,
  getSpecialFacilities,
} from '@/apis/get/getFacilities';
import styles from './Search.module.scss';
import SearchBar from './SearchBar';
import Link from 'next/link';
import Schedule from '../Schedule';
import IconComponent from '../Asset/Icon';
import { selectedLocalCodeState } from '@/states/filterState';
import { toggleState } from '@/states/toggleState';

export default function Search() {
  const router = useRouter();
  const { query } = router.query;
  const [facilities, setFacilities] = useState<
    NomalFacility[] | SpecialFacility[]
  >([]);
  const [filteredFacilities, setFilteredFacilities] = useState<
    NomalFacility[] | SpecialFacility[]
  >([]);
  const selectedLocalCode = useRecoilValue(selectedLocalCodeState);
  const toggle = useRecoilValue(toggleState);

  // 시설 목록을 가져오는 함수
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const params: GetNomalFacilitiesParams = {
          localCode: selectedLocalCode,
        };

        if (toggle === 'special') {
          const fetchedFacilities = await getSpecialFacilities({
            localCode: selectedLocalCode,
          });
          setFacilities(fetchedFacilities);
        } else {
          const fetchedFacilities = await getNomalFacilities(params);
          setFacilities(fetchedFacilities);
        }
      } catch (error) {
        console.error('시설 데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchFacilities();
  }, [selectedLocalCode, toggle]);

  // 검색 필터 적용
  useEffect(() => {
    if (query && facilities.length > 0) {
      const lowerCaseQuery = String(query).toLowerCase();

      const filtered = facilities.filter(facility => {
        // 검색 조건: name, address, detailAddress, items
        return (
          ('name' in facility &&
            facility.name.toLowerCase().includes(lowerCaseQuery)) ||
          ('address' in facility &&
            facility.address.toLowerCase().includes(lowerCaseQuery)) ||
          ('detailAddress' in facility &&
            facility.detailAddress?.toLowerCase().includes(lowerCaseQuery)) ||
          ('items' in facility &&
            facility.items.some(item =>
              item.toLowerCase().includes(lowerCaseQuery)
            ))
        );
      });

      setFilteredFacilities(filtered);
    }
  }, [query, facilities]);

  return (
    <div className={styles.container}>
      <SearchBar searchCase="replace" />
      <h2 className={styles.title}>검색 결과</h2>
      {filteredFacilities.length > 0 ? (
        <ul className={styles.scheduleContainer}>
          {filteredFacilities.map(facility => (
            <Link
              key={`${facility.businessId}-${'serialNumber' in facility ? `/${facility.serialNumber}` : ''}`}
              href={`/details/${facility.businessId}${'serialNumber' in facility ? `/${facility.serialNumber}` : ''}`}
            >
              <Schedule facility={facility} />
            </Link>
          ))}
        </ul>
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
            <p className={styles.subText}>검색어를 확인해주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}
