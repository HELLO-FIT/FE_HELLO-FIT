import React, { useRef, useState } from 'react';
import styles from './SportsFilter.module.scss';
import { SportsFilterProps } from './SportsFilter.types';
import IconComponent from '@/components/Asset/Icon';
import useOutsideClick from '@/hooks/useOutsideClick';

export default function SportsFilter({
  options,
  value,
  onChange,
}: SportsFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useOutsideClick(filterRef, () => setIsOpen(false));

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.selectedValue} ${value ? styles.selectedDropdown : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || '종목 선택'}
        <IconComponent
          name={isOpen ? 'up' : 'down'}
          size="m"
          alt="dropdown arrow"
        />
      </div>
      {isOpen && (
        <div className={styles.bottomSheet} ref={filterRef}>
          <div className={styles.indicatorWrapper}>
            <IconComponent
              name="indicator"
              size="custom"
              alt="Drag Indicator"
            />
          </div>
          <h2 className={styles.title}>스포츠 종목 선택</h2>
          <div className={styles.optionList}>
            {options.map(option => (
              <div
                key={option}
                className={`${styles.option} ${
                  value === option ? styles.selected : ''
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
                {value === option && (
                  <IconComponent name="check" size="m" alt="selected check" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
