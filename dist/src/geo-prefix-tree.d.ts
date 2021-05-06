import { Location } from './types';
interface TreeData {
    geohash: string;
}
interface GeoPrefixTreeOpts<T> {
    data: Array<{
        location: Location;
        geohash: string;
        value: any;
    }>;
    precision: number;
}
export declare class GeoPrefixTree<T extends TreeData> {
    tree: Record<string, {}>;
    /**
     * Construct a geohash prefix tree containing all the provided values
     *
     * @param opts
     * @param opts.data
     * @param opts.precision the geohash length; longer is more precise
     */
    constructor(opts: GeoPrefixTreeOpts<T>);
    /**
     * Get
     *
     * @param hash
     * @returns
     */
    getGeohash(hash: string): Record<string, {}>;
}
export {};
