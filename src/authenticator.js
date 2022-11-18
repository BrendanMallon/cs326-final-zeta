//**Figure out what to do if user does not authenticate**\\
//Buffer\\

const client_id = '84f9f6cbc26d428ea9b95b1ca65861ad';
const client_secret = 'dd14585ebfa7402f9901bf92272d8128';
const redirect_uri = 'https://spotlist.herokuapp.com/callback';

import express, { response } from 'express';
import { request } from 'node:http';
import queryString from 'node:querystring';

const app = express();

//Request User Authorization
app.get('/auth', function(req, res) {

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

    if (state === null) {
        //add something to the /signup that check for error
        res.redirect('/signup'+ '');
    } else {
        const authOptions = {
            url : 'https://accounts.spotify.com/api/token',
            form: {
                code : code,
                redirect_uri : 'https://spotlist.herokuapp.com/home',
                grant_type : 'authorization_code',
            },
            headers : {
                'Authorization' :'Basic ' + (new Buffer(client_id + ':' + client_secret.toString('base64')))
            },
            json : true
        };
        // request.post(authOptions, function(error, response, body) {
        //     if(!error && response.statusCode === 200) {
        //         const access_token = body.access_token;
        //         res.send({
        //             'access_token': access_token
        //         });
        //     }
        // });
    }
});

app.get('/refresh_token', function(req, res) {

    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });