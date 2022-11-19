import { MongoClient } from "mongodb";

//TO USE---
//   place "import {mdbGetUserAndEmail, mdbGetUserInfo, mdbAddUser} from './mongoDB.js'"
//    at beginning of file
//   simply call mdbGetUserInfo(username) where username is the users username.
//   returns an object with properties {username:,email:,password:,uathToken:}

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "<connection string uri"
const client = new MongoClient(uri)

//mdbAddUser adds a user document{username:,email:,password:,spotifyToken:} to the usersInfo collection
export async function mdbAddUser(newUserName, newEmail, newPWord, newName){
    try{   
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS")  
        const newUser = { username: newUserName, email: newEmail, password: newPWord, name: newName, friendsList:[], authToken: null, refreshToken: null }
        await usersInfo.insertOne(newUser)
    }finally{
        await client.close()
    }

}
// function for checking if username and email are valid
export async function mdbGetUserEmail(passedUserName, passedEmail) {
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS")     
        // Query for a user that has the username provided in passedUserName
        const userNameQuery = { username: passedUserName };
        const emailQuery = { email: passedEmail}
        const returnedUser = await usersInfo.findOne(userNameQuery);
        const returnedEmail = await usersInfo.findOne(emailQuery)
    
    }catch{
        returnedEmail = -1
        returnedUser = -1
    } finally {
      await client.close();
      return returnedUser, returnedEmail
    }
    
}
//mdbGetUSer searches for an existing user in the database using username parameter
//returns user object
export async function mdbGetUserInfo(passedUserName) {
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS")     
        // Query for a user that has the username provided in passedUserName
        const userNameQuery = { username: passedUserName };
        const returnedUser = await usersInfo.findOne(userNameQuery);
    
    }catch{
        returnedUser = -1
    } finally {
      await client.close();
      return returnedUser
    }
}



// sets authorization token
export async function mdbSetAuthToken(passedUserName, authT){
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS")     
        // Query for a user that has the username provided in passedUserName
        const user = { username: passedUserName };
        const newData = {
                $set: { 
                    authToken: authT
                },
        }
        await usersInfo.updateOne(user,newData);
    
    } finally {
      await client.close();
    }
}
export async function mdbSetRefreshToken(passedUserName, refT){
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS")     
        // Query for a user that has the username provided in passedUserName
        const user = { username: passedUserName };
        const newData = {
                $set: { 
                    refreshToken: refT
                },
        }
        await usersInfo.updateOne(user,newData);
    
    } finally {
      await client.close();
    }
}
export async function mdbAddFriend(passedUserName, newFriend){
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS")     
        // Query for a user that has the username provided in passedUserName
        const user = { username: passedUserName };
        
        let userInfo = mdbGetUserInfo(passedUserName)
        newFriendsList = userInfo.friendsList.append(newFriend)
        const newData = {
                $set: { 
                    friendsList: newFriendsList
                },
        }
        await usersInfo.updateOne(user,newData);
    
    } finally {
      await client.close();
    }
}
export async function mdbGetFriendStatus(friendID){
    try {
        const database = client.db("spotlist");
        const usersInfo = database.collection("USERS")     
        // Query for a user that has the username provided in passedUserName
        const userNameQuery = { username: passedUserName };
        const returnedUser = await usersInfo.findOne(userNameQuery);
    
    }catch{
        returnedUser = -1
    } finally {
      await client.close();
      return returnedUser
    }
}


