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
        return null;
    }
    else if(existingUser === null && existingEmail === null){
        //user account created succesfully
        if (validatePassword(newPWord)) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPWord, salt);
                mdbAddUser(newUserName, newEmail, hashedPassword, newName)
            } catch (e) {
                console.log(e);
            }
        }
        else {
            error += "Password must be between 7 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character\n";
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

function validatePassword (password) {
    const paswd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if(inputtxt.value.match(paswd)) {
        return true;
    }
    return false;
}

