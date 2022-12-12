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
    // });37i9dQZF1DX0XUsuxWHRQd
    const response = await fetch(
        window.location.origin + "/api/getUserActivity"
    );
    const result = await response.json();
    // console.log(result.date);
    // console.log(result.token);
    console.log(result);
}
// fooElem.addEventListener("click", testAPI);

const playListResponse = await fetch(
    window.location.origin + "/api/getUserActivity"
);
const playListJSON = await playListResponse.json();

const playlistListElem = document.getElementById("playlist-list");
console.log(playListJSON);
playListJSON.forEach((playlist) => {
    // ITEM ELEM
    const playListItem = document.createElement("div");
    playListItem.classList.add("row");

    playListItem.classList.add("mx-auto");
    playListItem.classList.add("activity-list-item");
    // ART CONTAINER
    const playListArtItem = document.createElement("div");
    playListArtItem.classList.add("col-sm-3");
    playListArtItem.id = "activity-item-art";
    playListItem.append(playListArtItem);
    // IMAGE
    const playListImage = document.createElement("img");
    playListImage.src = playlist.images[0].url;
    playListImage.height = "90";
    playListImage.width = "90";
    playListArtItem.append(playListImage);
    // DATE
    const date = document.createElement("div");
    date.innerText = new Date(playlist.time).toLocaleDateString();
    date.classList.add("row");
    date.classList.add("text-sm");
    date.classList.add("date");
    date.classList.add("ml-1");
    playListArtItem.append(date);
    // INFO CONTAINER
    const playlistInfo = document.createElement("div");
    playlistInfo.classList.add("col-sm-9");
    playListItem.append(playlistInfo);
    // TITLE ROW
    const titleRow = document.createElement("div");
    titleRow.classList.add("row");
    playlistInfo.append(titleRow);
    // TITLE COL
    const titleCol = document.createElement("div");
    titleCol.classList.add("col-sm-10");
    titleRow.append(titleCol);
    // TITLE
    const title = document.createElement("h6");
    title.id = "activity-item-title";
    title.innerText = playlist.name;
    titleCol.append(title);
    // DESCRIPTION ROW
    const descRow = document.createElement("div");
    descRow.classList.add("row");
    playlistInfo.append(descRow);
    // DESCRIPTION
    const desc = document.createElement("h6");
    desc.id = "activity-item-description";
    desc.innerHTML = playlist.description;
    descRow.append(desc);
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
