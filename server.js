import { createRequire } from "module";
import { data } from "./faker-data.js";
import {
    API_LOGIN,
    API_REGISTER,
    API_PLAYLISTS,
    API_ACTIVITY_FRIENDS,
    API_ACTIVITY_ME,
    API_SEARCH,
} from "./api.js";

const require = createRequire(import.meta.url);

// Load HTTP module
const http = require("http");

const hostname = "127.0.0.1";
const port = 8000;

// Create HTTP server
const server = http.createServer(function (req, res) {
    // Set the response HTTP header with HTTP status and Content type
    console.log(req.url);
    switch (req.url) {
    case API_LOGIN:
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data["USER"]));
        break;
    case API_REGISTER:
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data["USER"]));
        break;
    case API_PLAYLISTS:
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data["PLAYLISTS"]));
        break;
    case API_ACTIVITY_FRIENDS:
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data["FRIENDSACTIVITY"]));
        break;
    case API_ACTIVITY_ME:
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data["ACTIVITY"]));
        break;
    case API_SEARCH:
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data["SEARCHRESULT"]));
        break;
    default:
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("API does not exist.\n");
    }
});

// Prints a log once the server starts listening
server.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
