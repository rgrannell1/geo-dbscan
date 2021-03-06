import geohash from 'ngeohash';
import haversine from "haversine";
/**
 * the max area bound, by size. Index n corresponds to geohash length n + 1. The value
 *  corresponds to the max of width x height of the area of land bounded by geohash of length n, in meters.
 *
 */
const areas = [
    5009400,
    1252300,
    156500,
    39100,
    4900,
    1200,
    1529,
    382,
    48,
    12,
    0.1149
];
/**
 * Find nearby points in a dataset, as fast as possible. Use geohashes to partition the space, and search
 * the nine eligible geohash areas that might contain a candidate point. The geohash precision is chosen to match up
 * as larger than the provided search radius, minimising the search-area.
 *
 * Perform a haversine distance search for points in this grid; return points within radius r of the provided point.
 */
export class NearbySearch {
    /**
     * Index any provided search data
     *
     * @param opts
     */
    constructor(opts) {
        const precision = this.radiusToPrecisionBounds(opts.radius);
        this.radius = opts.radius;
        this.precision = precision;
        this.getLocation = opts.getLocation;
        const hashes = {};
        for (const point of opts.data) {
            const location = opts.getLocation(point);
            const hash = geohash.encode(location.latitude, location.longitude).slice(0, this.precision);
            if (hashes[hash]) {
                hashes[hash].entries.push(point);
            }
            else {
                hashes[hash] = {
                    location,
                    hash,
                    entries: [point]
                };
            }
        }
        this.hashes = hashes;
    }
    geohash(point, precision) {
        const location = this.getLocation(point);
        return geohash.encode(location.latitude, location.longitude).slice(0, precision);
    }
    /**
     *
     *
     * @param hash
     * @returns
     */
    getNeighbourGeohashes(hash) {
        return [hash, ...geohash.neighbors(hash)];
    }
    /**
     * Find points within the nine geohash area, as these could potentially be within the candidate point's
     * radius.
     *
     * @param point the point that will serve as the center of a search.
     *
     * @returns any points within the 9 candidate geohash boxes
     */
    candidatePoints(point) {
        let entries = [];
        const geohash = this.geohash(point, this.precision);
        const candidateHashes = new Set([geohash, ...this.getNeighbourGeohashes(geohash)]);
        for (const hash of candidateHashes) {
            if (hash in this.hashes) {
                for (const entry of this.hashes[hash].entries) {
                    entries.push(entry);
                }
            }
        }
        return entries;
    }
    /**
     * Given a point and a radius r, find the geohash precision at which we should
     * enumerate all points and brute-force distance calculations. We want to filter down as much as possible
     * using geohashes, and run distance calculations on a handful of nearby points. If we have a 3x3 geohash grid with a
     * a point somewhere in the centre, we need the grid width / height to be at least r meters long, otherwise the grid
     * might exclude points.
     *
     * @returns number a number between 1 and ...
     */
    radiusToPrecisionBounds(radius) {
        const target = geohash.encode(37.8324, 112.5584);
        for (let idx = target.length - 1; idx > 0; --idx) {
            const prefix = target.slice(0, idx);
            const [minLat, minLon, maxLat, maxLon] = geohash.decode_bbox(prefix);
            const lonDiff = haversine({
                longitude: minLon,
                latitude: 0
            }, {
                longitude: maxLon,
                latitude: 0
            }, { unit: 'meter' });
            const latDiff = haversine({
                longitude: 0,
                latitude: minLat
            }, {
                longitude: 0,
                latitude: maxLat
            }, { unit: 'meter' });
            if (radius < lonDiff && radius < latDiff) {
                console.log({
                    prefix,
                    diffs: [lonDiff, latDiff],
                    radius,
                    idx
                });
                return idx;
            }
        }
        throw new Error('never reached.');
    }
    /**
     * Compute the haversine distance between two points
     *
     * @param location the location of the point to be examined
     * @param point the candidate second point
     *
     * @returns the distance between two points, in meters
     */
    distance(location, point) {
        return haversine(location, this.getLocation(point), { unit: 'meter' });
    }
    /**
     * Search for points within a radius r of a point
     *
     * @param point the point to search around
     *
     * @returns an array of points with r of a search point
     */
    search(point) {
        const candidates = this.candidatePoints(point);
        const location = this.getLocation(point);
        return candidates.filter(candidate => {
            return this.distance(location, candidate) <= this.radius;
        });
    }
}
NearbySearch.areas = areas;
//# sourceMappingURL=nearby-search.js.map