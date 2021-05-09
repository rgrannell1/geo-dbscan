import * as fs from 'fs';
import { GeoDBScan } from "../src/geoscan.js";
import { Hypothesis } from 'atypical';
const salesHypothesis = new Hypothesis({
    description: 'sales data is clustered as expected'
})
    .cases(async function* () {
    const content = await fs.promises.readFile('./data/locations.json');
    const locations = JSON.parse(content.toString());
    yield [locations];
})
    .always((locations) => {
    const scan = new GeoDBScan({
        getLocation(datum) {
            return { latitude: datum.y, longitude: datum.x };
        },
        epsilon: 500,
        minPoints: 5
    });
    const clusters = scan.fit(locations);
    return clusters.stats.clusteredCount > clusters.stats.clusterCount;
});
export default {
    salesHypothesis
};
//# sourceMappingURL=sales.js.map