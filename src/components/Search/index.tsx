import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import {
  Facility,
  getFacilities,
  GetFacilitiesParams,
} from '@/apis/get/getFacilities';
import styles from './Search.module.scss';
import SearchBar from './SearchBar';
import Link from 'next/link';
import Schedule from '../Schedule';
import IconComponent from '../Asset/Icon';
import { selectedLocalCodeState } from '@/states/filterState';

export default function Search() {
  const router = useRouter();
  const { query } = router.query;
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const selectedLocalCode = useRecoilValue(selectedLocalCodeState);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const params: GetFacilitiesParams = {
          localCode: selectedLocalCode,
        };
        const fetchedFacilities = await getFacilities(params);
        setFacilities(fetchedFacilities);
      } catch (error) {
        console.error('시설 데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchFacilities();
  }, [selectedLocalCode]);

  useEffect(() => {
    if (query && facilities.length > 0) {
      const lowerCaseQuery = String(query).toLowerCase();

      const filtered = facilities.filter(facility => {
        // 검색 조건: name, address, detailAddress, items, owner
        return (
          facility.name.toLowerCase().includes(lowerCaseQuery) ||
          facility.address.toLowerCase().includes(lowerCaseQuery) ||
          facility.detailAddress?.toLowerCase().includes(lowerCaseQuery) ||
          facility.items.some(item =>
            item.toLowerCase().includes(lowerCaseQuery)
          ) ||
          facility.owner.toLowerCase().includes(lowerCaseQuery)
        );
      });

      setFilteredFacilities(filtered);
    }
  }, [query, facilities]);

  return (
    <div className={styles.container}>
      <SearchBar />
      <h2 className={styles.title}>검색 결과</h2>
      {filteredFacilities.length > 0 ? (
        <ul className={styles.scheduleContainer}>
          {filteredFacilities.map(facility => (
            <Link
              key={`${facility.businessId}-${facility.serialNumber}`}
              href={`/details/${facility.businessId}/${facility.serialNumber}`}
            >
              <Schedule facility={facility} />
            </Link>
          ))}
        </ul>
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
            <p className={styles.subText}>검색어를 확인해주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}
