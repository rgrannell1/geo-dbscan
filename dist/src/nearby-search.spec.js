import { Hypothesis, Explanation } from 'atypical';
import { NearbySearch } from './nearby-search.js';
const geoPoint = () => {
    return {
        location: {
            longitude: (360 * Math.random()) - 180,
            latitude: (180 * Math.random()) - 90
        }
    };
};
const noErrorSearchHypothesis = new Hypothesis({ description: 'finds minimum geohash radius' })
    .cases(function* () {
    while (true) {
        const data = [];
        for (let idx = 0; idx < 100; ++idx) {
            data.push(geoPoint());
        }
        const meters = Math.floor(Math.random() * 10_000);
        yield [data, meters];
    }
})
    .always((data, radius) => {
    const search = new NearbySearch({
        data,
        radius: 1000,
        getLocation(point) {
            return point.location;
        }
    });
    const precision = search.radiusToPrecisionBounds(radius);
    const minDimension = NearbySearch.areas[2];
    //    const minDimension = NearbySearch.areas[precision - 1]
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
export default {
    noErrorSearchHypothesis
};
