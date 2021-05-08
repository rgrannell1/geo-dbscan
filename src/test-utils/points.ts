
import haversine from "haversine"
import CheapRuler from 'cheap-ruler'

export interface Point {
  location: {
    longitude: number
    latitude: number
  }
}

export const randomPoint = (): Point => {
  return {
    location: {
      longitude: (360 * Math.random()) - 180,
      latitude: (180 * Math.random()) - 90
    }
  }
}

export const radiusGenerator = {
  /**
   * https://gis.stackexchange.com/a/2964
   *
   * @param point
   * @param radius
   */
  inside (point: Point, radius: number) {
    let candidate = randomPoint()

    return candidate
  },
  outside (point: Point, radius: number) {
    while (true) {
      const candidate = randomPoint()

      const distance = haversine (candidate.location, point.location)

      if (distance > radius) {
        return candidate
      }
    }
  }
}
