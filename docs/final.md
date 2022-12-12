- Title: Team Zeta
- Memebers: Izaias Cunha, Brendan Mallon, William Porter
- Semester: Fall 2022

- SPOTLIST
    - This application is a "swipe styled" spotify playlist discoivery tool. Upon sigining in, you can search for playlits based on a term (this can be a genre, description, etc) ans the application will play a snippet of each song in the playlist until you either like or dislike the playlist. If you like the playlist, it will get added to your spotify account and to your social page so the people in your friends list can see. The social page allows you to see the playlists your frriends have added to their spotify via spotlist. This is innovative as it creates a simple and quick way to discover playlists while also allowing you to listen to their content in a short ammount of time and automated manner.

- Instructions/Important Notes:
    - Once home page is loaded, open spotify app on phone and select current player to be spotlist. Once done, you can query playlist
    - You can add these accounts as friends in order to have some activity in the social page: ["izaias", "Will", "Brendan"]
    - Make sure you are full screen or there might be weird visual bugs (text overlapping where is shouldn't be) if you aren't
- Division of Labor
    - Izaias: Built the spotify API and webplayback SDK integration and all the fuinctional components. Created the login and sign up page HTML and all the home page JS. 
    - Will: Worked on MongoDB functionality. Implemented HTML and CSS code for the home page and account page and JS for the account page. 
    - Brendan: Built express framework and implemented passport for authenication. Added spotify authenticaiton to our login route. Built all of the social and playlist pages, including html/css/js. Additionally, created a lot of the api calls used for those pages and pages made by the others. 

- API:
    - /Spotify
        - /auth
            - Method: get
            - Redirects user to spotify login page for authentication. This is used when a user logins in to spotlist
        - /auth/callback
            - Method: get
            - Gets the token code after authentication. If no token, then the user gets redirected back to login page
        - /token
            - Method: get
            - Returns the token for the user. This also checks if the token is expired and updates the token of it is
        - /playlist/:query
            - Method: get
            - Params: [Query: a string that has the search term for a playlist to listen to]
            - returns an array of playlists to be played based on search terms
        - /playlistid/:query
            - Method: get
            - Param: [Query: a sptify plylist ID (string)]
            - Returns the playlist object for the specific playlist requested
        - /follow/:query
            - Method: get
            - Param: [Query: a sptify plylist ID (string)]
            - Follows the playlist on spotify account
    - /setName/:name
        - Method: Set
        - Sets the new name provided from the account page to update the users name on MongDB.
    - /setEmail/:email
        - Method: Set
        - Sets the new email provided from the account page to update the users email on MongDB.
    - /setPassword/:password
        - Method: Set
        - Sets the new pssword provided from the account page to update the users password on MongDB.
        
   - /API
        - /findUser
            - Method: GET
            - This method is used during authentication. Given a username in the body, it will return an object in the form {exists, salt_hash}.
        - /getUserActivity
            - Method: GET
            - This method is used on the playlists page. It gets all of the current user's playlist data, queries the spotify api to find the corresponding playlist information.
        - /addUserActivity
            - Method: PUT
            - When a user likes a playlist using our webpage, we will record that intereaction for later use. We record the current time and the playlistID.
        - /addFriend
            - Method: PUT
            - When a user adds a friend this is called. We add the friend's username to the current users friends list.
        - /getFriendActivity
            - Method: GET
            - This method is used on the social page. It gets all of the current user's friend's playlist data, queries the spotify api to find the corresponding playlist information.

- Database:
    - Collections:
        - /USERS
            - name
            - salt_hash
            - email
            - username
            - friendslist
        - /PLAYLISTACTIVITY
            - time
            - playlistID

- Routes:
    - /login
        - Users are prompted to log in.
    - /register
        - Users can create an account with us here.
    - /home
        - This is where users land after logging in. Users can search for playlists and listen to songs. They can like or skip playlists after listening to them.
    - /social
        - Users can add friends and see their current friends. Additionally, users can see their friends activity.
    - /playlist
        - Users can see their own activity.
    - /profile
        - Users can edit some of their account data on this page.

- Authentication
    - Users are prompted to login to spotify after logging into with us. Once logged in they can only query for a playlist if they have a premium account.



