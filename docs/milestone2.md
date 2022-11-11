Milestone 2
APIs
'/login' : will take a usename and password and send back accoubnt info
'/register' : will take in information to create an account send back success or failure
'/playlists' : will send back the playlists the user has saved
'/activity/friends' : will send back the activity for the individuals in the friends list
'/activity/me' : will send back the activity performed by the user
'/search' : Will take a query term and return the playhlists associated with that keyterm
'/playlistCard' :
'/addPlaylist' : Will add playlist to spotify account
For milestone 2:

Attempted to set deployment server with firebase: Will + Izaias
Created/Wrote milestone2 doc: Brendan + Izaias
Created file serving with routing: Brendan
Set up deployment with heroku: Brendan
Set up server file and fake data/api responses: Brendan

Website: https://team-zeta.herokuapp.com/login

NOTE: the "/login" is required as we do not have a landing page.

APIs can be tested by entering the endpoints after https://team-zeta.herokuapp.com/api

For example: https://team-zeta.herokuapp.com/api/activity/friends

Will return fake data like this...

```[
   {"userId":"94b98c56-abd2-429f-95fd-11603e7e8310","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/371.jpg","lastOnline":"2022-01-17T00:52:10.981Z"},{"userId":"e39071c7-b806-4b4d-a2cc-c4a4fa613a7e","avatar":"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/627.jpg","lastOnline":"2022-03-02T05:02:12.666Z"}
   ]
```
