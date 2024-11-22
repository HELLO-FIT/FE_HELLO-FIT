declare namespace kakao.maps {
  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    getCenter(): LatLng;
    setLevel(level: number): void;
    getLevel(): number;
  }

  class LatLng {
    constructor(latitude: number, longitude: number);
    getLat(): number;
    getLng(): number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    setImage(image: MarkerImage): void;
  }

  class MarkerImage {
    constructor(
      src: string,
      size: Size,
      options?: { offset?: Point }
    );
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  namespace services {
    class Geocoder {
      coord2RegionCode(
        longitude: number,
        latitude: number,
        callback: (result: any[], status: string) => void
      ): void;

      addressSearch(
        address: string,
        callback: (result: any[], status: string) => void
      ): void;
    }

    namespace Status {
      const OK: string;
    }
  }

  namespace event {
    function addListener(
      target: Map | Marker | any,
      type: string,
      handler: (event: any) => void
    ): void;

    function removeListener(
      target: Map | Marker | any,
      type: string,
      handler: (event: any) => void
    ): void;

    function trigger(target: Map | Marker | any, type: string): void;
  }

  function load(callback: () => void): void;
}
