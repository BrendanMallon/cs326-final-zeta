import {mdbGetUserEmail, mdbGetUserInfo, mdbAddUser} from './mongoDB.js'
const bcrypt = require('bcrypt');

//signUp function called from signup page to create a new user
async function signUp(){
    const newPWord = document.getElementById("signUpPassword").value,
        newEmail = document.getElementById("signUpEmail").value,
        newUserName = document.getElementById("signUpUsername").value,
        newConfirmPWord = document.getElementById("signUpConfirmPassword").value,
        newName = document.getElementById("signupName").value;

    const error = "";
    if(!(newPWord === newConfirmPWord)){
        //ERROR PASSWORDS DONT MATCH, PRINT ERROR ON SIGNUP PAGE
        error += "Passwords do not match\n";
    }
    existingUser, existingEmail = mdbGetUserEmail(newUserName, newEmail).catch(console.dir)
    if(returnedEmail === -1 || returnedUser === -1){
        //SERVER FAILED TO RESPOND
        return null
    }
    else if(existingUser === null && existingEmail === null){
        //user account created succesfully
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPWord, salt);
            mdbAddUser(newUserName, newEmail, hashedPassword, newName)
        } catch (e) {
            console.log(e);
        }
    }else if(!(existingUser === null)){
        //ERROR ACCOUNT WITH THIS USERNAME ALREADY EXISTS
        error += "User already exists. Enter new username\n";
    }else if(!(existingEmail === null)){
        //ERROR ACCOUNT WITH THIS EMAIL ALREADY EXISTS
        error += "Email already in use. Enter new email\n";
    }
    
    if (error !== "") {        
        alert(error);
    }
}

