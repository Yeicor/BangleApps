import {Track} from "../common/track";
import {gpsLastLocation} from "./gps";

function renderTrack(track: Track) {
    const startTime = new Date().getTime();
    // console.log("Rendering track " + track.name + " with " + track.points.length + " points...");
    g.clear();
    const center = gpsLastLocation;
    const zoom = 0.00005; // Zoom based on lat/lon
    const width = g.getWidth();
    const height = g.getHeight();
    const mapX = (point: number) => (point - center!.lat) / zoom + width / 2;
    const mapY = (point: number) => (point - center!.lon) / zoom + height / 2;
    const pointsXY = []
    track.points.forEach(point => {
        pointsXY.push(mapX(point.lat));
        pointsXY.push(mapY(point.lon));
    });
    // console.log("Render points: " + pointsXY.map(p => "(" + p.x + ", " + p.y + ")").join(", "),
    //     "Center: " + center!.lat + ", " + center!.lon + ", Zoom: " + zoom + ", Width: " + width + ", Height: " + height);
    // let lastPoint = pointsXY[0];
    // for (let i = 1; i < pointsXY.length; i++) {
    //     const point = pointsXY[i];
    //     g.drawLine(lastPoint.x, lastPoint.y, point.x, point.y);
    //     lastPoint = point;
    // }
    g.drawPoly(pointsXY, false);
    console.log("Rendered track in " + (new Date().getTime() - startTime) + "ms");
}

/** Start the main loop that follows the track. */
export function follow(track: Track) {
    console.log("Following track " + track.name + " with " + track.points.length + " points...");
    setInterval(() => {
        renderTrack(track);
    }, 5000);
    renderTrack(track);
}