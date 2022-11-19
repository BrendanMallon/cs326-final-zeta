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

const FRIENDSTATUS = {
    userId: "string",
    fname: "string",
    lname: "string",
    lastOnline: "date",
};

const PLAYLISTACTIVITY = {
    time: "Date",
    playlistId: "string",
    likes: "number",
    comments: [
        {
            userId: "string",
            username: "string",
            text: "string",
            time: "date",
        },
    ],
};
