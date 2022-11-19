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
});

app.get("/refresh_token", function (req, res) {
    var { refresh_token } = req.query;
    var authOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
            Authorization:
                "Basic " +
                new Buffer(client_id + ":" + client_secret).toString("base64"),
        },
        form: {
            grant_type: "refresh_token",
            refresh_token: refresh_token,
        },
        json: true,
    };

    req.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var { access_token } = body;
            res.send({
                access_token: access_token,
            });
        }
    });
});
