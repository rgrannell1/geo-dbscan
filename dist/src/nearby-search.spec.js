import plot from 'node-scatterplot';
import { Hypothesis, Explanation } from 'atypical';
import haversine from "haversine";
import { NearbySearch } from './nearby-search.js';
import { radiusGenerator, randomPoint } from './test-utils/points.js';
const drawMap = (example, seed, search) => {
    const set = [
        [
            example.location.longitude,
            example.location.latitude
        ],
        [
            seed.location.longitude,
            seed.location.latitude
        ]
    ];
    for (const { entries } of Object.values(search.hashes)) {
        for (const entry of entries) {
            set.push([entry.location.longitude, entry.location.latitude]);
        }
    }
    plot(set);
};
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
        // -- the centre point
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
    let stored = [];
    for (const entry of Object.values(search.hashes)) {
        stored = stored.concat(entry.entries);
    }
    if (stored.length !== entries.length) {
        return new Explanation({
            description: 'mismatch between points given and saved',
            data: {
                storedLength: stored.length,
                entries: entries.length
            }
        });
    }
})
    .always((seed, entries, search) => {
    const actual = search.candidatePoints(seed);
    if (actual.length !== entries.length) {
        const distances = entries
            .map((entry) => Math.floor(haversine(entry.location, seed.location, { unit: 'meter' })))
            .sort();
        return new Explanation({
            description: 'mismatch between returned candidates and provided',
            data: {
                actualLength: actual.length,
                expectedLength: entries.length,
                distances,
                radius: search.radius,
                hashes: search.hashes
            }
        });
    }
});
const distantSearchHypothesis = new Hypothesis({ description: 'correctly identifies nearby points' })
    .cases(function* () {
    while (true) {
        // -- the centre point
        const seed = randomPoint();
        const radius = Math.floor(Math.random() * 10_000) + 100;
        const entries = [];
        for (let idx = 0; idx < Math.floor(Math.random() * 100); ++idx) {
            const neighbour = radiusGenerator.outside(seed, radius);
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
    if (actual.length !== 0) {
        const distances = entries
            .map((entry) => Math.floor(haversine(entry.location, seed.location, { unit: 'meter' })))
            .sort();
        return new Explanation({
            description: 'matches were present where there should be none',
            data: {
                actualLength: actual.length,
                expectedLength: entries.length,
                distances,
                radius: search.radius,
                hashes: search.hashes
            }
        });
    }
});
export default {
    noErrorSearchHypothesis,
    nearbySearchHypothesis,
    distantSearchHypothesis
};
//# sourceMappingURL=nearby-search.spec.js.map