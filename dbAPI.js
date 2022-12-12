import express from "express";
import {
    mdbAddUser,
    mdbCheckUserName,
    mdbGetUserSaltHash,
    mdbAddPlaylistActivity,
    mdbGetPlaylistActivity,
    mdbAddFriend,
    mdbSetName,
    mdbGetFriendsNames,
    mdbGetFriendActivity,
} from "./src/mongoDB.js";
import {
    API_FIND_USER,
    API_REGISTER_USER,
    API_GET_USER_ACTIVITY,
    API_ADD_USER_ACTIVITY,
    API_GET_PLAYLISTS,
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
        console.log("Adding New Activity");
        console.log(req.body);
        console.log(req.user);
        await mdbAddPlaylistActivity(req.user, req.body.playListID);
        res.send("true");
        break;
    }
    case API_GET_USER_ACTIVITY: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const result = await mdbGetPlaylistActivity(req.user);
        console.log("Got Activity:");
        let results = [];
        console.log("PROMISES STARTED");
        await Promise.all(
            (results = result.map(async (activity) => {
                const SPOTID = activity.playListID;
                console.log(SPOTID);
                const response = await axios.get(
                    "http://localhost:" +
                            port +
                            `/spotify/playlistid/${SPOTID}`
                );
                const responseJSON = response.data;
                console.log(responseJSON);
                const newActivity = await JSON.parse(
                    JSON.stringify(activity)
                );
                newActivity["description"] =
                        responseJSON.playlist.description;
                newActivity["images"] = responseJSON.playlist.images;
                newActivity["name"] = responseJSON.playlist.name;
                console.log("NEW ACTIVITY");
                return newActivity;
            }))
        );
        console.log("PROMISES ARE DONE");
        console.log(results);
        let answer = [];
        Promise.all(results).then((value) => {
            console.log("should not be a promise");
            console.log(value); // 'hello world'
            answer.push(value);
        });
        const example = () => {
            return Promise.all(results).then((values) => {
                console.log(values); // ['hello world', 123, 'foo']
                return values;
            });
        };

        await example().then((values) => {
            answer = values; // The values are: ['hello world', 123, 'foo']
        });
        console.log("ANSWERS");
        console.log(answer);
        res.end(JSON.stringify(answer));
        break;
    }
    case API_ADD_FRIEND: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const result = await mdbAddFriend(req.user, req.body.friend);
        console.log("ADDED FRIEND?:");
        console.log(result);
        const response = { success: result };
        res.end(JSON.stringify(response));
        break;
    }
    case API_GET_FRIENDS_LIST: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const result = await mdbGetFriendsNames(req.user);
        console.log("Got Friends Names:");
        console.log(result);
        res.end(JSON.stringify(result));
        break;
    }
    case API_GET_FRIEND_ACTIVITY: {
        res.writeHead(200, { "Content-Type": "application/json" });
        const result = await mdbGetFriendActivity(req.user);
        console.log("Get Friends Activity:");
        let results = [];
        console.log("PROMISES STARTED");
        await Promise.all(
            (results = result.map(async (activity) => {
                const SPOTID = activity.playListID;
                console.log(SPOTID);
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
                console.log(responseJSON);
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
                console.log("NEW ACTIVITY");
                return newActivity;
            }))
        );
        console.log("PROMISES ARE DONE");
        console.log(results);
        let answer = [];
        Promise.all(results).then((value) => {
            console.log("should not be a promise");
            console.log(value); // 'hello world'
            answer.push(value);
        });
        const example = () => {
            return Promise.all(results).then((values) => {
                console.log(values); // ['hello world', 123, 'foo']
                return values;
            });
        };

        await example().then((values) => {
            answer = values; // The values are: ['hello world', 123, 'foo']
        });
        console.log("ANSWERS");
        console.log(answer);
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
