import { useEffect, useState } from 'react';
import DetailsMap from '../DetailsMap';
import styles from './LargeMap.module.scss';
import { LargeMapProps } from './LargeMap.types';
import {
  getNomalFacilityDetails,
  getSpecialFacilityDetails,
  NomalFacilityDetails,
  SpecialFacilityDetails,
} from '@/apis/get/getFacilityDetails';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LargeMap({ businessId, serialNumber }: LargeMapProps) {
  const [facility, setFacility] = useState<
    NomalFacilityDetails | SpecialFacilityDetails | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      try {
        setLoading(true);
        let data: NomalFacilityDetails | SpecialFacilityDetails;

        if (serialNumber) {
          data = await getNomalFacilityDetails(businessId, serialNumber);
        } else {
          data = await getSpecialFacilityDetails(businessId);
        }

        setFacility(data);
      } catch (error) {
        console.log('시설 정보를 가져오는 데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchFacilityDetails();
    }
  }, [businessId, serialNumber]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      {facility ? (
        <DetailsMap
          address={
            (facility as NomalFacilityDetails | SpecialFacilityDetails).address
          }
          isNormal={serialNumber ? true : false}
        />
      ) : (
        <p>시설 정보가 없습니다.</p>
      )}
    </div>
  );
}
