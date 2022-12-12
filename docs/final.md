- Title: Team Zeta
- Memebers: Izaias Cunha, Brendan Mallon, William Porter
- Semester: Fall 2022

- SPOTLIST
    - This application is a "swipe styled" spotify playlist discoivery tool. Upon sigining in, you can search for playlits based on a term (this can be a genre, description, etc) ans the application will play a snippet of each song in the playlist until you either like or dislike the playlist. If you liek the playlist, it will get added to your spotify account and to your social page so the people in your friends list can see. The social page allows you to see the playlists your frriends have added to their spotify via spotlist. This is innovative as it creates a simple and quick way to discover playlists while also allowing you to listen to their content in a short ammount of time and automated manner.

- Division of Labor
    - Izaias: Built the spotify API and webplayback SDK integration and all the fuinctional components. Created the login and sign up page HTML and all the home page JS. 
    - Will: Worked on MongoDB functionality. Implemented HTML and CSS code for the home page and account page and JS for the account page. 
    - Brendan:

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

    - 