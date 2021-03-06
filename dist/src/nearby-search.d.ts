import { NearbySearchOpts, Location } from "./types";
/**
 * Find nearby points in a dataset, as fast as possible. Use geohashes to partition the space, and search
 * the nine eligible geohash areas that might contain a candidate point. The geohash precision is chosen to match up
 * as larger than the provided search radius, minimising the search-area.
 *
 * Perform a haversine distance search for points in this grid; return points within radius r of the provided point.
 */
export declare class NearbySearch<T> {
    static areas: number[];
    radius: number;
    precision: number;
    getLocation: (point: T) => Location;
    hashes: Record<string, {
        location: Location;
        hash: string;
        entries: T[];
    }>;
    /**
     * Index any provided search data
     *
     * @param opts
     */
    constructor(opts: NearbySearchOpts<T>);
    geohash(point: T, precision: number): any;
    /**
     *
     *
     * @param hash
     * @returns
     */
    getNeighbourGeohashes(hash: string): any[];
    /**
     * Find points within the nine geohash area, as these could potentially be within the candidate point's
     * radius.
     *
     * @param point the point that will serve as the center of a search.
     *
     * @returns any points within the 9 candidate geohash boxes
     */
    candidatePoints(point: T): T[];
    /**
     * Given a point and a radius r, find the geohash precision at which we should
     * enumerate all points and brute-force distance calculations. We want to filter down as much as possible
     * using geohashes, and run distance calculations on a handful of nearby points. If we have a 3x3 geohash grid with a
     * a point somewhere in the centre, we need the grid width / height to be at least r meters long, otherwise the grid
     * might exclude points.
     *
     * @returns number a number between 1 and ...
     */
    radiusToPrecisionBounds(radius: number): number;
    /**
     * Compute the haversine distance between two points
     *
     * @param location the location of the point to be examined
     * @param point the candidate second point
     *
     * @returns the distance between two points, in meters
     */
    distance(location: Location, point: T): any;
    /**
     * Search for points within a radius r of a point
     *
     * @param point the point to search around
     *
     * @returns an array of points with r of a search point
     */
    search(point: T): T[];
}
