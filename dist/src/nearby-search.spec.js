import { Hypothesis, Explanation } from 'atypical';
import haversine from "haversine-distance";
import { NearbySearch } from './nearby-search.js';
import { radiusGenerator, randomPoint } from './test-utils/points.js';
const randomCasesAndMetrics = function* () {
    while (true) {
        const data = [];
        for (let idx = 0; idx < 100; ++idx) {
            data.push(randomPoint());
        }
        const meters = Math.floor(Math.random() * 10_000);
        const search = new NearbySearch({
            data,
            radius: 1_000,
            getLocation(point) {
                return point.location;
            }
        });
        yield [meters, search];
    }
};
const noErrorSearchHypothesis = new Hypothesis({ description: 'finds minimum geohash radius' })
    .cases(randomCasesAndMetrics)
    .always((radius, search) => {
    const precision = search.radiusToPrecisionBounds(radius);
    const minDimension = NearbySearch.areas[precision - 1];
    if (minDimension < radius) {
        return new Explanation({
            description: 'min dimension of geohash bounding box was not gte radius',
            data: {
                minDimension,
                radius
            }
        });
    }
});
const nearbySearchHypothesis = new Hypothesis({ description: 'correctly identifies nearby points and excludes distance ones' })
    .cases(function* () {
    while (true) {
        const seed = randomPoint();
        const radius = Math.floor(Math.random() * 10_000);
        const entries = [];
        for (let idx = 0; idx < Math.floor(Math.random() * 100); ++idx) {
            const neighbour = radiusGenerator.inside(seed, radius);
            entries.push(neighbour);
        }
        const search = new NearbySearch({
            data: entries,
            radius: radius,
            getLocation(point) {
                return point.location;
            }
        });
        yield [seed, entries, search];
    }
})
    .always((seed, entries, search) => {
    const actual = search.candidatePoints(seed);
    if (actual.length !== entries.length) {
        const distances = entries
            .map((entry) => haversine(entry.location, seed.location))
            .sort();
        return new Explanation({
            description: 'mismatch in candidate length from input length',
            data: {
                actualLength: actual.length,
                expectedLength: entries.length,
                distances,
                radius: search.radius
            }
        });
    }
});
export default {
    noErrorSearchHypothesis,
    nearbySearchHypothesis
};
