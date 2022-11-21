COLLECTIONS:

```JSON
const USER = {
    userId: "string",
    username: "string",
    fname: "string",
    lname: "string",
    password: "string",
    email: "string",
    registeredAt: "date",
    lastLogin: "date",
    authToken: "string",
    refreshToken: "string",
    friendsList: ["string"],
};

const PLAYLISTACTIVITY = {
    time: "Date",
    userId: "string",
    username: "string",
    playlistId: "string",
    likes: "number",
    comments: [
            {
                userId: "string",
                commentId: "string",
                username: "string",
                text: "string",
                time: "date",
            },
        ],
    };
```

Breakdown of Work:

Creating framework for connecting to Spotify API: Izaias

Creating framework for mongoDB API calls: Will

Generating more of the website based off of API calls + setting up MongoDB: Brendan
