import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './CourseDetails.module.scss';
import { FacilityDetails } from '@/apis/get/getFacilityDetails';
import { CourseDetailsProps } from './CourseDetails.types';
import Chips from '../Button/Chips';
import IconComponent from '../Asset/Icon';
import DetailsMap from './DetailsMap';
import CourseCard from './CourseCard';
import InfoCard from './InfoCard';
import { getFacilityDetails } from '@/apis/get/getFacilityDetails';
import LoadingSpinner from '../LoadingSpinner';

export default function CourseDetails({
  businessId,
  serialNumber,
}: CourseDetailsProps) {
  const [facility, setFacility] = useState<FacilityDetails | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (businessId) {
      const fetchFacilityDetails = async () => {
        try {
          const facilityData = await getFacilityDetails(
            businessId,
            serialNumber
          );
          setFacility(facilityData);
        } catch (error) {
          console.error('Error fetching facility details:', error);
        }
      };

      fetchFacilityDetails();
    }
  }, [businessId, serialNumber]);

  const handleMapClick = () => {
    if (facility) {
      router.push(
        `/details/${facility.businessId}/${facility.serialNumber}/map`
      );
    }
  };

  if (!facility) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      <section className={styles.titleBtnSection}>
        <h1 className={styles.name}>{facility.name}</h1>
        <div className={styles.chipsContainer}>
          {facility.items.map((item, index) => (
            <Chips key={index} chipState="sports" text={item} />
          ))}
        </div>
      </section>
      <div className={styles.infoContainer}>
        <div>
          <label className={styles.title}>위치</label>
          <div className={styles.mapContainer}>
            <DetailsMap address={facility.address} radius={true} />
          </div>
          <div className={styles.addressWrapper} onClick={handleMapClick}>
            <div className={styles.address}>
              <IconComponent name="addressMarker" width={16} height={16} />
              {facility.address}
            </div>
            <div className={styles.rightIcon}>
              <IconComponent name="right" size="m" />
            </div>
          </div>
        </div>
        <div className={styles.facilityInfo}>
          <label className={styles.title}>시설 정보</label>
          <InfoCard contact={facility.phone} representative={facility.owner} />
        </div>
        <div className={styles.labelSectionWrapper}>
          {facility.courses.map((course, index) => (
            <div key={index} className={styles.facilityInfo}>
              <label className={styles.title}>
                {facility.courses.length === 1
                  ? '개설 강좌'
                  : `개설 강좌 ${index + 1}`}
              </label>
              <CourseCard
                courseName={course.courseName}
                instructor={course.instructor}
                startTime={course.startTime}
                endTime={course.endTime}
                workday={course.workday}
                price={course.price}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
