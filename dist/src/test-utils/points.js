import haversine from "haversine-distance";
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
        while (true) {
            const currentDistance = haversine(candidate.location, point.location);
            const offsetLngDegree = Math.floor(Math.random() * 10);
            const offsetLatDegree = Math.floor(Math.random() * 10);
            const offsetLngCoeff = Math.random() * 10;
            const offsetLatCoeff = Math.random() * 10;
            const offsetLng = offsetLngCoeff * Math.pow(10, -offsetLngDegree);
            const offsetLat = offsetLatCoeff * Math.pow(10, -offsetLatDegree);
            const opLng = Math.random() > 0.5 ? -1 : +1;
            const opLat = Math.random() > 0.5 ? -1 : +1;
            const newCandidate = {
                location: {
                    longitude: candidate.location.longitude + (opLng * offsetLng),
                    latitude: candidate.location.latitude + (opLat * offsetLat)
                }
            };
            const newDistance = haversine(newCandidate.location, point.location);
            if (currentDistance > newDistance) {
                candidate = newCandidate;
            }
            if (newDistance < radius) {
                return candidate;
            }
        }
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