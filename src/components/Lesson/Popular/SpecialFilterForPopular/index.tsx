import React, { useEffect, useRef, useState } from 'react';
import styles from './SpecialFilterForPopular.module.scss';
import { SpecialFilterForPopularProps } from './SpecialFilterForPopular.types';
import IconComponent from '@/components/Asset/Icon';
import classNames from 'classnames';
import useOutsideClick from '@/hooks/useOutsideClick';

// 인기 페이지용 특수 필터
export default function SpecialFilterForPopular({
  options,
  value,
  onChange,
}: SpecialFilterForPopularProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const startY = useRef(0);
  const currentY = useRef(0);
  useOutsideClick(filterRef, () => setIsOpen(false));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOptionClick = (option: string) => {
    if (value === option) {
      onChange('');
    } else {
      onChange(option);
    }
    setIsOpen(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;

    if (distance > 0 && filterRef.current) {
      filterRef.current.style.transform = `translateY(${distance}px)`;
    }
  };

  const handleTouchEnd = () => {
    const distance = currentY.current - startY.current;

    if (distance > 100) {
      setIsOpen(false);
    }

    if (filterRef.current) {
      filterRef.current.style.transform = '';
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.selectedValueSP, {
          [styles.selectedDropdownSP]: value,
        })}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || '특수 필터'}
        <IconComponent
          name={isOpen ? 'up' : 'down'}
          size="m"
          alt="dropdown arrow"
        />
      </div>
      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          <div
            className={styles.bottomSheet}
            ref={filterRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={styles.indicatorWrapper}>
              <IconComponent
                name="indicator"
                width={58}
                height={4}
                alt="Drag Indicator"
              />
            </div>
            <h2 className={styles.title}>장애 유형 선택</h2>
            <div className={styles.optionListSP}>
              {options.map(option => (
                <div
                  key={option}
                  className={classNames(styles.option, {
                    [styles.selected]: value === option,
                  })}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                  {value === option && (
                    <IconComponent
                      name="checkSP"
                      size="m"
                      alt="selected check"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
