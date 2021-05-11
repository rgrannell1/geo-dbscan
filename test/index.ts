
import * as fs from 'fs'

import { Theory } from 'atypical'

import geoscanHypotheses from '../src/geoscan.spec.js'
import noErrorSearchHypotheses from '../src/nearby-search.spec.js'
import salesHypothesis from './sales.js'

const theory = new Theory({
  description: 'all geoscan hypotheses hold'
})

theory
  .expectAll({
    ...salesHypothesis,
    ...noErrorSearchHypotheses,
    ...geoscanHypotheses
  })
  .test({
    seconds: 30
  })
  .catch(err => {
    throw err
  })
