import queryString from 'node:querystring';
import axios from 'axios';

const refresh = async () => {
    const res = await fetch(`https://spotlist.herokuapp.com/refresh/${JSON.parse(window.localStorage.getItem('token')).refresh_token}`);
    if(res.ok) {
        const json = await res.json();
        window.localStorage.setItem('time', json.time);
        window.localStorage.setItem('token', JSON.stringify(json.token));
    }
}

export function checkToken() {
    if(Date.now() - window.localStorage.getItem('time') > 3600) {refresh();}
}

export function getPlaylist (query, offSet) {
    checkToken();

    const token = JSON.parse(window.localStorage.getItem('token')).access_token;

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
            if (response.ok) {
                return response.body.playlists.items;
            }
        }) 
        .catch(error => {
            console.log(error);
        });

    return [];
}


export function followPlaylist (playlistID) {
    if (!checkFollow(playlistID)) {
        checkToken();

        const token = JSON.parse(window.localStorage.getItem('token')).access_token;
    
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
    checkToken();
    
    const token = JSON.parse(window.localStorage.getItem('token')).access_token;
    
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
    checkToken();

    const token = JSON.parse(window.localStorage.getItem('token')).access_token;

    axios({
        method : 'get',
        url : `https://api.spotify.com/v1/users/${getUserID()}/playlists`,
        header : {
            'content-type' : 'application/json',
            Authorization : 'Bearer ' + token
        }
    }).then(response => {
            if(!response.ok) {
                refresh();
                return getUserPlaylist();
            }
            return response.body.items;
        }).catch(error => {
            console.log(error);
        });

        return [];
}

export function getSubStatus () {
    const profile = getUserProfile();

    return profile.product === "premium" ? true : false;
}

function getUserProfile () {
    checkToken();
    const token = JSON.parse(window.localStorage.getItem('token')).access_token;
    
    axios({
        method : 'get',
        url : 'https://api.spotify.com/v1/me',
        header : {
            'content-type' : 'application/json',
            Authorization : 'Bearer ' + token
        }
    }).then (reponse => {
            if (reponse.ok) {
                return reponse.body;
            } else {
                refresh();
                return getUserProfile();
            }
        }).catch (error => {
            console.log(error);
        })

    return {};
}

function getUserID () {
    const profile = getUserProfile();
    
    return profile.id;
}

export async function getPlaylistByID(id) {
    checkToken();
    const token = JSON.parse(window.localStorage.getItem('token')).access_token;

    const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
        method : 'GET',
        header : {
            'content-type' : 'application/json',
            Authorization : 'Bearer ' + token
        }
    });

    if (res.ok) {
        return await res.json();
    }
    return {};
}