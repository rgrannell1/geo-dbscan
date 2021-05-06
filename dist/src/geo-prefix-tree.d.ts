interface TreeData {
    geohash: string;
}
interface GeoPrefixTreeOpts {
    data: any;
    precision: number;
}
export declare class GeoPrefixTree<T extends TreeData> {
    tree: any;
    data: Record<string, {}>;
    constructor(opts: GeoPrefixTreeOpts);
}
export {};
