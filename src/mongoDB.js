import { MongoClient } from "mongodb";

//TO USE---
//   place "import {mdbGetUserAndEmail, mdbGetUserInfo, mdbAddUser} from './mongoDB.js'"
//    at beginning of file
//   simply call mdbGetUserInfo(username) where username is the users username.
//   returns an object with properties {username:,email:,password:,uathToken:}

// Replace the uri string with your MongoDB deployment's connection string.
let secrets, mongoDBURI;

if (!process.env.mongoDBURI) {
    secrets = require("secrets.JSON");
    mongoDBURI = secrets.mongoDBURI;
} else {
    mongoDBURI = process.env.mongoDBURI;
}

//mdbAddUser adds a user document{username:,email:,password:,spotifyToken:} to the usersInfo collection
export async function mdbAddUser(newUserName, newEmail, newPWord, newName) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        const newUser = {
            username: newUserName,
            email: newEmail,
            password: newPWord,
            name: newName,
            friendsList: [],
            authToken: null,
            tokenTime: null
        };
        await usersInfo.insertOne(newUser);
    } finally {
        await client.close();
    }
}
// function for checking if username and email are valid
export async function mdbGetUserEmail(passedEmail) {
    const client = new MongoClient(mongoDBURI);
    let returnedEmail;
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        // Query for a user that has the username provided in passedUserName
        const userNameQuery = { email: passedEmail };
        returnedEmail = await usersInfo.findOne(userNameQuery).email;
    } catch {
        returnedEmail = -1;
    } finally {
        await client.close();
    }
    return returnedEmail;
}
export async function mdbCheckUserName(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    let returnedUser = 0;
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        // Query for a user that has the username provided in passedUserName
        const userNameQuery = { username: passedUserName };
        returnedUser = await usersInfo.findOne(userNameQuery).username;
    } catch {
        returnedUser = null;
    } finally {
        await client.close();
    }
    return returnedUser !== null;
}
export async function mdbGetUserSaltHash(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    let returnedHash = 0;
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        // Query for a user that has the username provided in passedUserName
        const userNameQuery = { username: passedUserName };
        returnedHash = (await usersInfo.findOne(userNameQuery).salt) - hash;
    } catch {
        returnedHash = -1;
    } finally {
        await client.close();
        return returnedHash;
    }
    return returnedHash;
}
export async function mdbGetUserName(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    let returnedUser = 0;
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        // Query for a user that has the username provided in passedUserName
        const userNameQuery = { username: passedUserName };
        returnedUser = await usersInfo.findOne(userNameQuery).username;
    } catch {
        returnedUser = -1;
    } finally {
        await client.close();
    }
    return returnedUser;
}
//mdbGetUSer searches for an existing user in the database using username parameter
//returns user object
export async function mdbGetUserInfo(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    let returnedUser = 0;
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        // Query for a user that has the username provided in passedUserName
        const userNameQuery = { username: passedUserName };
        returnedUser = await usersInfo.findOne(userNameQuery);
    } catch {
        returnedUser = -1;
    } finally {
        await client.close();
    }
    return returnedUser;
}
/*export async function mdbSetUserName(passedUserName, passedPassword, newUserName) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        const user = { username: passedUserName, password: passedPassword };
        const newData = {
            $set: {
                username: newUserName,
            },
        };
        await usersInfo.updateOne(user, newData);
    } finally {
        await client.close();
    }
}*/
export async function mdbSetName(passedUserName, passedPassword, newName) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        const user = { username: passedUserName, password: passedPassword };
        const newData = {
            $set: {
                name: newName,
            },
        };
        await usersInfo.updateOne(user, newData);
    } finally {
        await client.close();
    }
}
export async function mdbSetEmail(passedUserName, passedPassword, newEmail) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        const user = { username: passedUserName, password: passedPassword };
        const newData = {
            $set: {
                email: newEmail,
            },
        };
        await usersInfo.updateOne(user, newData);
    } finally {
        await client.close();
    }
}
export async function mdbSetPassword(
    passedUserName,
    passedPassword,
    newPassword
) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        const user = { username: passedUserName, password: passedPassword };
        const newData = {
            $set: {
                password: newPassword,
            },
        };
        await usersInfo.updateOne(user, newData);
    } finally {
        await client.close();
    }
}

