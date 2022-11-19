import queryString from 'node:querystring';
import axios from 'axios';

require('dotenv').config();

let secret, CLIENT_ID, CLIENT_SECRET;

if(!process.env.CLIENT_ID) {
    secret = require('secret.JSON');
    CLIENT_ID = secret.CLIENT_ID;
    CLIENT_SECRET = secret.CLIENT_SECRET;
} else {
    CLIENT_ID = process.env.CLIENT_ID;
    CLIENT_SECRET = process.env.CLIENT_SECRET;
}

export function refreshToken () {
    const token = JSON.parse(window.localStorage('token'));

    axios({
        method : 'post',
        url : 'https://accounts.spotify.com/api/token',
        data : queryString.stringify({
            grant_type : 'refresh_token',
            refresh_token : token.refresh_token
        }),
        header : {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        }
    })
        .then(reponse => {
            if(reponse.ok) {
                window.localStorage('token', JSON.stringify())
                //send new token to DB
            }
        })
        .catch (error => {
            //authorize again
        });
}

const refresh = () => {
    try {
        refreshToken();
    } catch(error) {
        console.log(error);
    }
}

export function getPlaylist (query, offSet) {
    const token = JSON.parse(window.localStorage('token'));

    axios({
        method : 'get',
        url : 'https://api.spotify.com/v1/search',
        data : queryString.stringify({
            q : query,
            type : 'playlist',
            offset : offSet,
        }),
        header : {
            'content-type' : 'application/json',
            Authorization : 'Bearer ' + token
        }
    })
        .then (response => {
            if (!response.ok) {
                refresh();
                return getPlaylist(query, offSet);
            }
            return response.body.playlists.items;
        }) 
        .catch(error => {
            console.log(error);
        });

    return [];
}


export function followPlaylist (playlistID) {
    if (!checkFollow(playlistID)) {
        const token = JSON.parse(window.localStorage('token'));
    
        axios({
            method : 'put',
            url : `https://api.spotify.com/v1/plylist/${playlistID}/followers`,
            header : {
                'content-type' : 'application/json',
                Authorization : 'Bearer ' + token
            }
        })
            .then(reponse => {
                if(!reponse.ok) {
                    refresh();
                    followPlaylist(playlistID);
                }
            })
            .catch(error => {
                console.log(error);
            });
    } 
}

function checkFollow (playlistID) {
    const token = JSON.parse(window.localStorage('token'));
    
    axios({
        method : 'get',
        url : `https://api.spotify.com/v1/plylist/${playlistID}/followers/contains`,
        header : {
            'content-type' : 'application/json',
            Authorization : 'Bearer ' + token
        }
    })
        .then(reponse => {
            if(!reponse.ok) {
                refresh();
                checkFollow(playlistID);
            }
        })
        .catch(error => {
            console.log(error);
        });
} 

export function getUserPlaylist () {
    const token = window.localStorage('token');

    axios({
        method : 'get',
        url : `https://api.spotify.com/v1/users/${getUserID()}/playlists`,
        header : {
            'content-type' : 'application/json',
            Authorization : 'Bearer ' + token
        }
    })
        .then(response => {
            if(!response.ok) {
                refresh();
                return getUserPlaylist();
            }
            return response.body.items;
        })
        .catch(error => {
            console.log(error);
        });

        return [];
}

export function getSubStatus () {
    try{
        const profile = getUserProfile();
    } catch(error) {
        console.log(error);
    }

    return profile.product === "premium" ? true : false;
}

function getUserProfile () {
    const token = JSON.parse(window.localStorage('token'));
    
    axios({
        method : 'get',
        url : 'https://api.spotify.com/v1/me',
        header : {
            'content-type' : 'application/json',
            Authorization : 'Bearer ' + token
        }
    }) 
        .then (reponse => {
            if (reponse.ok) {
                return reponse.body;
            } else {
                refresh();
                return getUserProfile();
            }
        })
        .catch (error => {
            console.log(error);
        })

    return {};
}

export function getUserID () {
    try{
        const profile = getUserProfile();
    } catch(error) {
        console.log(error);
    }
    
    return profile.id;
}