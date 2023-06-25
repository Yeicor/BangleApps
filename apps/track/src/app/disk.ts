import {Track} from '../common/track';

const storage: typeof import("Storage") = global["require"]("Storage");
const heatshrink: typeof import("heatshrink") = global["require"]("heatshrink");

/** An abstraction to read and write track data to the device's storage. */
export const Disk = {
    /** Lists all track files in the device's storage. */
    listTracks(): string[] { // Return the base filename, to be used with readTrack
        return storage.list(/track\..*\.tck/).map((filename) =>
            filename.replace(/^track\.(.*)\.tck$/, "$1"));
    },

    /** Deserializes the given track from an array of bytes. */
    deserializeTrack: function (trackData: ArrayBuffer): Track {
        console.log("[disk] Deserializing track of length " + trackData.byteLength + "...")
        const decompressed = heatshrink.decompress(trackData);
        console.log("[disk] Deserializing track of decompressed length " + decompressed.byteLength + "...")
        let str = "";
        for (let i = 0; i < decompressed.byteLength; i++) {
            str += String.fromCharCode(decompressed[i]);
        }
        return JSON.parse(str);
    },

    /** Serializes the given track to an array of bytes. */
    serializeTrack: function (track: Track): ArrayBuffer {
        const encoded = JSON.stringify(track).split("").map((char) => char.charCodeAt(0));
        console.log("[disk] Serialized track to length " + encoded.length + "...");
        const compressed = heatshrink.compress(encoded);
        console.log("[disk] Serialized track to compressed length " + compressed.byteLength + "...");
        return compressed;
    },

    /** Loads the track with the given filename. */
    readTrack(filenameBase: string): Track {
        const filename = "track." + filenameBase + ".tck";
        console.log("[disk] Reading track " + filename + "...");
        const trackData = storage.readArrayBuffer(filename);
        if (!trackData) {
            console.error("Failed to load track: " + filename);
            return null;
        }
        return this.deserializeTrack(trackData);
    },

    /** Saves the given track to the device's storage. */
    writeTrack(filenameBase: string, track: Track) {
        const filename = "track." + filenameBase + ".tck";
        const trackData = this.serializeTrack(track);
        console.log("[disk] Writing track " + filename + "...");
        storage.write(filename, trackData);
    },

    /** Deletes the given track from the device's storage. */
    deleteTrack(filenameBase: string) {
        const filename = "track." + filenameBase + ".tck";
        if (storage.read(filename) !== undefined) {
            console.log("[disk] Deleting track " + filename + "...");
            storage.erase(filename);
        } else {
            console.log("[disk] Track " + filename + " does not exist, skipping deletion.");
        }
    }
}
