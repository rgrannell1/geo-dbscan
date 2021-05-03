import { GeoDBScan } from "./geoscan.js";
import { Hypothesis } from 'atypical';
const fitHypothesis = new Hypothesis({
    description: 'fit always returns data in the expected format'
})
    .cases(function* () {
    while (true) {
        const results = [];
        for (let idx = 0; idx < 10; ++idx) {
            results.push({
                location: {
                    latitude: (Math.random() * 190) - 180,
                    longitude: (Math.random() * 360) - 180
                },
                metadata: idx
            });
        }
    }
})
    .always((data) => {
    const scan = new GeoDBScan({
        getLocation(datum) {
            return datum.location;
        },
        epsilon: 10,
        minPoints: 3
    });
    const result = scan.fit(data);
    return true;
});
export default {
    fitHypothesis
};
