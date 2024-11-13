import React, { useRef, useState } from 'react';
import styles from './LocalFilter.module.scss';
import { LocalFilterProps } from './LocalFilter.types';
import IconComponent from '@/components/Asset/Icon';
import useOutsideClick from '@/hooks/useOutsideClick';

export default function LocalFilter({
  options,
  value,
  onChange,
  title,
  placeholder,
  onNextClick,
  onCompleteClick,
  isNextStep,
}: LocalFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useOutsideClick(filterRef, () => setIsOpen(false));

  const handleOptionClick = (key: string) => {
    onChange(key);
  };

  const handleCompleteClick = () => {
    setIsOpen(false);
    if (onCompleteClick) {
      onCompleteClick();
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.selectedValue} ${value ? styles.selectedDropdown : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {placeholder}
        <IconComponent
          name={isOpen ? 'up' : 'down'}
          size="m"
          alt="dropdown arrow"
        />
      </div>
      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          <div className={styles.bottomSheet} ref={filterRef}>
            <div className={styles.indicatorWrapper}>
              <IconComponent
                name="indicator"
                size="custom"
                alt="Drag Indicator"
              />
            </div>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.optionList}>
              {Object.entries(options).map(([key, label]) => (
                <div
                  key={key}
                  className={`${styles.option} ${
                    value === key ? styles.selected : ''
                  }`}
                  onClick={() => handleOptionClick(key)}
                >
                  {label}
                  {value === key && (
                    <IconComponent name="check" size="m" alt="selected check" />
                  )}
                </div>
              ))}
            </div>
            {!isNextStep && (
              <button
                className={`${styles.actionButton} ${
                  value ? styles.enabled : styles.disabled
                }`}
                disabled={!value}
                onClick={onNextClick}
              >
                다음
              </button>
            )}
            {isNextStep && (
              <button
                className={`${styles.actionButton} ${
                  value ? styles.enabled : styles.disabled
                }`}
                disabled={!value}
                onClick={handleCompleteClick}
              >
                완료
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
