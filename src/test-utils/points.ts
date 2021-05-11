
import haversine from "haversine"

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
    let distance = Infinity

    while (true) {
      const offsetLngDegree = Math.floor(Math.random() * 10)
      const offsetLatDegree = Math.floor(Math.random() * 10)
      const offsetLngCoeff = Math.random() * 10
      const offsetLatCoeff = Math.random() * 10

      const offsetLng = offsetLngCoeff * Math.pow(10, -offsetLngDegree)
      const offsetLat = offsetLatCoeff * Math.pow(10, -offsetLatDegree)

      const opLng = Math.random() > 0.5 ? -1 : +1
      const opLat = Math.random() > 0.5 ? -1 : +1

      const newCandidate = {
        location: {
          longitude: candidate.location.longitude + (opLng * offsetLng),
          latitude: candidate.location.latitude + (opLat * offsetLat)
        }
      }

      const newDistance = haversine(newCandidate.location, point.location, { unit: 'meter' })

      if (distance > newDistance) {
        candidate = newCandidate
        distance = newDistance
      }

      if (newDistance < radius) {
        // -- for some reason, this glitches sometimes.
        let closeLat = Math.round(point.location.latitude) === Math.round(candidate.location.latitude)
        let closeLng = Math.round(point.location.longitude) === Math.round(candidate.location.longitude)

        if (closeLat && closeLng) {
          return candidate
        } else {
          return point
        }
      }
    }
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
