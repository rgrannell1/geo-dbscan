import { GeoDBScan } from "./geoscan.js";
import { Hypothesis, Explanation } from 'atypical';
/**
 * generate a random data-point
 *
 * @param idx a metadata entry
 *
 * @returns a sample data-entry
 */
const randomPoints = (idx) => {
    return {
        location: {
            latitude: Math.random(),
            longitude: Math.random()
        },
        metadata: idx
    };
};
/**
 * Generate test-cases for geoscan
 *
 * @yields a test-data set and minimum number of points in a cluster
 */
const generateCases = function* () {
    while (true) {
        const results = [];
        const pointCount = Math.floor(Math.random() * 100);
        for (let idx = 0; idx < pointCount; ++idx) {
            results.push(randomPoints(idx));
        }
        const minPoints = Math.floor(Math.random() * 10) + 2;
        yield [results, minPoints];
    }
};
const fitHypothesis = new Hypothesis({
    description: 'fit always returns data in the expected format'
})
    .cases(generateCases)
    .always((data, minPoints) => {
    const scan = new GeoDBScan({
        getLocation(datum) {
            return datum.location;
        },
        epsilon: 10,
        minPoints
    });
    const result = scan.fit(data);
    if (!result.stats) {
        return new Explanation({
            description: 'stats object missing',
            data: { result }
        });
    }
    for (const prop of ['clusterCount', 'count', 'clusteredCount', 'noiseCount']) {
        if (!result.stats.hasOwnProperty(prop)) {
            return new Explanation({
                description: `missing property stats.${prop}`,
                data: { result }
            });
        }
    }
});
const regionQueryHypothesis = new Hypothesis({
    description: 'regionQuery returns expected neighbours'
})
    .cases(function* () {
    while (true) {
        const nearby = [];
        for (let idx = 0; idx < 10; ++idx) {
            nearby.push([
                1e-10 * Math.random(),
                1e-10 * Math.random()
            ]);
        }
        yield [nearby];
    }
})
    .always((points) => {
    const geoscan = new GeoDBScan({
        getLocation(data) {
            return {
                longitude: data[0],
                latitude: data[1]
            };
        },
        epsilon: 1,
        minPoints: 1
    });
    const geo = geoscan.asGeo(points);
    const neighbours = geoscan.regionQuery(geo, points, points[0]);
    if (points.length !== neighbours.length) {
        return new Explanation({
            description: `expected ${points.length} to equal ${neighbours.length}`,
            data: {
                neighbours,
                points
            }
        });
    }
    return points.length === neighbours.length;
});
export default {
    //fitHypothesis,
    regionQueryHypothesis
};
