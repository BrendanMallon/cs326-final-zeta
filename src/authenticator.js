const client_id = '84f9f6cbc26d428ea9b95b1ca65861ad';
const redirect_uri = 'https://spotlist.herokuapp.com/home';

import express from 'express';

const app = express();

app.get('/signup/auth', function(req, res) {
    //find out if this is a built in fuction
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';

    //Need to add query
    //res.redirect('https://accounts.spotify.com/authorize?' + );
    
})