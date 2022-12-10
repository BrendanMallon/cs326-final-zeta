function makeApiCall(event) {
    // Prevent the form from being submitted
    event.preventDefault();
    console.log("test");
    // Get the value of the input field
    var input = document.getElementById("input-field").value;

    // Use Axios to make the API call
    fetch(window.location.origin + "/api/findUser", {
        method: "GET",
        params: {
            username: input,
        },
    })
        .then(function (response) {
            // Handle the response here
            console.log(response);
        })
        .catch(function (error) {
            // Handle the error here
        });
    return false;
}
document.getElementById("foo").addEventListener("click", makeApiCall);
console.log("TEST");
// import {getPlaylist, followPlaylist} from './spotify.js';

// let playlist = [];
// let currPlaylist = {};
// let index = 0;
// let query = "";

// document.getElementById("submit").addEventListener("click", () => {
//     query = document.getElementById("submit").value;

//     playlist = getPlaylist(query, 0);
//     currPlaylist = playlist[index];
//     ++index;
// });

// function likePlaylist(){
//     followPlaylist(currPlaylist.id);
//     //add to mongo
//     if (index === 20) {
//         playlist = getPlaylist(query, index);
//         index = 0;
//     } else {
//         currPlaylist = playlist[++index];
//     }
// }

// function dislikePlaylist(){
//     if (index === 20) {
//         playlist = getPlaylist(query, index);
//         index = 0;
//     } else {
//         currPlaylist = playlist[++index];
//     }
// }
