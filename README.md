
# geo-dbscan 🗺️

Cluster geographical location-data using DBSCAN. Inspired by [dbscan_gps](https://www.npmjs.com/package/dbscan_gps)

[![CI](https://github.com/rgrannell1/geo-dbscan/actions/workflows/ci.yaml/badge.svg)](https://github.com/rgrannell1/geo-dbscan/actions/workflows/ci.yaml)

Cluster geographical location-data.

```ts
const data = [
  {
    species: 'grouse',
    location: {
      longitude: -6.2757118,
      latitude: 53.3464217
    }
  },
  {
    species: 'grouse',
    location: {
      longitude: -6.2291862,
      latitude: 53.3863404
    }
  },
  {
    species: 'quail',
    location: {
      longitude: -6.3798805,
      latitude: 53.3376124
    }
  },
  {
    species: 'grouse',
    location: {
      longitude: -6.2384634,
      latitude: 53.3584065
    }
  },
  {
    species: 'pheasant',
    location: {
      longitude: -6.1985568,
      latitude: 53.3942513
    }
  },
  {
    species: 'pheasant',
    location: {
      longitude: -6.2341133,
      latitude: 53.3543216
    }
  },
  {
    species: 'quail',
    location: {
      longitude: -6.1787156,
      latitude: 53.2495501
    }
  },
]

const scan = new GeoDBScan({
  getLocation (datum: any) {
    return datum.location
  },
  epsilon: 10,
  minPoints: 3
})

const result = scan.fit(data)
```

## Stability

> 1, Experimental - This project might die, it's undertested and underdocumented, and redesigns and breaking changes are likely

## Motivation

Node.js has a few DBScan libraries, but none of them were quite right for me. `dbscan_gps` is good but it has a weird callback interface (it's syncronous!) and error-handling, and the performance is horrible when `n > 5,000`

## Background

[DBSCAN](https://en.wikipedia.org/wiki/DBSCAN) is a density-based clustering algorithm that can be used to cluster geolocations based on density, with points in low-density areas being treated as noise. `geo-dbscan` uses two tuning parameters:

- `epsilon`: how far can a point be from a cluster to be included in said cluster? Larger values of epsilon will lead to larger clusters that include more "noise" points, smaller values will produce fewer cluster but they'll be denser. Measured in `km`
- `minPoints`: the minimum points to form a cluster

These values have to be chosen with knowledge of the data-set and application.

## Benchmarking

```
1: took 0 seconds
2: took 0 seconds
4: took 0 seconds
8: took 0 seconds
16: took 0 seconds
32: took 0 seconds
64: took 0 seconds
128: took 0 seconds
256: took 0 seconds
512: took 0 seconds
1,024: took 0 seconds
2,048: took 0 seconds
4,096: took 3 seconds
8,192: took 28 seconds
16,384: took 223 seconds
```

## API

### `new GeoDBScan(opts: GeoDBScanOpts)`

Construct a geodbscan object that can be used to cluster geographical data.

- `opts.getLocation`: a function that retrieves an object containing longitude, latitude data from a data-entry provided
- `opts.minPoints`: the minimum number of points in a cluster
- `opts.epsilon`: the local radius of a cluster, in kilometers

### `geoScan.fit(data)`

Cluster data by location. Some points will be classified as noise if they are too far from any cluster.

## License

The MIT License

Copyright (c) 2020 Róisín Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
