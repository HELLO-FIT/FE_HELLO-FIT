import React, { useEffect, useRef, useState } from 'react';
import styles from './LocalFilter.module.scss';
import { LocalFilterProps } from './LocalFilter.types';
import IconComponent from '@/components/Asset/Icon';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import classNames from 'classnames';

export default function LocalFilter({
  options,
  value,
  onChange,
  title,
  placeholder,
  onNextClick,
  onCompleteClick,
  isNextStep,
  placeholderType,
  additionalBottomSheetClass,
  isSpecialMode,
  onToggleOpen,
}: LocalFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const toggle = useRecoilValue(toggleState);

  const startY = useRef(0);
  const currentY = useRef(0);
  useOutsideClick(filterRef, () => setIsOpen(false));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    if (onToggleOpen) {
      onToggleOpen(isOpen);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, onToggleOpen]);

  const handleOptionClick = (key: string) => {
    onChange(key);
  };

  const handleCompleteClick = () => {
    setIsOpen(false);
    if (onCompleteClick) {
      onCompleteClick();
    }
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
        className={classNames(
          placeholderType !== 'lesson' && value ? styles.selectedDropdown : '',
          placeholderType === 'lesson' ? styles.lesson : styles.selectedValue,
          {
            [styles.specialDropdown]: isSpecialMode,
          }
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {placeholder}
        {placeholderType === 'lesson' ? (
          <IconComponent
            name={isOpen ? 'upBlack' : 'downBlack'}
            size="m"
            alt="dropdown arrow"
          />
        ) : (
          <IconComponent
            name={isOpen ? 'up' : 'down'}
            size="m"
            alt="dropdown arrow"
          />
        )}
      </div>
      {isOpen && (
        <>
          <div
            className={`${placeholderType === 'lesson' && styles.overlay}`}
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`${styles.bottomSheet} ${additionalBottomSheetClass ?? ''}`}
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
            <h2 className={styles.title}>{title}</h2>
            <div
              className={
                toggle === 'general' ? styles.optionList : styles.optionListSP
              }
            >
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
                    <IconComponent
                      name={toggle === 'general' ? 'check' : 'checkSP'}
                      size="m"
                      alt="selected check"
                    />
                  )}
                </div>
              ))}
            </div>
            {!isNextStep && (
              <button
                className={classNames(styles.actionButton, {
                  [styles.enabled]: toggle === 'general' && value,
                  [styles.enabledSP]: toggle !== 'general' && value,
                  [styles.disabled]: !value,
                })}
                disabled={!value}
                onClick={onNextClick}
              >
                다음
              </button>
            )}
            {isNextStep && (
              <button
                className={classNames(styles.actionButton, {
                  [styles.enabled]: toggle === 'general' && value,
                  [styles.enabledSP]: toggle !== 'general' && value,
                  [styles.disabled]: !value,
                })}
                disabled={!value}
                onClick={handleCompleteClick}
              >
                선택 완료
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
