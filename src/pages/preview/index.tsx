import IconComponent from '@/components/Asset/Icon';
import ToggleButton from '@/components/ToggleButton';
import Header from '@/components/Header';
import CustomButton from '@/components/Button/CustomButton';
import LikeButton from '@/components/Button/LikeButton';

export default function Preview() {
  return (
    <div>
      <h1>Icon Preview</h1>
      <div>
        <br />
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
          <br />
          <IconComponent name="blueHeartBlank" width={36} height={36} />
          <IconComponent name="kakao" alt="Kakao logo" width={48} height={48} />
        </div>
      </div>
      <hr />
      <div>
        <p>Toggle Button</p>
        <br />
        <ToggleButton />
      </div>
      <hr />
      <div>
        <br />
        <p>Header</p>
        <Header />
      </div>
      <hr />
      <div>
        <p>CustomButton</p>
        <br />
        <CustomButton label={'신청하러 가기'} />
      </div>
      <hr />
      <div>
        <p>LikeButton</p>
        <br />
        <LikeButton />
      </div>
    </div>
  );
}
