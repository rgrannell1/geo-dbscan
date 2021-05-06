
import { Theory } from 'atypical'

import geoscanHypotheses from '../src/geoscan.spec.js'
import noErrorSearchHypotheses from '../src/nearby-search.spec.js'

const theory = new Theory({
  description: 'all geoscan hypotheses hold'
})

theory
  .expectAll({
    ...noErrorSearchHypotheses
  })
  .test({
    seconds: 30
  })
  .catch(err => {
    throw err
  })
