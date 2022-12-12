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
