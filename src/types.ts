
export interface Location {
  latitude: number
  longitude: number
}

/**
 * Constructor options for GeoDBScan
 *
 *
 */
export interface GeoDBScanOpts<T> {
  getLocation: (point: T) => Location
  epsilon: number
  minPoints: number
}

export interface GrowClusterOpts<T> {
  data: T[]
  labels: number[]
  pointIndex: number
  neighbours: number[]
  clusterId: number
}

export interface Cluster {
  stats: {
    count: number
  }
}

export interface ClusterData {
  stats: {
    count: number,
    clusteredCount: number,
    noiseCount: number
  },
  clusters: Cluster[]
}
