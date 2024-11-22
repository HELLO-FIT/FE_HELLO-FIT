import React, { useState } from 'react';
import styles from './SpecialFilter.module.scss';
import { SpecialFilterProps } from './SpecialFilter.types';
import IconComponent from '@/components/Asset/Icon';
import classNames from 'classnames';
import Chips from '@/components/Button/Chips';

export default function SpecialFilter({
  types,
  amenities,
  value,
  onChange,
}: SpecialFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string | undefined>(
    value || undefined
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleOptionClick = (option: string, type: 'type' | 'amenity') => {
    if (type === 'type') {
      const updatedTypes = selectedTypes === option ? undefined : option;
      setSelectedTypes(updatedTypes);
    } else {
      const updatedAmenities = selectedAmenities.includes(option)
        ? selectedAmenities.filter(item => item !== option)
        : [...selectedAmenities, option];
      setSelectedAmenities(updatedAmenities);
    }
  };

  const handleReset = () => {
    setSelectedTypes(undefined);
    setSelectedAmenities([]);
    onChange('', []);
  };

  const handleSave = () => {
    setIsOpen(false);
    onChange(selectedTypes || '', selectedAmenities);
  };

  const count = (selectedTypes ? 1 : 0) + selectedAmenities.length;

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.selectedValueSP, {
          [styles.selectedDropdownSP]: count > 0,
        })}
        onClick={() => setIsOpen(!isOpen)}
      >
        {count > 0 ? `특수 필터 ${count}` : '특수 필터'}
        <IconComponent
          name={isOpen ? 'up' : 'down'}
          size="m"
          alt="dropdown arrow"
        />
      </div>
      {isOpen && (
        <>
          <div className={styles.background}>
            <header className={styles.header}>
              <h2 className={styles.title}>특수 필터</h2>
              <div className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <IconComponent name="x" size="l" />
              </div>
            </header>
            <div className={styles.sectionContainer}>
              <section className={styles.section}>
                <h3 className={styles.subtitle}>장애 유형</h3>
                <div className={styles.chipsContainer}>
                  {types.map((type, index) => (
                    <div
                      key={index}
                      onClick={() => handleOptionClick(type, 'type')}
                      className={styles.chips}
                    >
                      <Chips
                        chipState={
                          selectedTypes === type ? 'checked' : 'unchecked'
                        }
                        text={type}
                        serialNumber={false}
                      />
                    </div>
                  ))}
                </div>
              </section>
              <section className={styles.section}>
                <h3 className={styles.subtitle}>편의 시설</h3>
                <div className={styles.chipsContainer}>
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      onClick={() => handleOptionClick(amenity, 'amenity')}
                      className={styles.chips}
                    >
                      <Chips
                        chipState={
                          selectedAmenities.includes(amenity)
                            ? 'checked'
                            : 'unchecked'
                        }
                        text={amenity}
                        serialNumber={false}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className={styles.btnContainer}>
              <button className={styles.resetBtn} onClick={handleReset}>
                초기화
              </button>
              <button
                className={classNames(styles.saveBtn, {
                  [styles.saveBtnActive]: count > 0,
                })}
                onClick={handleSave}
              >
                필터 저장
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
