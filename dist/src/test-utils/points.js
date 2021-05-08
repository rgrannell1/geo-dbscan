import haversine from "haversine";
export const randomPoint = () => {
    return {
        location: {
            longitude: (360 * Math.random()) - 180,
            latitude: (180 * Math.random()) - 90
        }
    };
};
export const radiusGenerator = {
    /**
     * https://gis.stackexchange.com/a/2964
     *
     * @param point
     * @param radius
     */
    inside(point, radius) {
        let candidate = randomPoint();
        return candidate;
    },
    outside(point, radius) {
        while (true) {
            const candidate = randomPoint();
            const distance = haversine(candidate.location, point.location);
            if (distance > radius) {
                return candidate;
            }
        }
    }
};
