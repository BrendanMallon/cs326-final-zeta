window.onSpotifyWebPlaybackSDKReady = async () => {
    let token = await fetch(`${window.location.origin}/spotify/token`);
    const res = await token.json();
    token = res.tk;

    let devid = '';
    let playlists = '';
    let index = 0;
    let stopPlay = null;
    
    const player = new Spotify.Player({
        name: 'Spotlist',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    player.addListener('ready', ({ device_id }) => {
        devid = device_id;
        console.log('Ready with Device ID', device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    document.getElementById('searchTextBtn').onclick = async function () {
        playlists = await fetch (`${window.location.origin}/spotify/playlist/${document.getElementById('homePageSearch-Text').value}`).catch((error) => {
            console.log(error);
            alert("error with token authentication");
            return;
        });

        const res = await playlists.json();
        playlists = res.playlist;

        index = 0;

        loadNext();
    };

    function trackPlay() {
        stopPlay = setInterval(async () => {
            player.nextTrack();
            setTimeout(() => {
                player.getCurrentState().then(data => {
                    document.getElementById('title').innerHTML = playlists[index - 1].name;
                    document.getElementById('cover').src = data.track_window.current_track.album.images[0].url;
                    document.getElementById('song').innerHTML = data.track_window.current_track.name;
                    document.getElementById('artist').innerHTML = data.track_window.current_track.artists[0].name;
                });
            }, 500);
        }, 60000);
    }

    async function loadNext() {
        clearInterval(stopPlay);
        let error = false;
        
        fetch(`https://api.spotify.com/v1/me/player/play?decive_id=${devid}`, {
            method : 'PUT',
            body : JSON.stringify({context_uri : playlists[index].uri}),
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(async data => {
            const res = await data.json();
            if (res.error.status) {
                if (res.error.status === 401) {
                    token = await fetch(`${window.location.origin}/spotify/token`);
                    alert("Please try again");
                    error = true;
                    return;
                }
                console.log(res.error);
                alert("please change spotify listening device to Spotlist and try again");
                error = true;
                return;

            }
        });

        if (error) {return;}

        ++index;

        setTimeout(() => {
            player.getCurrentState().then(data => {
                document.getElementById('title').innerHTML = playlists[index - 1].name;
                document.getElementById('cover').src = data.track_window.current_track.album.images[0].url;
                document.getElementById('song').innerHTML = data.track_window.current_track.name;
                document.getElementById('artist').innerHTML = data.track_window.current_track.artists[0].name;
            });
        }, 500);
        
        trackPlay();
    }
    
    document.getElementById('like').onclick = function () {
        clearInterval(stopPlay);

        fetch(window.location.origin + "/api/addUserActivity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({playListID: playlists[index - 1].id})
        });

        fetch(`${window.location.origin}/spotify/follow/${playlists[index - 1].id}`);

        loadNext();
    };

    document.getElementById('dislike').onclick = () => {
        clearInterval(stopPlay);

        loadNext();
    };

    player.connect();
};