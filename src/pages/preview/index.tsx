import IconComponent from '@/components/Asset/Icon';
import ToggleButton from '@/components/ToggleButton';
import Header from '@/components/Layout/Header';

export default function Preview() {
  return (
    <div>
      <h2>Icon Preview</h2>

      <div>
        <p>Sizes: Small, Medium, Large</p>
        <div>
          <IconComponent name="search" size="s" />
          <IconComponent name="search" size="m" />
          <IconComponent name="search" size="l" />
        </div>
      </div>

      <hr />

      <div>
        <p>Custom Sizes:</p>
        <div>
          <IconComponent name="blueHeartBlank" width={36} height={36} />
          <IconComponent name="kakao" alt="Kakao logo" width={48} height={48} />
        </div>
      </div>

      <div>
        <p>Toggle Button</p>
        <ToggleButton />
      </div>

      <div>
        <p>Header</p>
        <Header />
      </div>
    </div>
  );
}
