
# geo-dbscan 🗺️

Very fast geolocation clustering using DBSCAN.

[![CI](https://github.com/rgrannell1/geo-dbscan/actions/workflows/ci.yaml/badge.svg)](https://github.com/rgrannell1/geo-dbscan/actions/workflows/ci.yaml)

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
  epsilon: 10_000,
  minPoints: 3
})

const result = scan.fit(data)
```

## Stability

> 2, Evolving - This project is healthy, but might lack testing or documentation or it is prone to breaking changes

## Motivation

Node.js has a few DBScan libraries, but none I found worked well. `dbscan_gps` is good but it has a weird callback interface (it's syncronous!) and error-handling, and the performance is horrible when `n > 5,000`. In comparison, geo-dbscan is:

- **fast**: `geo-dbscan` uses spatial indexing to speed up neighbour searches
- **flexible**: `geo-dbscan` lets you provide an accessor to retrieve longitude-latitude coordinates so you don't need to alter your data-model

## Background

[DBSCAN](https://en.wikipedia.org/wiki/DBSCAN) is a density-based clustering algorithm that can be used to cluster geolocations based on density, with points in low-density areas being treated as noise. `geo-dbscan` uses two tuning parameters:

- `epsilon`: how far can a point be from a cluster to be included in said cluster? Larger values of epsilon will lead to larger clusters that include more "noise" points, smaller values will produce fewer cluster but they'll be denser. Measured in `km`
- `minPoints`: the minimum points to form a dense region

These values have to be chosen with knowledge of the data-set and application.

The bottleneck in DBSCAN is the search for points within a radius `r` of a selected point `p`. This can be accelerated by using a data-structure suitable for these searches. `geo-dbscan` uses a combination of techniques:

- points are stored along with their [geohash](https://en.wikipedia.org/wiki/Geohash#Algorithm_and_example), and only points in nearby geohashes are examined 
- the haversine distance for each point to `p` in this area is computed; if it's within the required radius, it's returned.

## Benchmarking

I benchmarked geo-dbscan against real-world location-data to gauge performance. The existing "fast" algorithms I found took

```
1: took 0 seconds
1,001: took 0 seconds
2,001: took 1 seconds
3,001: took 6 seconds
4,001: took 18 seconds
5,001: took 35 seconds
6,001: took 56 seconds
7,001: took 77 seconds
8,001: took 105 seconds
9,001: took 160 seconds
10,001: took 245 seconds
```

mine took **100ms** for this data-set

## API

### `new GeoDBScan(opts: GeoDBScanOpts)`

Construct a geodbscan object that can be used to cluster geographical data.

- `opts.getLocation`: a function that retrieves an object containing longitude, latitude data from a data-entry provided
- `opts.minPoints`: the minimum number of points in a cluster
- `opts.epsilon`: the local radius of a cluster, in meters

### `geoScan.fit(data)`

Cluster data by location. Some points will be classified as noise if they are too far from any cluster.

## License

The MIT License

Copyright (c) 2020 Róisín Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
