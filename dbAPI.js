import express from "express";
import {
    mdbAddUser,
    mdbCheckUserName,
    mdbGetUserSaltHash,
    mdbAddPlaylistActivity,
    mdbGetPlaylistActivity,
    mdbAddFriend,
    mdbGetFriendsNames,
    mdbGetFriendActivity,
} from "./src/mongoDB.js";
import {
    API_FIND_USER,
    API_REGISTER_USER,
    API_GET_USER_ACTIVITY,
    API_ADD_USER_ACTIVITY,
    API_ADD_FRIEND,
    API_GET_FRIENDS_LIST,
    API_GET_FRIEND_ACTIVITY,
} from "./constants/api.js";
import axios from "axios";
const dbAPI = express.Router();

const port = process.env.PORT || 3000;

// middleware that is specific to this router
dbAPI.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});

dbAPI.use(async (req, res, next) => {
    switch (req.url) {
    case API_REGISTER_USER: {
        await mdbAddUser(
            req.body.username,
            req.body.email,
            req.body.salt_hash,
            req.body.name
        );
        res.send("true");
        break;
    }
    case API_FIND_USER: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const exists = await mdbCheckUserName(req.body.username);
        const salt_hash = await mdbGetUserSaltHash(req.body.username);
        const result = { exists, salt_hash };
        res.end(JSON.stringify(result));
        break;
    }
    case API_ADD_USER_ACTIVITY: {
        await mdbAddPlaylistActivity(req.user, req.body.playListID);
        res.send("true");
        break;
    }
    case API_GET_USER_ACTIVITY: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const result = await mdbGetPlaylistActivity(req.user);
        let results = [];
        await Promise.all(
            (results = result.map(async (activity) => {
                const SPOTID = activity.playListID;
                const response = await axios.get(
                    "http://localhost:" +
                            port +
                            `/spotify/playlistid/${SPOTID}`
                );
                const responseJSON = response.data;
                const newActivity = await JSON.parse(
                    JSON.stringify(activity)
                );
                newActivity["description"] =
                        responseJSON.playlist.description;
                newActivity["images"] = responseJSON.playlist.images;
                newActivity["name"] = responseJSON.playlist.name;
                return newActivity;
            }))
        );
        let answer = [];
        Promise.all(results).then((value) => {
            answer.push(value);
        });
        const example = () => {
            return Promise.all(results).then((values) => {
                return values;
            });
        };

        await example().then((values) => {
            answer = values;
        });
        res.end(JSON.stringify(answer));
        break;
    }
    case API_ADD_FRIEND: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const result = await mdbAddFriend(req.user, req.body.friend);
        const response = { success: result };
        res.end(JSON.stringify(response));
        break;
    }
    case API_GET_FRIENDS_LIST: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const result = await mdbGetFriendsNames(req.user);
        res.end(JSON.stringify(result));
        break;
    }
    case API_GET_FRIEND_ACTIVITY: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const result = await mdbGetFriendActivity(req.user);
        let results = [];
        await Promise.all(
            (results = result.map(async (activity) => {
                const SPOTID = activity.playListID;
                const error = false;
                const response = await axios
                    .get(
                        "http://localhost:" +
                                port +
                                `/spotify/playlistid/${SPOTID}`
                    )
                    .catch((error) => {
                        console.log(error);
                        error = true;
                    });
                const responseJSON = response.data;
                const newActivity = await JSON.parse(
                    JSON.stringify(activity)
                );
                if (!error) {
                    newActivity["description"] =
                            responseJSON.playlist.description;
                    newActivity["images"] = responseJSON.playlist.images;
                    newActivity["name"] = responseJSON.playlist.name;
                }
                newActivity.error = error;
                return newActivity;
            }))
        );
        let answer = [];
        Promise.all(results).then((value) => {
            answer.push(value);
        });
        const example = () => {
            return Promise.all(results).then((values) => {
                return values;
            });
        };

        await example().then((values) => {
            answer = values;
        });
        const noErrorAnswers = [];
        for (let i = 0; i < answer.length; i++) {
            if (!answer[i].error) {
                noErrorAnswers.push(answer[i]);
            }
        }
        res.end(JSON.stringify(noErrorAnswers));
        break;
    }

    default:
        next();
    }
});

export default dbAPI;
