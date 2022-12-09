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
            refreshToken: null,
        };
        await usersInfo.insertOne(newUser);
    } finally {
        await client.close();
    }
}
// function for checking if username and email are valid
export async function mdbGetUserEmail(passedEmail) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        // Query for a user that has the username provided in passedUserName
        const userNameQuery = { email: passedEmail  };
        const returnedEmail = await usersInfo.findOne(userNameQuery).email;
    } catch {
        returnedEmail = -1;

    } finally {
        await client.close();
        return  returnedEmail;
    }
}
export async function mdbGetUserName(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        // Query for a user that has the username provided in passedUserName
        const userNameQuery = { username: passedUserName };
        const returnedUser = await usersInfo.findOne(userNameQuery).username;
    } catch {
        returnedUser = -1;
    } finally {
        await client.close();
        return returnedUser
    }
}
//mdbGetUSer searches for an existing user in the database using username parameter
//returns user object
export async function mdbGetUserInfo(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        // Query for a user that has the username provided in passedUserName
        const userNameQuery = { username: passedUserName };
        const returnedUser = await usersInfo.findOne(userNameQuery);
    } catch {
        returnedUser = -1;
    } finally {
        await client.close();
        return returnedUser;
    }
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
export async function mdbSetPassword(passedUserName, passedPassword, newPassword) {
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
export async function mdbSetAuthToken(passedUserName, authT) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        const user = { username: passedUserName };
        const newData = {
            $set: {
                authToken: authT,
            },
        };
        await usersInfo.updateOne(user, newData);
    } finally {
        await client.close();
    }
}
export async function mdbSetRefreshToken(passedUserName, refT) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        const user = { username: passedUserName };
        const newData = {
            $set: {
                refreshToken: refT,
            },
        };
        await usersInfo.updateOne(user, newData);
    } finally {
        await client.close();
    }
}
export async function mdbAddFriend(passedUserName, newFriend) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS");
        const user = { username: passedUserName };

        const userInfo = mdbGetUserInfo(passedUserName);
        newFriendsList = userInfo.friendsList.append(newFriend);
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
    date = new Date();
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
        await usersInfo.insertOne(newPlayListActivity);
    } finally {
        await client.close();
    }
}

export async function mdbGetPlaylistActivity(passedUserName, passedPlayListID) {
    const client = new MongoClient(mongoDBURI);
    try {
        const database = client.db("spotlist");
        const playListActivities = database.collection("PLAYLISTACTIVITY");
        const playListActivityQuery = {
            username: passedUserName,
            playListID: passedPlayListID,
        };
        const returnedPlayListActivity = await playListActivities.findOne(
            playListActivityQuery
        );
        await playListActivities.updateOne(user, newData);
    } catch {
        returnedPlayListActivity = -1;
    } finally {
        await client.close();
        return returnedPlayListActivity;
    }
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
        newLikes = playListActivityInfo.likes + 1;
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
        newComments = playListActivityInfo.comments.append(newComment);
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
