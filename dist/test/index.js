import { Theory } from 'atypical';
import noErrorSearchHypotheses from '../src/nearby-search.spec.js';
import geoPrefixTreeHypotheses from '../src/geo-prefix-tree.spec.js';
const theory = new Theory({
    description: 'all geoscan hypotheses hold'
});
theory
    .expectAll({
    ...noErrorSearchHypotheses,
    ...geoPrefixTreeHypotheses
})
    .test({
    seconds: 30
})
    .catch(err => {
    throw err;
});
