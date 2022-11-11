const playlistListElem = document.getElementById("playlist-list");

const playListData = await fetch(
    "https://team-zeta.herokuapp.com/api/playlists"
);

console.log(playListData);
