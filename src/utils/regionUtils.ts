export const simplifyRegionName = (fullRegionName: string): string => {
  return (
    fullRegionName
      .replace(/(특별시|광역시|특별자치도|특별자치시)/g, '')
      .replace(/청$/, '')
      .match(/.+?(시|군|구)/)?.[0] || fullRegionName
  );
};