// sets authorization token
export async function mdbSetToken(passedUserName, tokn, time) {
    const client = new MongoClient(mongoDBURI);

    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        const user = { username: passedUserName };
        const newData = {
            $set: {
                authToken: tokn,
                token: time
            },
        };
        await usersInfo.updateOne(user, newData);
    } finally {
        await client.close();
    }
}
export async function mdbGetTokenTime(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    let returnedTokenTime = 0;
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        const userNameQuery = { username: passedUserName };
        returnedTokenTime = await usersInfo.findOne(userNameQuery).tokenTime;
    } catch {
        returnedTokenTime = -1;
    } finally {
        await client.close();
        return returnedTokenTime;
    }
}
export async function mdbAddFriend(passedUserName, newFriend) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        const user = { username: passedUserName };

        const userInfo = mdbGetUserInfo(passedUserName);
        const newFriendsList = userInfo.friendsList.append(newFriend);
        const newData = {
            $set: {
                friendsList: newFriendsList,
            },
        };
        await usersInfo.updateOne(user, newData);
    } finally {
        await client.close();
    }
}

export async function mdbAddPlaylistActivity(
    addUserName,
    addPlayListID,
    addLikes,
    addComments
) {
    const client = new MongoClient(mongoDBURI);
    const date = new Date();
    try {
        const database = client.db("spotlist");
        const playListInfo = database.collection("PLAYLISTACTIVITY");
        const newPlayListActivity = {
            time: date,
            username: addUserName,
            playListID: addPlayListID,
            likes: addLikes,
            comments: addComments,
        };
        await playListInfo.insertOne(newPlayListActivity);
    } finally {
        await client.close();
    }
}

export async function mdbGetPlaylistActivity(passedUserName, passedPlayListID) {
    const client = new MongoClient(mongoDBURI);
    let returnedPlayListActivity = 0;
    try {
        const database = client.db("spotlist");
        const playListActivities = database.collection("PLAYLISTACTIVITY");
        const playListActivityQuery = {
            username: passedUserName,
            playListID: passedPlayListID,
        };
        returnedPlayListActivity = await playListActivities.findOne(
            playListActivityQuery
        );
    } catch {
        returnedPlayListActivity = -1;
    } finally {
        await client.close();
    }
    return returnedPlayListActivity;
}
//Adds a like to the like property
export async function mdbSetPlaylistActivityLikes(
    passedUserName,
    passedPlayListID
) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const playListActivites = database.collection("PLAYLISTACTIVITY");
        const playListActivity = {
            username: passedUserName,
            playListID: passedPlayListID,
        };
        const playListActivityInfo = mdbGetPlaylistActivity(
            passedUserName,
            passedPlayListID
        );
        const newLikes = playListActivityInfo.likes + 1;
        const newData = {
            $set: {
                likes: newLikes,
            },
        };
        await playListActivites.updateOne(playListActivity, newData);
    } finally {
        await client.close();
    }
}
export async function mdbSetPlaylistActivityComments(
    passedUserName,
    passedPlayListID,
    newComment
) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const playListActivites = database.collection("PLAYLISTACTIVITY");
        const playListActivity = {
            username: passedUserName,
            playListID: passedPlayListID,
        };
        const playListActivityInfo = mdbGetPlaylistActivity(
            passedUserName,
            passedPlayListID
        );
        const newComments = playListActivityInfo.comments.append(newComment);
        const newData = {
            $set: {
                comments: newComments,
            },
        };
        await playListActivites.updateOne(playListActivity, newData);
    } finally {
        await client.close();
    }
}
