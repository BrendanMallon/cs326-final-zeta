const bcrypt = require('bcrypt');
import mdbGetUserInfo from "./mongoDB.js"

async function signIn(){
    const username = document.getElementById("signInUsername"),
        password = document.getElementById("signInPassword"),
        hash = "";

    const userInfo = mdbGetUserInfo(username);
    if (userInfo !== -1)
        try {
            //password needs to be changed
            if (await bcrypt.compare(password, userInfo)) {
                //succsesful login
            } else {
                alert("Incorrect username or password");
            }
        } catch (e) {
    } else {
        alert("Incorrect username or password");
    }
}
