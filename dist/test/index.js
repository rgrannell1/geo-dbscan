import { Theory } from 'atypical';
import noErrorSearchHypotheses from '../src/nearby-search.spec.js';
import salesHypothesis from './sales.js';
const theory = new Theory({
    description: 'all geoscan hypotheses hold'
});
theory
    .expectAll({
    ...salesHypothesis,
    ...noErrorSearchHypotheses
})
    .test({
    seconds: 30
})
    .catch(err => {
    throw err;
});
//# sourceMappingURL=index.js.map