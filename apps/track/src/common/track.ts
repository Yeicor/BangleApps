/** A 3D point made up of a latitude, longitude and height. */
export class Point3 {
    /** The latitude of the point. */
    lat: number;
    /** The longitude of the point. */
    lon: number;
    /** The altitude of the point. */
    alt: number;

    /** Builds a new 3D point. */
    constructor(lat: number, lon: number, height: number) {
        this.lat = lat;
        this.lon = lon;
        this.alt = height;
    }

    /** Euclidean distance between this point and the given point. */
    distance(point: Point3): number {
        return Math.sqrt(Math.pow(this.lat - point.lat, 2) + Math.pow(this.lon - point.lon, 2) + Math.pow(this.alt - point.alt, 2));
    }

    /** Returns a string representation of the given point. */
    toPtString(point: Point3): String {
        return "(" + point.lat + ", " + point.lon + ", " + point.alt + ")";
    }
}

/** Represents a track or route that is being followed or recorded. */
export class Track {
    /** The name of the track. */
    name: string;

    /** The original raw data points that make up the track. */
    points: Point3[];

    /** The optimized tree data structure that allows for fast queries, returning indices into the [points] array. */
    pointsTree: {
        /** Return all indices of points in the given bounding box. */
        range(x: number, y: number, width: number, height: number): number[];
    };

    /** Builds a new known track from the given name and points. */
    constructor(name: string, points: Point3[]) {
        this.name = name;
        this.points = points;
        // TODO: Also resample metadata associated with each original point
        // this.points = resampleMinDistance(points);
    }

    /** Returns all indices of points in the given bounding box. */
    pointIndicesBbox(x: number, y: number, z: number, width: number, height: number, depth: number): number[] {
        // return this.pointsTree.range(x, y, width, height);
        throw new Error("Not implemented");
    }

    /** Returns all points in the given bounding box. */
    pointsBbox(x: number, y: number, z: number, width: number, height: number, depth: number): Array<Point3> {
        const indices = this.pointIndicesBbox(x, y, z, width, height, depth);
        return indices.map(i => this.points[i]);
    }
}

/** Resamples the lines for the given points to have similar distances between points and avoid complex shapes. */
function resampleMinDistance(points: Array<Point3>): Array<Point3> {
    let reqMinDistance = points.reduce((min, point, i) => {
        if (i === 0) return Infinity;
        const distance = point.distance(points[i - 1]);
        return Math.min(min, distance);
    }, Infinity);
    console.log("Min distance: " + reqMinDistance);
    const resampledPoints = [points[0]];
    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        let lastPoint = resampledPoints[resampledPoints.length - 1];
        const distance = point.distance(lastPoint);
        if (distance >= reqMinDistance) { // The next point is too far away, generate intermediate points
            const numPoints = Math.floor(distance / reqMinDistance) + 1; // keep sharp corners with original points
            const dx = (point.lat - lastPoint.lat) / numPoints;
            const dy = (point.lon - lastPoint.lon) / numPoints;
            const dz = (point.alt - lastPoint.alt) / numPoints;
            for (let j = 1; j < numPoints; j++) {
                resampledPoints.push(new Point3(lastPoint.lat + dx * j, lastPoint.lon + dy * j, lastPoint.alt + dz * j));
            }
        } else { // The next point is close enough to the last point
            resampledPoints.push(point);
        }
    }
    return resampledPoints;
}