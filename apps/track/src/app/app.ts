import {isDev, startDev} from "./dev";
import {Disk} from "./disk";
import {gpsStart} from "./gps";
import {follow} from "./follow";

/** Loads the given custom track file. */
export function load(filename: string) {
    console.log("Loading " + filename + "...");
    const track = Disk.readTrack(filename)
    if (!track) {
        console.error("Failed to load track: " + filename)
        return;
    }
    follow(track)
}

function startLoadTrack() {
    // Display a loading message while we work...
    console.log("startLoadTrack...");

    // List all track files in the device's storage
    const tracks = Disk.listTracks()
    console.log("Found " + tracks.length + " saved tracks: " + tracks.join(", "));

    switch (tracks.length) {
        case 0:
            E.showAlert("No tracks found! Use the app loader...").then(start)
            break;
        case 1:
            // If there's only one file, load it automatically
            load(tracks[0]);
            break;
        default:
            console.log("Multiple tracks found! Showing menu...");
            E.showMenu(Object.assign({
                        '': {'title': '-- Load Track --'},
                    },
                    tracks.map((track) => {
                        return {
                            [track]: () => {
                                load(track);
                            }
                        };
                    })
                )
            );
            break;
    }
}

function startRecordTrack() {
    console.log("startRecordTrack: Not implemented");
}

/** The entry point of the app. */
export function start() {
    console.log(`Starting Track ${process.env.VERSION} (${process.env.BUILD_DATE}, ${process.env.NODE_ENV})...`);

    if (isDev()) startDev(); // Run dev code if we're in development mode

    gpsStart(isDev()); // Start loading the GPS to get a fix as soon as possible

    // TODO: Load and display all widgets
    // Bangle.loadWidgets();
    // Bangle.drawWidgets();

    console.log("Starting main menu...");
    E.showMenu({
        'Load Track': startLoadTrack,
        'Record Track': startRecordTrack,
        '< Back': function () {
            Bangle.showClock();
        }
    })
}

/** Call the entry point of the app. */
start();