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

console.log(window.location.origin);
const friendslistResponse = await fetch(
    window.location.origin + "/api/activity/friends"
);
const friendslistJSON = await friendslistResponse.json();

const friendsListElem = document.getElementById("friends-list");
console.log(friendslistJSON);

friendslistJSON.forEach((friend) => {
    // Friend Container
    const container = document.createElement("div");
    container.classList.add("row");
    container.classList.add("friends-list-item");
    friendsListElem.append(container);
    // Name Col
    const nameCol = document.createElement("div");
    nameCol.classList.add("col-sm-9");
    container.append(nameCol);
    // FName Row
    const fnameRow = document.createElement("div");
    fnameRow.classList.add("row");
    nameCol.append(fnameRow);
    // fname
    const fname = document.createElement("h6");
    fname.id = "friends-list-firstname";
    fname.innerText = friend.fname;
    fnameRow.append(fname);
    // LName Row
    const lnameRow = document.createElement("div");
    lnameRow.classList.add("row");
    nameCol.append(lnameRow);
    // fname
    const lname = document.createElement("h6");
    lname.id = "friends-list-lastname";
    lname.innerText = friend.lname;
    lnameRow.append(lname);
    // signal col
    const signalCol = document.createElement("div");
    signalCol.classList.add("col-3");
    container.append(signalCol);
    // Signal container
    const signalContainer = document.createElement("div");
    signalContainer.id = "friends-list-signal-icon";
    signalContainer.classList.add("row");
    signalContainer.classList.add("justify-content-end");
    signalCol.append(signalContainer);
    // Signal
    const signal = document.createElement("img");
    signal.src = "https://cdn-icons-png.flaticon.com/512/254/254613.png";
    signal.height = "50";
    signal.width = "50";
    signalContainer.append(signal);
});

/**
 *
<div class="row friends-list-item">
    <div class="col-sm-9">
        <div class="row">
            <h6 id="friends-list-firstname">FIRST_NAME</h6>
        </div>
        <div class="row">
            <h6 id="friends-list-lastname">LAST_NAME</h6>
        </div>
    </div>
    <div class="col-3">
        <div
            id="friends-list-signal-icon"
            class="row justify-content-end"
        >
            <img
                src="https://cdn-icons-png.flaticon.com/512/254/254613.png"
                width="50%"
                height="50%"
            />
        </div>
    </div>
</div>
 */
