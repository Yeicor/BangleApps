import {Disk} from "./disk";
import {Point3, Track} from "../common/track";
import {gpsLastLocation} from "./gps";

/** Returns true if we are in development mode. */
export function isDev() {
    return process.env.NODE_ENV !== 'production';
}

/** Run this at the start, for development builds only. */
export function startDev() {
    // If no track is loaded, add a default track
    Disk.deleteTrack("dev") // Overwrite any existing dev track
    if (Disk.listTracks().length === 0) {
        // TODO: Relative to current GPS location...
        console.log("[dev] Waiting for GPS fix...")
        let interval = setInterval(() => {
            if (gpsLastLocation) {
                clearInterval(interval)
                createAndSaveDevTrack()
            }
        }, 1000)
    }
}

function createAndSaveDevTrack() {
    console.log("[dev] Creating default track...")
    let devTrack = new Track("Dev Track", DEMO_TRACK_POINTS.map((point) => {
        return new Point3(gpsLastLocation.lat + point.lat / 1000, gpsLastLocation.lon + point.lon / 1000, point.alt + gpsLastLocation.alt)
    }));
    console.log("[dev] Adding default track to disk...")
    Disk.writeTrack("dev", devTrack)
    console.log("[dev] Added default track to disk")
}

const DEMO_TRACK_POINTS = [
    new Point3(0, 0, 0),
    new Point3(1, 1, 0),
    new Point3(2, 3, 0),
    new Point3(1, -1, 0),
    new Point3(-2, 0, 0),
    new Point3(-1, 0, 0),
];