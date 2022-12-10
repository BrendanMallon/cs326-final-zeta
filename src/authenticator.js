//figure out what buffer does\\

import express, { response } from "express";
import queryString from "node:querystring";
import axios from "axios";

const CLIENT_ID, CLIENT_SECRET, URI;

const app = express();

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
                res.send();
            } else {
                res.status(response.staus).send("Token Error");
            }
        })
        .catch((error) => {
            res.status(400).send(error);
        });
});

app.get("/refresh/:refresh", function (req,res) {

    axios({
            method : 'post',
            url : 'https://accounts.spotify.com/api/token',
            data : queryString.stringify({
                grant_type : 'refresh_token',
                refresh_token : req.params.refresh
            }),
            header : {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
            }
        }).then(response => {
            if (response.ok) {
                const json = {date: Date.now(), token: response.body};

                axios({
                    method : "post",
                    url : "",
                    data : json
                }).then(response => {
                    if(!response.ok) {console.log(repsonse)}
                }).catch(erro => {console.log(error)});

                res.send(JSON.stringify(json));
            } else {
                console.log(response.body.error);
            }
        }).catch(error => {
            console.log(error);
        });
});
