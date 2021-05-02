
import { GeoDBScan } from "./geoscan.js"
import { Hypothesis, Explanation } from 'atypical'

const fitHypothesis = new Hypothesis({
  description: 'fit always returns data in the expected format'
})
.cases(function * () {
  while (true) {
    const results = []

    for (let idx = 0; idx < 10; ++idx) {
      results.push({
        location: {
          latitude: (Math.random() * 180) - 90,
          longitude: (Math.random() * 360) - 180
        },
        metadata: idx
      })
    }

    yield [results]
  }
})
.always((data) => {
  const scan = new GeoDBScan({
    getLocation(datum:any) {
      return datum.location
    },
    epsilon: 10,
    minPoints: 3
  })

  const result = scan.fit(data)

  if (!result.stats) {
    return new Explanation({
      description: 'stats object missing',
      data: { result }
    })
  }

  if (result.stats.count !== data.length) {
    return new Explanation({
      description: 'invalid stats count',
      data: { result }
    })
  }


})

export default {
  fitHypothesis
}
