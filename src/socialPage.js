console.log(window.location.origin);
const playListResponse = await fetch(window.location.origin + "/api/playlists");
const playListJSON = await playListResponse.json();

const playlistListElem = document.getElementById("activity-list");
console.log(playListJSON);
playListJSON.forEach((playlist) => {
    // ITEM ELEM
    const playListItem = document.createElement("div");
    playListItem.classList.add("row");
    playListItem.classList.add("activity-list-item");
    // ART CONTAINER
    const playListArtItem = document.createElement("div");
    playListArtItem.classList.add("col-sm-3");
    playListArtItem.id = "activity-item-art";
    playListItem.append(playListArtItem);
    // IMAGE
    const playListImage = document.createElement("img");
    playListImage.src = playlist.image;
    playListImage.height = "90";
    playListImage.width = "90";
    playListArtItem.append(playListImage);
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
    desc.innerText = playlist.description;
    descRow.append(desc);
    playlistListElem.append(playListItem);
});

/**
 *
<div class="row activity-list-item">
    <div id="activity-item-art" class="col-sm-3">
        <img
            src="https://cdn.pixabay.com/photo/2021/06/06/21/20/album-cover-6316344_1280.jpg"
            width="100%"
            height="100%"
        />
    </div>
    <div class="col-sm-9">
        <div class="row">
            <div class="col-sm-10">
                <h6 id="activity-item-title">
                    Example Playlist Title
                </h6>
            </div>
            <div id="activity-heart-icon" class="col-sm-2">
                <img
                    src="https://freeiconshop.com/wp-content/uploads/edd/heart-outline.png"
                    width="100%"
                    height="100%"
                />
            </div>
        </div>
        <div class="row">
            <h6 id="activity-item-description">
                Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
            </h6>
        </div>
    </div>
</div>
 */
