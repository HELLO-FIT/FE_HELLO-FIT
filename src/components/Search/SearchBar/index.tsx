import { useState } from 'react';
import { useRouter } from 'next/router';
import IconComponent from '../../Asset/Icon';
import styles from './SearchBar.module.scss';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <IconComponent name="search" size="m" />
      <input
        className={styles.inputContainer}
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="스포츠 강좌 검색하기"
      />
    </div>
  );
}
