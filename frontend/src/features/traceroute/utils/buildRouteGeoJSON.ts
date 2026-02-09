import type { Hop } from "../types/traceroute";

export function buildRouteGeoJSON(hops: Hop[]) {
  const coordinates = hops
    .filter((hop) => hop.latitude && hop.longitude)
    .map((hop) => [hop.longitude as number, hop.latitude as number]);

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates
        },
        properties: {}
      }
    ]
  } as const;
}
