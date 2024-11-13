import { useEffect, useState } from 'react';
import DetailsMap from '../DetailsMap';
import styles from './LargeMap.module.scss';
import { LargeMapProps } from './LargeMap.types';
import {
  getFacilityDetails,
  FacilityDetails,
} from '@/apis/get/getFacilityDetails';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LargeMap({ businessId, serialNumber }: LargeMapProps) {
  const [facility, setFacility] = useState<FacilityDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      try {
        const data = await getFacilityDetails(businessId, serialNumber);
        setFacility(data);
      } catch (error) {
        setError('시설 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (businessId && serialNumber) {
      fetchFacilityDetails();
    }
  }, [businessId, serialNumber]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      {facility ? (
        <DetailsMap address={facility.address} />
      ) : (
        <p>시설 정보가 없습니다.</p>
      )}
    </div>
  );
}
