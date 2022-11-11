const playlistListElem = document.getElementById("playlist-list");

const playListResponse = await fetch(
    "https://team-zeta.herokuapp.com/api/playlists"
);
const playListJSON = await playListResponse.json();
console.log(playListJSON);
