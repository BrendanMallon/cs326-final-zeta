import {checkToken, getPlaylist, followPlaylist} from './spotify.js';

let playlist = [];
const devid = '';
let indx = 0;

// let playlist = [];
// let currPlaylist = {};
// let index = 0;
// let query = "";

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
}

function likePlaylist(){
    followPlaylist(playlist.id);
    //add to mongo
    loadTracks();
}
