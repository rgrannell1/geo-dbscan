
import { GeoDBScan } from "./geoscan"

const data0 = [
  {
    location: {
      latitude: 0,
      longitude: 0,
    },
    metadata: 'some-other-fields'
  },
]

const scan = new GeoDBScan({
  data: data0,
  getLocation (datum) {
    return datum.location
  },
  epsilon: 10,
  minPoints: 3
})

scan.fit()
