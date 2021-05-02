
import { GeoDBScan } from "./geoscan"
import { Hypothesis, Explanation } from 'atypical'

const fitHypothesis = new Hypothesis({
  description: 'fit always returns data in the expected format'
})
.cases(function * () {
  while (true) {
    yield [[
      {
        location: {
          latitude: 0,
          longitude: 0,
        },
        metadata: 'some-other-fields'
      },
      {
        location: {
          latitude: 0,
          longitude: 1,
        },
        metadata: 'some-other-fields'
      },
    ]]
  }
})
.always((data) => {
  const scan = new GeoDBScan({
    data,
    getLocation(datum:any) {
      return datum.location
    },
    epsilon: 10,
    minPoints: 3
  })

  const result = scan.fit()
  console.log(result)

  return true
})

export default {
  fitHypothesis
}
