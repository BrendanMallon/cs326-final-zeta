//**Figure out what to do if user does not authenticate**\\

const client_id = '84f9f6cbc26d428ea9b95b1ca65861ad';
const redirect_uri = 'https://spotlist.herokuapp.com/callback';

import express, { response } from 'express';
import queryString from 'node:querystring';

const app = express();

//Request User Authorization
app.get('/signup/auth', function(req, res) {

    //find out if this is a built in fuction
    const state = generateRandomString(16);
    const scope = 'user-modify-playback-state playlist-modify-public streaming';

    res.redirect('https://accounts.spotify.com/authorize?' + 
        queryString.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        })
    );
});

//Request Access Token
app.get('/callback', function(req, res) {
    const code = req.query.code;
    const state = req.query.state;

    if ()
});