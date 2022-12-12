const addFriendButton = document.getElementById("add-friend-button");
async function addFriend() {
    const id = document.getElementById("friendId").value;
    await fetch(window.location.origin + "/api/addFriend", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            friend: id,
        }),
    });
    window.location.reload();
}
addFriendButton.addEventListener("click", addFriend);

const responseActivity = await fetch(
    window.location.origin + "/api/getFriendActivity"
);
const playListJSON = await responseActivity.json();

const playlistListElem = document.getElementById("activity-list");
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

    // USERNAME
    const username = document.createElement("div");
    username.innerText = playlist.username;
    username.classList.add("row");
    username.classList.add("ml-1");
    playListArtItem.append(username);
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
    desc.innerHTML =
        playlist.description !== "" ? playlist.description : "No description.";
    descRow.append(desc);
    playlistListElem.append(playListItem);
});

const friendsListElem = document.getElementById("friends-list");
const response = await fetch(window.location.origin + "/api/getFriendsList");
const friendslistJSON = await response.json();

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
    fname.innerText = friend;
    fnameRow.append(fname);
});
