import { NearbySearch } from './nearby-search.js';
import { Location, GeoDBScanOpts, GrowClusterOpts, ClusterData } from './types';
/**
 *
 */
export declare class GeoDBScan<T> {
    getLocation: (point: T) => Location;
    epsilon: number;
    minPoints: number;
    geo: any;
    constructor(opts: GeoDBScanOpts<T>);
    /**
     * Find points within a radius of another point
     *
     * @param location0 a longitude-latitude-object
     * @param location1 a longitude-latitude-object
     *
     * @returns a boolean indicative whether a point is within
     *   `epsilon` meters of another point
     */
    withinDistance(location0: Location, location1: Location): boolean;
    /**
     * Find all points idxs within `eps`km of a point. O(n), needs spatial indexing
     *
     * @param point
     */
    regionQuery(geo: any, data: T[], point: T): any;
    /**
     * Index geolocation data
     *
     * @param data an array of geospatial data
     *
     * @returns a Geo object
     */
    asGeo(data: T[]): NearbySearch<T>;
    /**
     * Grow a new cluster from the provided seed-point.
     */
    growCluster(opts: GrowClusterOpts<T>): void;
    /**
     * Cluster a dataset containing longitude-latitude data by location.
     *
     * @param {T[]} data-points to cluster
     *
     * @returns object
     */
    fit(data: T[]): ClusterData<T>;
}
