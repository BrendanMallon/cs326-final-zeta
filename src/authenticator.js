//figure out what buffer does\\

import express, { response } from "express";
import queryString from "node:querystring";
import axios from "axios";

require("dotenv").config();

const app = express();

let secret, CLIENT_ID, CLIENT_SECRET, URI;

if (!process.env.CLIENT_ID) {
    secret = require("secret.JSON");
    CLIENT_ID = secret.CLIENT_ID;
    CLIENT_SECRET = secret.CLIENT_SECRET;
    URI = secret.URI;
} else {
    CLIENT_ID = process.env.CLIENT_ID;
    CLIENT_SECRET = process.env.CLIENT_SECRET;
    URI = process.env.URI;
}

//Request User Authorization
app.get("/auth", function (req, res) {
    const scope =
        "user-modify-playback-state playlist-modify-public streaming  user-read-private";

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            queryString.stringify({
                response_type: "code",
                client_id: CLIENT_ID,
                scope: scope,
                redirect_uri: URI,
            })
    );
});

//Request Access Token
app.get("/auth/callback", function (req, res) {
    const code = req.query.code || null;

    if (code === null) {
        res.status(400).send(req.query.error);
    }

    axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        data: queryString.stringify({
            grant_type: "authorization_code",
            code: code,
        }),
        header: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${new Buffer.from(
                `${CLIENT_ID}:${CLIENT_SECRET}`
            ).toString("base64")}`,
        },
    })
        .then((response) => {
            if (response.status === 200) {
                //send to db
                window.localStorage("token", JSON.stringify(response.data));
                res.send();
            } else {
                res.status(response.staus).send("Token Error");
            }
        })
        .catch((error) => {
            res.status(400).send(error);
        });
});
