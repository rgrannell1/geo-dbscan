
import * as fs from 'fs'
import { GeoDBScan } from "../src/geoscan.js"

/**
 * Benchmark geoscan for real-world data.
 */
const benchmarkGeoScan = async () => {
  const content = await fs.promises.readFile('./data/locations.json')
  const locations = JSON.parse(content.toString())

  const scan = new GeoDBScan({
    getLocation(datum: any) {
      return { latitude: datum.y, longitude: datum.x }
    },
    epsilon: 1000,
    minPoints: 3
  })

  for (let size = 1; size < locations.length; size += 1000) {
    size = Math.min(locations.length - 1, size)
    const dataset = []

    for (let idx = 0; idx < size; ++idx) {
      dataset.push(locations[idx])
    }

    const start = process.hrtime.bigint()
    scan.fit(dataset)
    const end = process.hrtime.bigint()

    console.log(`${size}: took ${(end - start) / 1_000_000n} milliseconds`)
  }
}

benchmarkGeoScan().catch(err => {
  throw err
})
