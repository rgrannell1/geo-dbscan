export interface Point {
    location: {
        longitude: number;
        latitude: number;
    };
}
export declare const randomPoint: () => Point;
export declare const radiusGenerator: {
    /**
     * https://gis.stackexchange.com/a/2964
     *
     * @param point
     * @param radius
     */
    inside(point: Point, radius: number): Point;
    outside(point: Point, radius: number): Point;
};
