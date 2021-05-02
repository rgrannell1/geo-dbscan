
import haversine from 'haversine-distance'

interface Location {
  latitude: number, longitude: number
}

/**
 * Constructor options for Geo DBScan
 */
interface GeoDBScanOpts <T> {
  data: T[]
  getLocation: (point: T) => Location
  epsilon: number
  minPoints: number
}

interface GrowClusterOpts <T> {
  labels: number[]
  pointIndex: number
  neighbours: number[]
  clusterId: number
}

export class GeoDBScan <T> {
  data: T[]
  getLocation: (point: T) => Location
  epsilon: number
  minPoints: number

  constructor (opts: GeoDBScanOpts<T>) {
    this.data = opts.data
    this.getLocation = opts.getLocation
    this.epsilon = opts.epsilon
    this.minPoints = opts.minPoints
  }

  withinDistance (location0: Location, location1: Location) {
    return haversine(location0, location1) < (this.epsilon * 1000)
  }

  /**
   * Find all points idxs within `eps`km of a point. O(n), needs spatial indexing
   *
   * @param point
   */
  nearby (point: T) {
    const pointLocation = this.getLocation(point)

    const neighbours:number[] = []

    for (let idx = 0; idx < this.data.length; ++idx) {
      const candidate = this.data[idx]

      const candidateLocation = this.getLocation(candidate)

      if (this.withinDistance(pointLocation, candidateLocation)) {
        neighbours.push(idx)
      }
    }

    return neighbours
  }

  /**
   * Grow a new cluster from the provided seed-point.
   */
  growCluster (opts: GrowClusterOpts<T>) {
    const { labels, pointIndex, clusterId } = opts
    let { neighbours } = opts

    labels[pointIndex] = clusterId
    let idx = 0
    while (idx < neighbours.length) {
      const neighbourIdx = neighbours[idx]

      // -- if the point was labelled noise during seed-search, it's
      // -- not a branch point (not enough neighbours), so add to this cluster
      // -- as a leaf
      if (labels[neighbourIdx] === -1) {
        labels[neighbourIdx] - clusterId
      } else if (labels[neighbourIdx] === 0) {
        labels[neighbourIdx] = clusterId

        const branchNeighbours = this.nearby(this.data[neighbourIdx])

        // add all the branch neighbors to the FIFO queue
        if (branchNeighbours.length >= this.minPoints) {
          neighbours = neighbours.concat(branchNeighbours)
        }
      }

      idx++
    }
  }

  /**
   *
   * @returns object
   */
  fit () {
    let clusterId = 0
    const labels = new Array(this.data.length)

    for (let idx = 0; idx < this.data.length; ++idx) {
      // -- skip visited points
      if (labels[idx] !== 0) {
        continue
      }

      const neighbours = this.nearby(this.data[idx])
      if (neighbours.length < this.minPoints) {
        labels[idx] = -1
      } else {
        clusterId++
        this.growCluster({
          labels,
          clusterId,
          pointIndex: idx,
          neighbours
        })
      }
    }

    return labels
  }
}
