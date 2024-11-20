import React, { useRef, useState } from 'react';
import styles from './SportsFilter.module.scss';
import { SportsFilterProps } from './SportsFilter.types';
import IconComponent from '@/components/Asset/Icon';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import classNames from 'classnames';

export default function SportsFilter({
  options,
  value,
  onChange,
}: SportsFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const toggle = useRecoilValue(toggleState);

  useOutsideClick(filterRef, () => setIsOpen(false));

  const handleOptionClick = (option: string) => {
    if (value === option) {
      onChange('');
    } else {
      onChange(option);
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <div
        className={classNames({
          [styles.selectedValue]: toggle === 'general',
          [styles.selectedValueSP]: toggle !== 'general',
          [styles.selectedDropdown]: value && toggle === 'general',
          [styles.selectedDropdownSP]: value && toggle !== 'general',
        })}
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
            <h2 className={styles.title}>스포츠 종목 선택</h2>
            <div
              className={
                toggle === 'general' ? styles.optionList : styles.optionListSP
              }
            >
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
                      name={toggle === 'general' ? 'check' : 'checkSP'}
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
