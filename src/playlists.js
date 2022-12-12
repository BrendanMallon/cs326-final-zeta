console.log(window.location.origin);

const fooElem = document.getElementById("foo");
console.log(fooElem);
async function testAPI(event) {
    console.log("TESTING API");
    // const id = document.getElementById("input-field").value;
    // const result = await fetch(window.location.origin + "/api/addFriend", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         friend: id,
    //     }),
    // });

    // const response = await fetch(window.location.origin + "/api/AD");
    // const result = await response.json();
    // console.log(result.date);
    // console.log(result.token);
    console.log(result);
}
fooElem.addEventListener("click", testAPI);

const playListResponse = await fetch(window.location.origin + "/api/playlists");
const playListJSON = await playListResponse.json();

const playlistListElem = document.getElementById("playlist-list");
console.log(playListJSON);
playListJSON.forEach((playlist) => {
    const playListItem = document.createElement("div");
    playListItem.classList.add("row");
    playListItem.classList.add("playlist-list-item");
    const playListArtItem = document.createElement("div");
    playListArtItem.classList.add("col-sm-3");
    playListArtItem.id = "playlist-item-art";
    playListItem.append(playListArtItem);
    const playListImage = document.createElement("img");
    playListImage.src = playlist.image;
    playListImage.height = "100";
    playListImage.width = "100";
    playListArtItem.append(playListImage);
    const playlistInfo = document.createElement("div");
    playlistInfo.classList.add("col-sm-9");
    playlistInfo.classList.add("align-self-center");
    const playlistTitleElem = document.createElement("h6");
    playlistTitleElem.id = "playlist-item-title";
    playlistTitleElem.innerText = playlist.name;
    playlistInfo.append(playlistTitleElem);
    playListItem.append(playlistInfo);
    playlistListElem.append(playListItem);
});

/**
 * <div class="row playlist-list-item">
                        <div id="playlist-item-art" class="col-sm-3">
                            <img
                                src="https://cdn.pixabay.com/photo/2021/06/06/21/20/album-cover-6316344_1280.jpg"
                                width="100%"
                                height="100%"
                            />
                        </div>
                        <div class="col-sm-9 align-self-center">
                            <h6 id="playlist-item-title">
                                Example Playlist Title
                            </h6>
                        </div>
                    </div>
 */
