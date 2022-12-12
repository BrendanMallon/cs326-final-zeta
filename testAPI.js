import express from "express";
import { data } from "./faker-data.js";
import {
    API_LOGIN,
    API_REGISTER,
    API_PLAYLISTS,
    API_ACTIVITY_FRIENDS,
    API_ACTIVITY_ME,
    API_SEARCH,
} from "./constants/api.js";
const testAPI = express.Router();

// middleware that is specific to this router
testAPI.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});

testAPI.use((req, res, next) => {
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
        next();
    }
});

export default testAPI;
