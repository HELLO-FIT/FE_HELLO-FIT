import IconComponent from '@/components/Asset/Icon';

export default function Preview() {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Icon Preview</h2>
      
      <div>
        <p>Sizes: Small, Medium, Large</p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <IconComponent name="search" size="s" />
          <IconComponent name="search" size="m" />
          <IconComponent name="search" size="l" />
        </div>
      </div>
      
      <hr style={{ margin: '20px 0' }} />
      
      <div>
        <p>Fixed Sizes:</p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <IconComponent name="blueHeartBlank" width={36} height={36} />
          <IconComponent name="kakao" alt="Kakao logo" width={48} height={48} />
        </div>
      </div>
    </div>
  );
}
