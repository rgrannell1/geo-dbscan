
import haversine from 'haversine'
import { NearbySearch } from './nearby-search.js'

import {
  Location,
  GeoDBScanOpts,
  GrowClusterOpts,
  ClusterData
} from './types'

/**
 *
 */
export class GeoDBScan <T> {
  data: T[]
  getLocation: (point: T) => Location
  epsilon: number
  minPoints: number
  geo: any

  constructor (opts: GeoDBScanOpts<T>) {
    this.getLocation = opts.getLocation
    this.epsilon = opts.epsilon
    this.minPoints = opts.minPoints
  }

  /**
   * Find points within a radius of another point
   *
   * @param location0 a longitude-latitude-object
   * @param location1 a longitude-latitude-object
   *
   * @returns a boolean indicative whether a point is within
   *   `epsilon` meters of another point
   */
  withinDistance (location0: Location, location1: Location) {
    return haversine(location0, location1, { unit: 'meter' }) < this.epsilon
  }

  /**
   * Find all points idxs within `eps`km of a point. O(n), needs spatial indexing
   *
   * @param point
   */
  regionQuery (geo: any, data: T[], point: T) {
    return geo.search(point)
  }

  /**
   * Index geolocation data
   *
   * @param data an array of geospatial data
   *
   * @returns a Geo object
   */
  asGeo (data: T[]) {
   return new NearbySearch({
     data, getLocation: this.getLocation, radius: this.epsilon
    })
  }

  /**
   * Grow a new cluster from the provided seed-point.
   */
  growCluster (opts: GrowClusterOpts<T>) {
    const { labels, pointIndex, clusterId, data } = opts
    let { neighbours } = opts

    labels[pointIndex] = clusterId
    let idx = 0

    while (idx < neighbours.length) {
      const neighbourIdx = neighbours[idx]

      // -- if the point was labelled noise during seed-search, it's
      // -- not a branch point (not enough neighbours), so add to this cluster
      // -- as a leaf
      if (labels[neighbourIdx] === -1) {
        labels[neighbourIdx] = clusterId
      } else if (labels[neighbourIdx] === 0) {
        labels[neighbourIdx] = clusterId

        const branchNeighbours = this.regionQuery(this.geo, data, data[neighbourIdx])

        // add all the branch neighbors to the FIFO queue
        if (branchNeighbours.length >= this.minPoints) {
          neighbours = neighbours.concat(branchNeighbours)
        }
      }

      idx++
    }
  }

  /**
   * Cluster a dataset containing longitude-latitude data by location.
   *
   * @param {T[]} data-points to cluster
   *
   * @returns object
   */
  fit (data: T[]): ClusterData <T> {
    if (data.length === 0) {
      return {
        stats: {
          clusterCount: 0,
          count: 0,
          clusteredCount: 0,
          noiseCount: 0
        },
        clusters: { }
      }
    }

    this.geo = this.asGeo(data)

    let clusterId = 0
    const labels = []
    for (let idx = 0; idx < data.length; ++idx) {
      labels.push(0)
    }

    for (let idx = 0; idx < data.length; ++idx) {
      // -- skip visited points
      if (labels[idx] !== 0) {
        continue
      }

      const neighbours = this.regionQuery(this.geo, data, data[idx])
      if (neighbours.length < this.minPoints) {
        labels[idx] = -1
      } else {
        clusterId++
        this.growCluster({
          data,
          labels,
          clusterId,
          pointIndex: idx,
          neighbours
        })
      }
    }

    const noiseCount = labels.filter(data => data === -1).length
    const clusteredCount = labels.filter(data => data !== -1).length

    const clusters: Record<number, T[]> = {  }

    for (let idx = 0; idx < data.length; ++idx) {
      const clusterId = labels[idx]
      const datum = data[idx]

      if (!clusters[clusterId]) {
        clusters[clusterId] = [datum]
      } else {
        clusters[clusterId].push(datum)
      }
    }

    return {
      stats: {
        clusterCount: clusterId,
        count: data.length,
        clusteredCount,
        noiseCount
      },
      clusters
    }
  }
}
