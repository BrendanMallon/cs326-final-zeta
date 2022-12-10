import { query } from 'express';
import {checkToken, getPlaylist, followPlaylist} from './spotify.js';

let playlist = [];
const devid = '';
let indx = 0;
let stopPlay = false;

document.getElementById("searchTextBtn").addEventListener("click", () => {
    query = document.getElementById("homePageSearch-Text").value;
    playlist = getPlaylist(query, 0);
    loadTracks();
});

window.onSpotifyWebPlaybackSDKReady = () => {
    checkToken();
    const token = JSON.parse(window.localStorage('token')).access_token;
    const player = new Spotify.Player({
        name: 'spotlist',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    player.connect().then(success => {
        if (success) {
            console.log('The Web Playback SDK successfully connected to Spotify!');
        }
    })

    player.addListener('ready', ({ device_id }) => {
        console.log('The Web Playback SDK is ready to play music!');
        devid = device_id;
        console.log('Device ID', device_id);
    })
}

function loadTracks() {
    stopLoop = true;
    checkToken();
    const token = JSON.parse(window.localStorage.getItem(token)).access_token;

    if (indx === playlist.length) {
        window.alert("please search for new playlists");
        return;
    }

    const currPlaylist = playlist[indx].tracks.items;
    ++indx;

    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${devid}`, {
        method: 'PUT',
        data: {context_uri : `spotify:playlist:${currPlaylist.uri}`},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    });

    stopPlay = false;
    playLoop();
}

async function playLoop() {
    while (!stopPlay) {
        player.seek(30 * 1000).then(() => {
            console.log("seeked 30 sec");
        });

        player.nextTrack().then(() => {
            console.log("next Track");
        });

        await sleep(30 * 1000);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

function likePlaylist(){
    stopLoop = true;
    followPlaylist(playlist.id);
    //add to mongo
    loadTracks();
}
