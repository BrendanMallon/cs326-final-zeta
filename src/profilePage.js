import {mdbGetUserInfo, mdbSetName, mdbSetEmail, mdbSetUserName,mdbSetPassword} from './mongoDB.js'
const bcrypt = require('bcrypt');

async function changeUsername(){

    newUsername = document.getElementById("userNameInput").value
    username = document.getElementById("confirmUserName1").value
    password = document.getElementById("confirmPassword1").value
    if (newUsername == "" || username == "" || password == "") {
        window.alert("Fields cannot be empty.");
        if (newUsername == ""){
            hidePopUp('confirmUsernameChangesPopUp');
        }
        return;
    }
    userInfo = mdbGetUserInfo(username)
    if(userInfo == null){
        window.alert("incorrect username or password")
        return;
    }else if(await !(bcrypt.compare(password, userInfo.password))){
        window.alert("incorrect password")
        return
    }
    mdbSetUserName(username, password, newUsername)
    hidePopUp('confirmUsernameChangesPopUp');
    showPopUp('changeSuccessPopUp');
}
async function changeName(){
    
    newName = document.getElementById("nameInput").value
    username = document.getElementById("confirmUserName2").value
    password = document.getElementById("confirmPassword2").value
    if (newName == "" || username == "" || password == "") {
        window.alert("Fields cannot be empty.");
        if (newName == ""){
            hidePopUp('confirmNameChangesPopUp');
        }
        return;
    }
    userInfo = mdbGetUserInfo(username)
    if(userInfo == null){
        window.alert("incorrect username or password")
        return;
    }else if(await !(bcrypt.compare(password, userInfo.password))){
        window.alert("incorrect password")
        return
    }

    mdbSetName(username, password, newName)
    hidePopUp('confirmNameChangesPopUp');
    showPopUp('changeSuccessPopUp');
}
async function changeEmail(){

    newEmail = document.getElementById("emailAdressInput").value
    username = document.getElementById("confirmUserName3").value
    password = document.getElementById("confirmPassword3").value
    if (newEmail == "" || username == "" || password == "") {
        window.alert("Fields cannot be empty.");
        if(newEmail == "" ){
            hidePopUp('confirmEmailChangesPopUp');
        }
        return;
    }
    userInfo = mdbGetUserInfo(username)
    if(userInfo == null){
        window.alert("incorrect username or password")
        return;
    }else if(await !(bcrypt.compare(password, userInfo.password))){
        window.alert("incorrect password")
        return
    }
    mdbSetEmail(username, password, newEmail)
    hidePopUp('confirmEmailChangesPopUp');
    showPopUp('changeSuccessPopUp');
}
async function changePassword(){
    confirmNewPassword = document.getElementById("newPasswordConfirmInput").value
    newPassword = document.getElementById("newPasswordInput").value
    username = document.getElementById("confirmUserName4").value
    password = document.getElementById("confirmPassword4").value
    if (newPassword == "" || username == "" || password == "" || confirmNewPassword == "") {
        window.alert("Fields cannot be empty.");
        if(newPassword == "" ||confirmNewPassword == ""){
            hidePopUp('confirmPasswordChangesPopUp');
        }
        return;
    }
    if(newPassword != confirmNewPassword){
        window.alert("Passwords dont match.")
        hidePopUp('confirmPasswordChangesPopUp');
        return
    }
    if(!(validatePassword(newPassword))){
        window.alert("password must be in parameters")
        hidePopUp('confirmPasswordChangesPopUp');
        return
    }
    userInfo = mdbGetUserInfo(username)
    if(userInfo == null){
        window.alert("incorrect username or password")
        return;
    }else if(await !(bcrypt.compare(password, userInfo.password))){
        window.alert("incorrect password")
        return
    }
    mdbSetPassword(username, password, newPassword)
    hidePopUp('confirmPasswordChangesPopUp');
    showPopUp('changeSuccessPopUp');
}
function hidePopUp(popUpHide) {
    var popUp = document.getElementById(popUpHide);
    popUp.style.display = "none";
}
function showPopUp(popUpShow) {

    var popUp = document.getElementById(popUpShow);
    popUp.style.display = "block";
}
function validatePassword (password) {
    const paswd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if(inputtxt.value.match(paswd)) {
        return true;
    }
    return false;
}
