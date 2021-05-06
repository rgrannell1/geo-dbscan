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
     * Get data stored in the tree at a particular geohash value.
     *
     * @param hash a geohash string
     *
     * @returns a tree component, or undefined
     */
    getGeohash(hash: string): Record<string, {}> | undefined;
    /**
     * Enumerate all values stored with the prefix-tree
     *
     * @returns an array of values
     */
    values(): any;
    /**
     * Count the number of items stored in the prefix-tree
     *
     * @returns a nonnegative integer
     */
    size(): number;
}
export {};
