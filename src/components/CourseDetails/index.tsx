import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './CourseDetails.module.scss';
import {
  getNomalFacilityDetails,
  getSpecialFacilityDetails,
  NomalFacilityDetails,
  SpecialFacilityDetails,
} from '@/apis/get/getFacilityDetails';
import { CourseDetailsProps } from './CourseDetails.types';
import Chips from '../Button/Chips';
import IconComponent from '../Asset/Icon';
import DetailsMap from './DetailsMap';
import CourseCard from './CourseCard';
import InfoCard from './InfoCard';
import LoadingSpinner from '../LoadingSpinner';
import SpecialInfoCard from './SpecialInfoCard';
import ReviewCard from './ReviewCard';

export default function CourseDetails({
  businessId,
  serialNumber,
}: CourseDetailsProps) {
  const [facility, setFacility] = useState<
    NomalFacilityDetails | SpecialFacilityDetails | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isNomalFacility = (
    facility: NomalFacilityDetails | SpecialFacilityDetails
  ): facility is NomalFacilityDetails => 'serialNumber' in facility;

  useEffect(() => {
    if (businessId) {
      const fetchFacilityDetails = async () => {
        try {
          setLoading(true);
          let facilityData;

          if (serialNumber) {
            facilityData = await getNomalFacilityDetails(
              businessId,
              serialNumber
            );
          } else {
            facilityData = await getSpecialFacilityDetails(businessId);
          }

          setFacility(facilityData);
        } catch (error) {
          console.error('Error fetching facility details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchFacilityDetails();
    }
  }, [businessId, serialNumber]);

  const handleMapClick = () => {
    if (facility) {
      if (isNomalFacility(facility)) {
        router.push(
          `/details/${facility.businessId}/${facility.serialNumber}/map`
        );
      } else {
        router.push(`/details/${facility.businessId}/map`);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!facility) {
    return <div>시설 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <section className={styles.titleBtnSection}>
        <h1 className={styles.name}>{facility.name}</h1>
        <div className={styles.chipsContainer}>
          {facility.items.map((item, index) => (
            <Chips
              key={index}
              chipState="sports"
              text={item}
              serialNumber={serialNumber ? true : false}
            />
          ))}
        </div>
      </section>
      <div className={styles.infoContainer}>
        <div>
          <label className={styles.title}>시설 위치</label>
          <div className={styles.mapContainer}>
            <DetailsMap
              address={facility.address}
              radius={true}
              isNormal={serialNumber ? true : false}
            />
          </div>
          <div className={styles.addressWrapper} onClick={handleMapClick}>
            <div className={styles.address}>
              <IconComponent
                name={serialNumber ? 'addressMarker' : 'addressMarkerSP'}
                width={16}
                height={16}
              />
              {facility.address}
            </div>
            <div className={styles.rightIcon}>
              <IconComponent name="right" size="m" />
            </div>
          </div>
        </div>
        <div className={styles.facilityInfo}>
          <label className={styles.title}>시설 정보</label>
          {isNomalFacility(facility) ? (
            <InfoCard
              contact={facility.phone}
              representative={facility.owner}
            />
          ) : (
            <InfoCard contact={facility.phone} />
          )}
        </div>
        {!isNomalFacility(facility) && (
          <div className={styles.facilityInfo}>
            <label className={styles.title}>장애 지원 정보</label>
            <SpecialInfoCard specialType={facility.types} />
          </div>
        )}
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
                instructor={
                  'instructor' in course ? course.instructor : undefined
                }
                startTime={course.startTime}
                endTime={course.endTime}
                workday={course.workday}
                price={course.price}
                isNormal={serialNumber ? true : false}
              />
            </div>
          ))}
        </div>
      </div>
      <ReviewCard
        businessId={businessId}
        serialNumber={serialNumber}
        averageScore={facility.averageScore}
        reviews={facility.reviews}
      />
    </div>
  );
}
