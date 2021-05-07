import geohash from 'ngeohash';
import haversine from "haversine-distance";
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
export class NearbySearch {
    /**
     * Index any provided search data
     *
     * @param opts
     */
    constructor(opts) {
        const [precision, area] = this.radiusToPrecisionBounds(opts.radius);
        this.precision = precision;
        this.getLocation = opts.getLocation;
        const hashes = {};
        for (const point of opts.data) {
            const location = opts.getLocation(point);
            const hash = geohash.encode(location.latitude, location.longitude).slice(0, this.precision);
            if (!hashes[hash]) {
                hashes[hash] = {
                    location,
                    hash,
                    entries: [point]
                };
            }
            else {
                hashes[hash].entries.push(point);
            }
        }
        this.hashes = hashes;
    }
    getGeohash(point, precision) {
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
        return geohash.neighbors(hash);
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
        const geohash = this.getGeohash(point, this.precision);
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
        for (let idx = 0; idx < areas.length; idx++) {
            const tooSmall = areas[idx] < radius;
            if (tooSmall) {
                return [idx, areas[idx - 1]];
            }
        }
        return [1, areas[0]];
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
        return haversine(location, this.getLocation(point));
    }
    /**
     * Search for points within a radius r of a point
     *
     * @param point
     *
     * @returns
     */
    search(point) {
        const candidates = this.candidatePoints(point);
        const location = this.getLocation(point);
        return candidates.filter(candidate => {
            return this.distance(location, candidate) < this.radius;
        });
    }
}
NearbySearch.areas = areas;
