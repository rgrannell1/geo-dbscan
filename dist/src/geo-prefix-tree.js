export class GeoPrefixTree {
    /**
     * Construct a geohash prefix tree containing all the provided values
     *
     * @param opts
     * @param opts.data
     * @param opts.precision the geohash length; longer is more precise
     */
    constructor(opts) {
        const ref = {};
        const queue = [];
        for (const datum of opts.data) {
            queue.push({
                ref,
                path: '',
                location: datum.location,
                geohash: datum.geohash.slice(0, opts.precision),
                value: datum.value
            });
        }
        while (queue.length > 0) {
            let { ref, path, location, geohash, value } = queue.pop();
            /**
             * When the geohash path has been fully traversed,
             * `ref` will hold the tree-path location. Set ref.entries and push any values
             * with a matching geohash
             *
             */
            if (!geohash) {
                if (!ref.entries) {
                    ref.entries = [];
                }
                // -- store value information as provided
                ref.entries.push({
                    location: location,
                    geohash: path,
                    value: value
                });
                continue;
            }
            const head = geohash[0];
            const tail = geohash.slice(1);
            if (!(head in ref)) {
                ref[head] = {};
            }
            /**
             * Traverse one character deeper into the geohash,
             * and add it to the path. Use ref[head] as the new reference (one level deeper
             * into the tree) and otherwise preserve value information for the moment in the
             * task queue.
             */
            queue.push({
                ref: ref[head],
                path: `${path}${head}`,
                location: location,
                geohash: tail,
                value: value
            });
        }
        this.tree = ref;
    }
    /**
     * Get
     *
     * @param hash
     * @returns
     */
    getGeohash(hash) {
        let ref = this.tree;
        for (const char of hash) {
            ref = ref[char];
        }
        return ref;
    }
}
