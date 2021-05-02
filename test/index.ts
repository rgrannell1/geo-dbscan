
import { Theory } from 'atypical'

import geoscanHypotheses from '../src/geoscan.test.js'

const theory = new Theory({ description: 'all geoscan hypotheses hold' })

theory
  .expectAll({
    ...geoscanHypotheses
  })
  .test({
    seconds: 30
  })
  .catch(err => {
    throw err
  })
