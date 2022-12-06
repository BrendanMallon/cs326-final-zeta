import {getPlaylist, followPlaylist} from './spotify.js';

let playlist = [];
let currPlaylist = {};
let index = 0;
let query = "";

document.getElementById("submit").addEventListener("click", () => {
    query = document.getElementById("submit").value;

    playlist = getPlaylist(query, 0);
    currPlaylist = playlist[index];
    ++index;
});

function likePlaylist(){
    followPlaylist(currPlaylist.id);
    //add to mongo
    if (index === 20) {
        playlist = getPlaylist(query, index);
        index = 0;
    } else {
        currPlaylist = playlist[++index];
    }
}

function dislikePlaylist(){
    if (index === 20) {
        playlist = getPlaylist(query, index);
        index = 0;
    } else {
        currPlaylist = playlist[++index];
    }
}