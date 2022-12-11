import { query } from 'express';
import {checkToken, getPlaylist, followPlaylist} from './spotify.js';

let playlist = [];
let indx = 0;
let stopPlay = false;
let play = true;
let ready = false;

window.addEventListener('load', async () => {
    const token = await fetch('https://spotlist.herokuapp.com/api/getToken');
    if(token.ok) {
        token = await token.json();
        window.localStorage.setItem('token', token.token);
        window.localStorage.setItem('time', token.date);
    }
})

window.onSpotifyWebPlaybackSDKReady = () => {
    checkToken();
    const token = JSON.parse(window.localStorage.getItem('token')).access_token;

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

    let devid = '';

    player.addListener('ready', ({ device_id }) => {
        console.log('The Web Playback SDK is ready to play music!');
        devid = device_id;
        console.log('Device ID', device_id);
    })

    async function playLoop() {
        while (!stopPlay) {
            player.nextTrack().then(() => {
                console.log("next Track");
            });
    
            player.seek(30 * 1000).then(() => {
                console.log("seeked 30 sec");
            });
    
            await sleep(30 * 1000);
        }
    }

    async function loadTracks() {
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
        
        updateTrackinfo();
        ready = true;

        player.seek(30 * 1000).then(() => {
            console.log("seeked 30 sec");
        });
    
        stopPlay = false;
    
        await sleep(30 * 1000);
    
        playLoop();
    }

    document.getElementById("searchTextBtn").addEventListener("click", () => {
        query = document.getElementById("homePageSearch-Text").value;
        playlist = getPlaylist(query, 0);
        loadTracks();
    });
    
    document.getElementById("pause").addEventListener("click", () => {
        if (!ready) {return;}
        
        checkToken();
        const token = JSON.parse(window.localStorage.getItem('token')).access_token;
        
        if(play === false) {
            fetch("https://api.spotify.com/v1/me/player/play", {
                method : "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            play = true;
            stopPlay = false;
            player.getCurrentState().then(async state => {
                await sleep(60000 - state.position);
            });
            playLoop();
        } else {
            fetch("https://api.spotify.com/v1/me/player/pause", {
                method : "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            stopPlay = false;
            play = false;
        }
    });

    document.getElementById("like").addEventListener("click", () => {
        if (!ready) {return;}

        stopLoop = true;
        followPlaylist(playlist[indx - 1].id);
        
        fetch('https://spotlist.herokuapp.com/api/addUserActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playListID: playlist[indx - 1].id,
            })
        });

        loadTracks();
    });

    document.getElementById("dislike").addEventListener("click", () => {
        if (!ready) {return;}
        loadTracks();
    });

    function updateTrackinfo() {
        player.getCurrentState().then(state => {
            const track = state.track_window.current_track;
            document.getElementById("cover").src = track.images[0].url;
            document.getElementById("songInfo").innerHTML = 
                `<h1>${track.name}</h1>
                 <h2>${track.artists[0].name}</h2`;
        });   
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById("like").addEventListener("click", () => {
    stopLoop = true;
    followPlaylist(playlist.id);
    
    fetch("https://spotlist.herokuapp.com/api/addUserActivity", {
        method : "POST",
        body : currPlaylist.id  
    });

    loadTracks();
});

function replaceCover(img){
    document.getElementById("cover").src = img;

}
function replaceSongInfo(song, artist){
    document.getElementById("artistName").innerText = artist
    document.getElementById("songName").innerText = song
}

document.getElementById("dislike").addEventListener("click", () => {loadTracks();});
