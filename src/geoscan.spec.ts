
import { GeoDBScan } from "./geoscan.js"
import { Hypothesis, Explanation } from 'atypical'

const randomPoints = (idx: number) => {
  return {
    location: {
      latitude: Math.random(),
      longitude: Math.random()
    },
    metadata: idx
  }
}

const generateCases = function * () {
  while (true) {
    const results = []
    const pointCount = Math.floor(Math.random() * 100)

    for (let idx = 0; idx < pointCount; ++idx) {
      results.push(randomPoints(idx))
    }

    const minPoints = Math.floor(Math.random() * 10) + 2
    yield [results, minPoints]
  }
}

const fitHypothesis = new Hypothesis({
  description: 'fit always returns data in the expected format'
})
.cases(generateCases)
.always((data, minPoints) => {
  const scan = new GeoDBScan({
    getLocation(datum:any) {
      return datum.location
    },
    epsilon: 10,
    minPoints
  })

  const result = scan.fit(data)

  if (!result.stats) {
    return new Explanation({
      description: 'stats object missing',
      data: { result }
    })
  }

  for (const prop of ['clusterCount', 'count', 'clusteredCount', 'noiseCount']) {
    if (!(result.stats as any).hasOwnProperty(prop)) {
      return new Explanation({
        description: `missing property stats.${prop}`,
        data: { result }
      })
    }
  }
})

export default {
  fitHypothesis
}
