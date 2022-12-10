import express from "express";
import {
    mdbAddUser,
    mdbCheckUserName,
    mdbGetUserSaltHash,
    mdbAddPlaylistActivity,
    mdbGetPlaylistActivity,
} from "./src/mongoDB.js";
import {
    API_FIND_USER,
    API_REGISTER_USER,
    API_GET_USER_ACTIVITY,
    API_ADD_USER_ACTIVITY,
} from "./constants/api.js";
const dbAPI = express.Router();

// middleware that is specific to this router
dbAPI.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});

dbAPI.use(async (req, res, next) => {
    console.log(req.url);
    switch (req.url) {
    case API_REGISTER_USER: {
        // res.writeHead(200, { "Content-Type": "application/json" });
        console.log("Adding New User");
        console.log(req.body);
        await mdbAddUser(
            req.body.username,
            req.body.email,
            req.body.salt_hash,
            req.body.name
        );
        // res.end(JSON.stringify(true));
        res.send("true");
        break;
    }
    case API_FIND_USER: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const exists = await mdbCheckUserName(req.body.username);
        console.log("first done");
        console.log(req.body);
        const salt_hash = await mdbGetUserSaltHash(req.body.username);
        console.log("Exists and salt_hash are obtained");
        const result = { exists, salt_hash };
        console.log(result);
        res.end(JSON.stringify(result));
        break;
    }
    case API_ADD_USER_ACTIVITY: {
        console.log("Adding New User");
        console.log(req.body);
        await mdbAddPlaylistActivity(
            req.body.username,
            req.body.playListID
        );
        // res.end(JSON.stringify(true));
        res.send("true");
        break;
    }
    case API_GET_USER_ACTIVITY: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const result = await mdbGetPlaylistActivity(req.body.username);
        console.log("Got Activity:");
        console.log(result);
        res.end(JSON.stringify(result));
        break;
    }
    default:
        next();
    }
});

export default dbAPI;
