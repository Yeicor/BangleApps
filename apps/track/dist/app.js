(() => {
var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $49fcc7c63866fc48$var$storage = $parcel$global["require"]("Storage");
var $49fcc7c63866fc48$var$heatshrink = $parcel$global["require"]("heatshrink");
var $49fcc7c63866fc48$export$b64a33a8b9eb7b61 = {
    /** Lists all track files in the device's storage. */ listTracks () {
        // Return the base filename, to be used with readTrack
        return $49fcc7c63866fc48$var$storage.list(/track\..*\.tck/).map((filename)=>filename.replace(/^track\.(.*)\.tck$/, "$1"));
    },
    /** Deserializes the given track from an array of bytes. */ deserializeTrack: function deserializeTrack(trackData) {
        console.log("[disk] Deserializing track of length " + trackData.byteLength + "...");
        var decompressed = $49fcc7c63866fc48$var$heatshrink.decompress(trackData);
        console.log("[disk] Deserializing track of decompressed length " + decompressed.byteLength + "...");
        var str = "";
        for(var i = 0; i < decompressed.byteLength; i++)str += String.fromCharCode(decompressed[i]);
        return JSON.parse(str);
    },
    /** Serializes the given track to an array of bytes. */ serializeTrack: function serializeTrack(track) {
        var encoded = JSON.stringify(track).split("").map((char)=>char.charCodeAt(0));
        console.log("[disk] Serialized track to length " + encoded.length + "...");
        var compressed = $49fcc7c63866fc48$var$heatshrink.compress(encoded);
        console.log("[disk] Serialized track to compressed length " + compressed.byteLength + "...");
        return compressed;
    },
    /** Loads the track with the given filename. */ readTrack (filenameBase) {
        var filename = "track." + filenameBase + ".tck";
        console.log("[disk] Reading track " + filename + "...");
        var trackData = $49fcc7c63866fc48$var$storage.readArrayBuffer(filename);
        if (!trackData) return null;
        return this.deserializeTrack(trackData);
    },
    /** Saves the given track to the device's storage. */ writeTrack (filenameBase, track) {
        var filename = "track." + filenameBase + ".tck";
        var trackData = this.serializeTrack(track);
        console.log("[disk] Writing track " + filename + "...");
        $49fcc7c63866fc48$var$storage.write(filename, trackData);
    },
    /** Deletes the given track from the device's storage. */ deleteTrack (filenameBase) {
        var filename = "track." + filenameBase + ".tck";
        if ($49fcc7c63866fc48$var$storage.read(filename) !== undefined) {
            console.log("[disk] Deleting track " + filename + "...");
            $49fcc7c63866fc48$var$storage.erase(filename);
        } else console.log("[disk] Track " + filename + " does not exist, skipping deletion.");
    }
};


/** A 3D point made up of a latitude, longitude and height. */ class $fe25603c6edc2c34$export$ca6a413c2594b678 {
    /** Euclidean distance between this point and the given point. */ distance(point) {
        return Math.sqrt(Math.pow(this.lat - point.lat, 2) + Math.pow(this.lon - point.lon, 2) + Math.pow(this.alt - point.alt, 2));
    }
    /** Returns a string representation of the given point. */ toPtString(point) {
        return "(" + point.lat + ", " + point.lon + ", " + point.alt + ")";
    }
    /** Builds a new 3D point. */ constructor(lat, lon, height){
        this.lat = lat;
        this.lon = lon;
        this.alt = height;
    }
}
class $fe25603c6edc2c34$export$13921ac0cc260818 {
    /** Returns all indices of points in the given bounding box. */ pointIndicesBbox(x, y, z, width, height, depth) {
        // return this.pointsTree.range(x, y, width, height);
        throw new Error("Not implemented");
    }
    /** Returns all points in the given bounding box. */ pointsBbox(x, y, z, width, height, depth) {
        var indices = this.pointIndicesBbox(x, y, z, width, height, depth);
        return indices.map((i)=>this.points[i]);
    }
    /** Builds a new known track from the given name and points. */ constructor(name, points){
        this.name = name;
        this.points = points;
    // TODO: Also resample metadata associated with each original point
    // this.points = resampleMinDistance(points);
    }
}
/** Resamples the lines for the given points to have similar distances between points and avoid complex shapes. */ function $fe25603c6edc2c34$var$resampleMinDistance(points) {
    var reqMinDistance = points.reduce((min, point, i)=>{
        if (i === 0) return Infinity;
        var distance = point.distance(points[i - 1]);
        return Math.min(min, distance);
    }, Infinity);
    console.log("Min distance: " + reqMinDistance);
    var resampledPoints = [
        points[0]
    ];
    for(var i = 1; i < points.length; i++){
        var point = points[i];
        var lastPoint = resampledPoints[resampledPoints.length - 1];
        var distance = point.distance(lastPoint);
        if (distance >= reqMinDistance) {
            // The next point is too far away, generate intermediate points
            var numPoints = Math.floor(distance / reqMinDistance) + 1; // keep sharp corners with original points
            var dx = (point.lat - lastPoint.lat) / numPoints;
            var dy = (point.lon - lastPoint.lon) / numPoints;
            var dz = (point.alt - lastPoint.alt) / numPoints;
            for(var j = 1; j < numPoints; j++)resampledPoints.push(new $fe25603c6edc2c34$export$ca6a413c2594b678(lastPoint.lat + dx * j, lastPoint.lon + dy * j, lastPoint.alt + dz * j));
        } else // The next point is close enough to the last point
        resampledPoints.push(point);
    }
    return resampledPoints;
}



var $443379ac4a29b111$export$187463123d82bd2c = null;
var $443379ac4a29b111$export$a60b1635d45a17a5 = null;
function $443379ac4a29b111$export$d5e83235c03acbaf(simulate) {
    if (simulate) {
        $443379ac4a29b111$var$gpsSetLocation(new (0, $fe25603c6edc2c34$export$ca6a413c2594b678)(0, 0, 123.4));
        setInterval(()=>{
            $443379ac4a29b111$var$gpsSetLocation(new (0, $fe25603c6edc2c34$export$ca6a413c2594b678)($443379ac4a29b111$export$187463123d82bd2c.lat + 0.0001, $443379ac4a29b111$export$187463123d82bd2c.lon + 0.0001, 123.4));
        }, 1000);
    } else {
        Bangle.setGPSPower(!simulate, "track");
        Bangle.on("GPS", (gpsData)=>{
            if (!gpsData.fix) return;
            $443379ac4a29b111$var$gpsSetLocation(new (0, $fe25603c6edc2c34$export$ca6a413c2594b678)(gpsData.lat, gpsData.lon, gpsData.alt));
        });
    }
}
var $443379ac4a29b111$export$44870ad4d9ef7153 = [];
function $443379ac4a29b111$var$gpsSetLocation(loc) {
    $443379ac4a29b111$export$187463123d82bd2c = loc;
    $443379ac4a29b111$export$a60b1635d45a17a5 = new Date();
    $443379ac4a29b111$export$44870ad4d9ef7153.forEach((listener)=>listener(loc));
}


function $7375eaa9692e525f$export$40edfb7eeb78c4e8() {
    return true;
}
function $7375eaa9692e525f$export$6848db32b3dc36c9() {
    // If no track is loaded, add a default track
    (0, $49fcc7c63866fc48$export$b64a33a8b9eb7b61).deleteTrack("dev"); // Overwrite any existing dev track
    if ((0, $49fcc7c63866fc48$export$b64a33a8b9eb7b61).listTracks().length === 0) {
        // TODO: Relative to current GPS location...
        console.log("[dev] Waiting for GPS fix...");
        var interval = setInterval(()=>{
            if (0, $443379ac4a29b111$export$187463123d82bd2c) {
                clearInterval(interval);
                $7375eaa9692e525f$var$createAndSaveDevTrack();
            }
        }, 1000);
    }
}
function $7375eaa9692e525f$var$createAndSaveDevTrack() {
    console.log("[dev] Creating default track...");
    var devTrack = new (0, $fe25603c6edc2c34$export$13921ac0cc260818)("Dev Track", $7375eaa9692e525f$var$DEMO_TRACK_POINTS.map((point)=>{
        return new (0, $fe25603c6edc2c34$export$ca6a413c2594b678)((0, $443379ac4a29b111$export$187463123d82bd2c).lat + point.lat / 1000, (0, $443379ac4a29b111$export$187463123d82bd2c).lon + point.lon / 1000, point.alt + (0, $443379ac4a29b111$export$187463123d82bd2c).alt);
    }));
    console.log("[dev] Adding default track to disk...");
    (0, $49fcc7c63866fc48$export$b64a33a8b9eb7b61).writeTrack("dev", devTrack);
    console.log("[dev] Added default track to disk");
}
var $7375eaa9692e525f$var$DEMO_TRACK_POINTS = [
    new (0, $fe25603c6edc2c34$export$ca6a413c2594b678)(0, 0, 0),
    new (0, $fe25603c6edc2c34$export$ca6a413c2594b678)(1, 1, 0),
    new (0, $fe25603c6edc2c34$export$ca6a413c2594b678)(2, 3, 0),
    new (0, $fe25603c6edc2c34$export$ca6a413c2594b678)(1, -1, 0),
    new (0, $fe25603c6edc2c34$export$ca6a413c2594b678)(-2, 0, 0),
    new (0, $fe25603c6edc2c34$export$ca6a413c2594b678)(-1, 0, 0)
];





function $6866f43bf0aa3135$var$renderTrack(track) {
    var startTime = new Date().getTime();
    // console.log("Rendering track " + track.name + " with " + track.points.length + " points...");
    g.clear();
    var center = (0, $443379ac4a29b111$export$187463123d82bd2c);
    var zoom = 0.00005; // Zoom based on lat/lon
    var width = g.getWidth();
    var height = g.getHeight();
    var mapX = (point)=>(point - center.lat) / zoom + width / 2;
    var mapY = (point)=>(point - center.lon) / zoom + height / 2;
    var pointsXY = [];
    track.points.forEach((point)=>{
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
function $6866f43bf0aa3135$export$31f068b2e91b5a3f(track) {
    console.log("Following track " + track.name + " with " + track.points.length + " points...");
    setInterval(()=>{
        $6866f43bf0aa3135$var$renderTrack(track);
    }, 5000);
    $6866f43bf0aa3135$var$renderTrack(track);
}


function $878dc477afbe80e5$export$11e63f7b0f3d9900(filename) {
    console.log("Loading " + filename + "...");
    var track = (0, $49fcc7c63866fc48$export$b64a33a8b9eb7b61).readTrack(filename);
    if (!track) return;
    (0, $6866f43bf0aa3135$export$31f068b2e91b5a3f)(track);
}
function $878dc477afbe80e5$var$startLoadTrack() {
    // Display a loading message while we work...
    console.log("startLoadTrack...");
    // List all track files in the device's storage
    var tracks = (0, $49fcc7c63866fc48$export$b64a33a8b9eb7b61).listTracks();
    console.log("Found " + tracks.length + " saved tracks: " + tracks.join(", "));
    switch(tracks.length){
        case 0:
            E.showAlert("No tracks found! Use the app loader...").then($878dc477afbe80e5$export$b3571188c770cc5a);
            break;
        case 1:
            // If there's only one file, load it automatically
            $878dc477afbe80e5$export$11e63f7b0f3d9900(tracks[0]);
            break;
        default:
            console.log("Multiple tracks found! Showing menu...");
            E.showMenu(Object.assign({
                "": {
                    "title": "-- Load Track --"
                }
            }, tracks.map((track)=>{
                return {
                    [track]: ()=>{
                        $878dc477afbe80e5$export$11e63f7b0f3d9900(track);
                    }
                };
            })));
            break;
    }
}
function $878dc477afbe80e5$var$startRecordTrack() {
    console.log("startRecordTrack: Not implemented");
}
function $878dc477afbe80e5$export$b3571188c770cc5a() {
    console.log(`Starting Track ${"0.01"} (${"2023-06-25T17:30:34Z"}, ${"development"})...`);
    if ((0, $7375eaa9692e525f$export$40edfb7eeb78c4e8)()) (0, $7375eaa9692e525f$export$6848db32b3dc36c9)(); // Run dev code if we're in development mode
    (0, $443379ac4a29b111$export$d5e83235c03acbaf)((0, $7375eaa9692e525f$export$40edfb7eeb78c4e8)()); // Start loading the GPS to get a fix as soon as possible
    // TODO: Load and display all widgets
    // Bangle.loadWidgets();
    // Bangle.drawWidgets();
    console.log("Starting main menu...");
    E.showMenu({
        "Load Track": $878dc477afbe80e5$var$startLoadTrack,
        "Record Track": $878dc477afbe80e5$var$startRecordTrack,
        "< Back": function() {
            Bangle.showClock();
        }
    });
}
/** Call the entry point of the app. */ $878dc477afbe80e5$export$b3571188c770cc5a();

})();
