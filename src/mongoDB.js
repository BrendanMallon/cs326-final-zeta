import { MongoClient } from "mongodb";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

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
    };
    await collection.insertOne(newUser);
    await client.close();
    return true;
}

// function for checking if username and email are valid
export async function mdbGetUserEmail(passedEmail) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    const database = await client.db("spotlist");
    const usersInfo = await database.collection("USERS");
    // Query for a user that has the username provided in passedUserName
    const userNameQuery = { email: passedEmail };
    const returnedEmail = await usersInfo.findOne(userNameQuery).email;
    await client.close();
    return returnedEmail;
}

export async function mdbCheckUserName(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    const db = client.db("spotlist");
    const collection = db.collection("USERS");
    const userNameQuery = { username: passedUserName };
    const returnedUser = await collection.findOne(userNameQuery);
    await client.close();
    return returnedUser !== null;
}

export async function mdbGetUserSaltHash(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    const db = client.db("spotlist");
    const collection = db.collection("USERS");
    const userNameQuery = { username: passedUserName };
    const returnedUser = await collection.findOne(userNameQuery);
    await client.close();
    return returnedUser ? returnedUser.salt_hash : false;
}

export async function mdbGetUserName(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    let returnedUser = 0;
    const database = client.db("spotlist");
    const usersInfo = database.collection("USERS");
    // Query for a user that has the username provided in passedUserName
    const userNameQuery = { username: passedUserName };
    returnedUser = await usersInfo.findOne(userNameQuery).username;
    await client.close();
    return returnedUser;
}

//mdbGetUSer searches for an existing user in the database using username parameter
//returns user object
export async function mdbGetUserInfo(passedUserName) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    let returnedUser = 0;

    const database = client.db("spotlist");
    const usersInfo = database.collection("USERS");
    // Query for a user that has the username provided in passedUserName
    const userNameQuery = { username: passedUserName };
    returnedUser = await usersInfo.findOne(userNameQuery);

    await client.close();

    return returnedUser;
}

export async function mdbSetName(passedUserName, newName) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();

    const database = client.db("spotlist");
    const usersInfo = database.collection("USERS");
    const user = { username: passedUserName };
    const newData = {
        $set: {
            name: newName,
        },
    };
    await usersInfo.updateOne(user, newData);
    await client.close();
}
export async function mdbSetEmail(passedUserName, newEmail) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();

    const database = await client.db("spotlist");
    const usersInfo = await database.collection("USERS");
    const user = { username: passedUserName };
    const newData = {
        $set: {
            email: newEmail,
        },
    };
    await usersInfo.updateOne(user, newData);

    await client.close();
}
export async function mdbSetPassword(passedUserName, newPassword) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    const database = await client.db("spotlist");
    const usersInfo = await database.collection("USERS");
    const user = { username: passedUserName };
    const newData = {
        $set: {
            password: newPassword,
        },
    };
    await usersInfo.updateOne(user, newData);

    await client.close();
}
export async function mdbAddFriend(passedUserName, newFriend) {
    if (passedUserName === newFriend) {
        return false;
    }
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    const database = client.db("spotlist");
    const usersInfo = database.collection("USERS");
    const user = { username: passedUserName };
    const friend = { username: newFriend };
    const friendInfo = await usersInfo.findOne(friend);
    if (!friendInfo) {
        return false;
    }
    const userInfo = await usersInfo.findOne(user);
    const newFriendsList = userInfo.friendsList;
    if (newFriendsList.includes(newFriend)) {
        return false;
    }
    newFriendsList.push(newFriend);
    const newData = {
        $set: {
            friendsList: newFriendsList,
        },
    };
    await usersInfo.updateOne(user, newData);
    await client.close();
    return true;
}

export async function mdbGetFriendsNames(username) {
    if (!username) {
        return false;
    }
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    const database = client.db("spotlist");
    const usersInfo = database.collection("USERS");
    const userInfo = await usersInfo.findOne({ username });
    const friendIdList = userInfo.friendsList;
    await client.close();
    return friendIdList;
}

export async function mdbAddPlaylistActivity(addUserName, addPlayListID) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
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
    const db = client.db("spotlist");
    const collection = db.collection("PLAYLISTACTIVITY");
    const playListActivityQuery = {
        username: passedUserName,
    };
    const returnedPlayListActivity = await collection
        .find(playListActivityQuery)
        .toArray();
    await client.close();
    return returnedPlayListActivity;
}

export async function mdbGetFriendActivity(username) {
    const client = new MongoClient(mongoDBURI);
    await client.connect();
    const db = client.db("spotlist");
    const playlistCollection = db.collection("PLAYLISTACTIVITY");
    const userCollection = db.collection("USERS");
    const userInfo = await userCollection.findOne({ username });
    const friendIds = userInfo.friendsList;
    const activity = await playlistCollection
        .find({
            username: { $in: friendIds },
        })
        .sort({ time: -1 })
        .toArray();
    await client.close();
    return activity;
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
