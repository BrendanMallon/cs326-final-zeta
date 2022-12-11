
const bcrypt = require("bcrypt");
console.log("test");
import { MiniCrypt } from "./miniCrypt.js";
const mc = new MiniCrypt();

/*async function changeUsername(){

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
}*/
async function changeName() {
    const newName = document.getElementById("nameInput").value;
    const username = document.getElementById("confirmUserName2").value;
    const password = document.getElementById("confirmPassword2").value;
    if (username === "" || password === "") {
        window.alert("Fields cannot be empty.");
        return;
    }
    if (newName == "") {
        window.alert("New name is empty");
        hidePopUp("confirmNameChangesPopUp");
        return;
    }
    const response = await fetch(window.location.origin + "/api/setName",{user: username, salt_hash: password, new_name: newName}).json();   
    if (response.matchedCount === 1 && response.modifiedCount === 1) {
        showPopUp("changeSuccessPopUp");
        return;
    } else {
        window.alert("incorrect username or password");
        return;
    }

}
function changeEmail() {
    const newEmail = document.getElementById("emailAdressInput").value;
    const username = document.getElementById("confirmUserName3").value;
    const password = document.getElementById("confirmPassword3").value;
    if (newEmail === "" || username === "" || password === "") {
        window.alert("Fields cannot be empty.");
        if (newEmail == "") {
            hidePopUp("confirmEmailChangesPopUp");
        }
        return;
    }
    const userInfo = mdbGetUserInfo(username);
    if (userInfo == null) {
        window.alert("incorrect username or password");
        return;
    } else if (!bcrypt.compare(password, userInfo.password)) {
        window.alert("incorrect password");
        return;
    }
    mdbSetEmail(username, password, newEmail);
    hidePopUp("confirmEmailChangesPopUp");
    showPopUp("changeSuccessPopUp");
}
function changePassword() {
    const confirmNewPassword = document.getElementById(
        "newPasswordConfirmInput"
    ).value;
    const newPassword = document.getElementById("newPasswordInput").value;
    const username = document.getElementById("confirmUserName4").value;
    const password = document.getElementById("confirmPassword4").value;
    if (
        newPassword == "" ||
        username == "" ||
        password == "" ||
        confirmNewPassword == ""
    ) {
        window.alert("Fields cannot be empty.");
        if (newPassword == "" || confirmNewPassword == "") {
            hidePopUp("confirmPasswordChangesPopUp");
        }
        return;
    }
    if (newPassword != confirmNewPassword) {
        window.alert(
            "Password must be between 7 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."
        );
        hidePopUp("confirmPasswordChangesPopUp");
        return;
    }
    if (!validatePassword(newPassword)) {
        window.alert("password must be in parameters");
        hidePopUp("confirmPasswordChangesPopUp");
        return;
    }
    const userInfo = mdbGetUserInfo(username);
    if (userInfo == null) {
        window.alert("incorrect username or password");
        return;
    } else if (!bcrypt.compare(password, userInfo.password)) {
        window.alert("incorrect password");
        return;
    }
    mdbSetPassword(username, password, newPassword);
    hidePopUp("confirmPasswordChangesPopUp");
    showPopUp("changeSuccessPopUp");
}
function hidePopUp(popUpHide) {
    var popUp = document.getElementById(popUpHide);
    popUp.style.display = "none";
}
function showPopUp(popUpShow) {
    var popUp = document.getElementById(popUpShow);
    popUp.style.display = "block";
    return false;
}
function test(event) {
    console.log(event);
    console.log("test");
}
const firstNameChangeBtn = document.getElementById("confirm-btn-Name");
firstNameChangeBtn.addEventListener("click", test);
console.log("init");
function validatePassword(password) {
    const paswd =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (password.value.match(paswd)) {
        return true;
    }
    return false;
}

//const confirmButtonName = document.getElementById("confirm-btn-Name");
const confirmButtonEmail = document.getElementById("confirm-btn-Email");
const confirmButtonPassword = document.getElementById("confirm-btn-Password");
//confirmButtonName.addEventListener("click",changeName);
confirmButtonEmail.addEventListener("click",changeEmail);
confirmButtonPassword.addEventListener("click",changePassword);

