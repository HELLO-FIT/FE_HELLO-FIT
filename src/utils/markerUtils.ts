export const createMarkerImage = (src: string): kakao.maps.MarkerImage => {
  return new kakao.maps.MarkerImage(src, new kakao.maps.Size(28, 28), {
    offset: new kakao.maps.Point(14, 14),
  });
};
