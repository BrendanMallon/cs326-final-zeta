import {mdbGetUserEmail, mdbGetUserInfo, mdbAddUser} from './mongoDB.js'
//signUp function called from signup page to create a new user
function signUp(){
    newPWord = document.getElementById("signUpPassword").value
    newEmail = document.getElementById("signUpEmail").value
    newUserName = document.getElementById("signUpUsername").value
    newConfirmPWord = document.getElementById("signUpConfirmPassword").value
    newName = document.getElementById("signupName").value
    if(!(newPWord === newConfirmPWord)){
        //ERROR PASSWORDS DONT MATCH, PRINT ERROR ON SIGNUP PAGE
        return null
    }
    existingUser, existingEmail = mdbGetUserEmail(newUserName, newEmail).catch(console.dir)
    if(returnedEmail === -1 || returnedUser === -1){
        //SERVER FAILED TO RESPOND
        return null
    }
    else if(existingUser === null && existingEmail === null){
        //user account created succesfully
        mdbAddUser(newUserName, newEmail, newPWord, newName)

    }else if(!(existingUser === null)){
        //ERROR ACCOUNT WITH THIS USERNAME ALREADY EXISTS
        return null
    }else if(!(existingEmail === null)){
        //ERROR ACCOUNT WITH THIS EMAIL ALREADY EXISTS
        return null
    }
    
}

