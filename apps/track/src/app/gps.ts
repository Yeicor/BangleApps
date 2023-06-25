import {Point3} from "../common/track";

/** The last known location of the device, as a pair of latitude and longitude. */
export let gpsLastLocation: Point3 | null = null;

/** The time when the device's location was last updated. */
export let gpsLastLocationTime: Date | null = null;

/** Starts the GPS. */
export function gpsStart(simulate: boolean) {
    if (simulate) {
        gpsSetLocation(new Point3(0, 0, 123.4));
        setInterval(() => {
            gpsSetLocation(new Point3(gpsLastLocation.lat + 0.0001, gpsLastLocation.lon + 0.0001, 123.4))
        }, 1000);
    } else {
        Bangle.setGPSPower(!simulate, "track");
        Bangle.on("GPS", (gpsData) => {
            if (!gpsData.fix) return;
            gpsSetLocation(new Point3(gpsData.lat, gpsData.lon, gpsData.alt));
        });
    }
}

/** Manage listeners that get called whenever the user's location changes. */
export const gpsListeners: Array<(location: Point3) => void> = [];

function gpsSetLocation(loc: Point3) {
    gpsLastLocation = loc;
    gpsLastLocationTime = new Date();
    gpsListeners.forEach(listener => listener(loc));
}
