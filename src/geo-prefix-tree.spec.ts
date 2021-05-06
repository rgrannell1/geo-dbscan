
import geohash from 'ngeohash'

import { Explanation, Hypothesis } from 'atypical'
import { GeoPrefixTree } from './geo-prefix-tree.js'

const geoPoint = () => {
  const location = {
    longitude: (360 * Math.random()) - 180,
    latitude: (180 * Math.random()) - 90
  }

  return {
    location,
    geohash: geohash.encode(location.latitude, location.longitude),
    value: {
      text: 'weasel'
    }
  }
}

const sizeHypothesis = new Hypothesis({ description: 'tree enumeration returns expected item count' })
  .cases(function* () {
    while (true) {
      const data = []
      for (let idx = 0; idx < 100; ++idx) {
        data.push(geoPoint())
      }

      const precision = Math.floor(Math.random() * 15) + 1

      yield [data, precision]
    }
  })
  .always((data, precision) => {
    const tree = new GeoPrefixTree({
      data,
      precision
    })

    const actual = tree.size()

    if (actual !== data.length) {
      return new Explanation({
        description: 'tree nodes count did not match up with data-length',
        data: {
          precision,
          expected: data.length,
          actual
        }
      })
    }

    return tree.size() === data.length
  })

export default {
  sizeHypothesis
}
