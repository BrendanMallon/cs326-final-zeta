import { MongoClient } from "mongodb";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

//TO USE---
//   place "import {mdbGetUserAndEmail, mdbGetUserInfo, mdbAddUser} from './mongoDB.js'"
//    at beginning of file
//   simply call mdbGetUserInfo(username) where username is the users username.
//   returns an object with properties {username:,email:,password:,uathToken:}

// Replace the uri string with your MongoDB deployment's connection string.
let secrets, mongoDBURI;

if (!process.env.mongoDBURI) {
    secrets = require("../secrets.json");
    mongoDBURI = secrets.mongoDBURI;
} else {
    mongoDBURI = process.env.mongoDBURI;
}

//mdbAddUser adds a user document{username:,email:,password:,spotifyToken:} to the usersInfo collection
export async function mdbAddUser(username, email, salt_hash, name) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("spotlist");
    const collection = db.collection("USERS");
    const userNameQuery = { username: username };
    const returnedUser = await collection.findOne(userNameQuery);
    if (returnedUser !== null) {
        return false;
    }
    const newUser = {
        username,
        email,
        salt_hash,
        name,
        friendsList: [],
        authToken: null,
        tokenTime: null,
    };
    await collection.insertOne(newUser);
    await client.close();
    console.log(returnedUser);
    return true;
}
// function for checking if username and email are valid
export async function mdbGetUserEmail(passedEmail) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    let returnedEmail;
    const database = await client.db("spotlist");
    const usersInfo = await database.collection("USERS");
    // Query for a user that has the username provided in passedUserName
    const userNameQuery = { email: passedEmail };
    returnedEmail = await usersInfo.findOne(userNameQuery).email;
    returnedEmail = -1;
    await client.close();
    return returnedEmail;
}
export async function mdbCheckUserName(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("spotlist");
    const collection = db.collection("USERS");
    const userNameQuery = { username: passedUserName };
    const returnedUser = await collection.findOne(userNameQuery);
    await client.close();
    console.log(returnedUser);
    return returnedUser !== null;
}
export async function mdbGetUserSaltHash(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("spotlist");
    const collection = db.collection("USERS");
    const userNameQuery = { username: passedUserName };
    const returnedUser = await collection.findOne(userNameQuery);
    await client.close();
    return returnedUser ? returnedUser.salt_hash : false;
}
export async function mdbGetUserName(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    console.log("TEST PRE CONNECT");
    await client.connect();
    console.log("TEST");
    let returnedUser = 0;
    const database = await client.db("spotlist");
    const usersInfo = await database.collection("USERS");
    // Query for a user that has the username provided in passedUserName
    const userNameQuery = { username: passedUserName };
    returnedUser = await usersInfo.findOne(userNameQuery).username;
    returnedUser = -1;
    await client.close();
    return returnedUser;
}
//mdbGetUSer searches for an existing user in the database using username parameter
//returns user object
export async function mdbGetUserInfo(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    let returnedUser = 0;

    const database = await client.db("spotlist");
    const usersInfo = await database.collection("USERS");
    // Query for a user that has the username provided in passedUserName
    const userNameQuery = { username: passedUserName };
    returnedUser = await usersInfo.findOne(userNameQuery);

    returnedUser = -1;

    await client.close();

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
    await client.connect();

    const database = await client.db("spotlist");
    const usersInfo = await database.collection("USERS");
    const user = { username: passedUserName, password: passedPassword };
    const newData = {
        $set: {
            name: newName,
        },
    };
    await usersInfo.updateOne(user, newData);

    await client.close();

}
export async function mdbSetEmail(passedUserName, passedPassword, newEmail) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();

    const database = await client.db("spotlist");
    const usersInfo = await database.collection("USERS");
    const user = { username: passedUserName, password: passedPassword };
    const newData = {
        $set: {
            email: newEmail,
        },
    };
    await usersInfo.updateOne(user, newData);

    await client.close();
    
}
export async function mdbSetPassword(
    passedUserName,
    passedPassword,
    newPassword
) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    const database = await client.db("spotlist");
    const usersInfo = await database.collection("USERS");
    const user = { username: passedUserName, password: passedPassword };
    const newData = {
        $set: {
            password: newPassword,
        },
    };
    await usersInfo.updateOne(user, newData);

    await client.close();

}

// sets authorization token
export async function mdbSetToken(username, token, time) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    const database = client.db("spotlist");
    const usersInfo = database.collection("USERS");
    const user = { username };
    const newData = {
        $set: {
            authToken: token,
            tokenTime: time,
        },
    };
    await usersInfo.updateOne(user, newData);
    await client.close();
}
export async function mdbGetToken(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    const database = client.db("spotlist");
    const usersInfo = database.collection("USERS");
    const userNameQuery = { username: passedUserName };
    const user = await usersInfo.findOne(userNameQuery);
    await client.close();
    return { token: user.authToken, date: user.tokenTime };
}
export async function mdbAddFriend(passedUserName, newFriend) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();

    const database = await client.db("spotlist");
    const usersInfo = await database.collection("USERS");
    const user = { username: passedUserName };

    const userInfo = mdbGetUserInfo(passedUserName);
    const newFriendsList = userInfo.friendsList.append(newFriend);
    const newData = {
        $set: {
            friendsList: newFriendsList,
        },
    };
    await usersInfo.updateOne(user, newData);
    await client.close();

}

export async function mdbAddPlaylistActivity(addUserName, addPlayListID) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("spotlist");
    const collection = db.collection("PLAYLISTACTIVITY");
    const newPlayListActivity = {
        time: Date.now(),
        username: addUserName,
        playListID: addPlayListID,
        likes: 0,
        comments: [],
    };
    await collection.insertOne(newPlayListActivity);
    await client.close();
    return true;
}

export async function mdbGetPlaylistActivity(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("spotlist");
    const collection = db.collection("PLAYLISTACTIVITY");
    const playListActivityQuery = {
        username: passedUserName,
    };
    const returnedPlayListActivity = await collection
        .find(playListActivityQuery)
        .toArray();
    console.log("testing");
    await client.close();
    console.log(returnedPlayListActivity);
    return returnedPlayListActivity;
}
//Adds a like to the like property
export async function mdbSetPlaylistActivityLikes(
    passedUserName,
    passedPlayListID
) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();

    const database = await client.db("spotlist");
    const playListActivites = await database.collection("PLAYLISTACTIVITY");
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

    await client.close();

}
export async function mdbSetPlaylistActivityComments(
    passedUserName,
    passedPlayListID,
    newComment
) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();

    const database = await client.db("spotlist");
    const playListActivites = await database.collection("PLAYLISTACTIVITY");
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

    await client.close();

}
