"use strict";
import { mdbSetName, mdbSetEmail, mdbSetPassword } from "./src/mongoDB.js";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dbAPI from "./dbAPI.js";
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// For loading environment variables.
require("dotenv").config();

const express = require("express"); // express routing
const request = require("request");

const bodyParser = require("body-parser");
const expressSession = require("express-session"); // for managing session state
const passport = require("passport"); // handles authentication
const LocalStrategy = require("passport-local").Strategy; // username/password strategy
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();
const port = process.env.PORT || 3000;

/// NEW
import { MiniCrypt } from "./miniCrypt.js";
import axios from "axios";
const mc = new MiniCrypt();

// Session configuration

let clientId, clientSecret, redirectUri;
let secrets;

if (!process.env.CLIENT_ID) {
    secrets = require("./secrets.json");
    clientId = secrets.CLIENT_ID;
    clientSecret = secrets.SECRET_ID;
    redirectUri = secrets.cbURI;
} else {
    clientId = process.env.CLIENT_ID;
    clientSecret = process.env.SECRET_ID;
    redirectUri = process.env.cbURI;
}
const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri,
});
const session = {
    secret: process.env.SECRET || "SECRET", // set this encryption key in Heroku config (never in GitHub)!
    resave: false,
    saveUninitialized: false,
};

// Passport configuration

const strategy = new LocalStrategy(async (username, password, done) => {
    const user = await findUser(username);
    if (!user.exists) {
        // no such user
        await new Promise((r) => setTimeout(r, 2000)); // two second delay
        return done(null, false, { message: "Wrong username" });
    }
    const validated = await validatePassword(username, password);
    if (!validated) {
        // invalid password
        // should disable logins after N messages
        // delay return to rate-limit brute-force attacks
        await new Promise((r) => setTimeout(r, 2000)); // two second delay
        return done(null, false, { message: "Wrong password" });
    }
    // success!
    // should create a user object here, associated with a unique identifier
    return done(null, username);
});

const rememberMeStrategy = require("passport-remember-me").Strategy;
const tokens = {};

const Token = {
    consume: async function (token, cb) {
        const userId = tokens[token];
        delete tokens[token];
        return await cb(null, userId);
    },
    issue: async function (user, cb) {
        const token = Math.random() * Math.pow(10, 18);
        tokens[token] = user.id;
        return await cb(null, token);
    },
};
passport.use(
    new rememberMeStrategy(
        async function (token, done) {
            // Retrieve the user from the token and return it
            await Token.consume(token, async function (err, userId) {
                if (err) {
                    return done(err);
                }
                if (!userId) {
                    return done(null, false);
                }
                const result = await findUser(userId);
                if (!result.exists) {
                    return done(null, false);
                }
                return done(null, userId);
            });
        },
        function (user, done) {
            // Create a new token for the user and return it
            Token.issue(user, function (err, token) {
                if (err) {
                    return done(err);
                }
                return done(null, token);
            });
        }
    )
);

// App configuration

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// enable the body-parser middleware
app.use(bodyParser.json());

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({ extended: true })); // allow URLencoded data

// Returns true iff the user exists.
async function findUser(username) {
    const result = await new Promise((resolve, reject) => {
        axios
            .post("http://localhost:" + port + "/api/findUser", {
                username,
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
    return result;

    // if (!users[username]) {
    //     return false;
    // } else {
    //     return true;
    // }
}

// Returns true iff the password is the one we have stored.
async function validatePassword(name, pwd) {
    const result = await findUser(name);
    if (!result.exists) {
        return false;
    }
    if (mc.check(pwd, result.salt_hash[0], result.salt_hash[1])) {
        return true;
    }
    return false;
}

// Add a user to the "database".
async function addUser(username, pwd, email, name) {
    const result = await findUser(username);
    if (result["exists"]) {
        return false;
    }
    const salt_hash = mc.hash(pwd);
    const userData = { username, email, salt_hash, name };
    request.debug = true;
    await new Promise(() => {
        axios.post("http://localhost:" + port + "/api/registerUser", userData);
    });
    return true;
}

// Routes

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.redirect("/login");
    }
}

app.get("/", checkLoggedIn, (req, res) => {
    res.redirect("/login");
});

// Handle post data from the login.html form.
app.post(
    "/login",
    passport.authenticate("local", {
        // use username/password authentication
        successRedirect: "/spotify/auth", // when we login, go to /private
        failureRedirect: "/login", // otherwise, back to login
    })
);

// Handle the URL /login (just output the login.html file).
app.get("*/login", (req, res) =>
    res.sendFile("html/login.html", { root: __dirname })
);

// Handle logging out (takes us back to the login page).
app.get("*/logout", (req, res) => {
    // Logs us out!
    req.logout(() => {
        res.redirect("/login"); // back to login
    });
});

// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post("/register", async (req, res) => {
    const username = req.body["username"];
    const password = req.body["password"];
    const email = req.body["email"];
    const name = req.body["name"];
    if (addUser(username, password, email, name)) {
        res.redirect("/login");
    } else {
        res.redirect("/register");
    }
});

// Register URL
app.get("/register", (req, res) =>
    res.sendFile("html/register.html", { root: __dirname })
);

// Private data
app.get(
    "/private",
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => {
        // Go to the user's page.
        res.redirect("/private/" + req.user + "/home");
    }
);

// Serve home page for the user.
app.get(
    "/private/:username/home",
    checkLoggedIn, // We also protect this route: authenticated...
    (req, res) => {
        // Verify this is the right user.
        if (req.params.username === req.user) {
            res.sendFile("html/home.html", { root: __dirname });
        } else {
            res.redirect("/private/");
        }
    }
);

// Serve social page for the user.
app.get(
    "/private/:username/social",
    checkLoggedIn, // We also protect this route: authenticated...
    (req, res) => {
        // Verify this is the right user.
        if (req.params.username === req.user) {
            res.sendFile("html/social.html", { root: __dirname });
        } else {
            res.redirect("/private/");
        }
    }
);

// Serve profile page for the user.
app.get(
    "/private/:username/profile",
    checkLoggedIn, // We also protect this route: authenticated...
    (req, res) => {
        // Verify this is the right user.
        if (req.params.username === req.user) {
            res.sendFile("html/profile.html", { root: __dirname });
        } else {
            res.redirect("/private/");
        }
    }
);

// Serve playlists page for the user.
app.get(
    "/private/:username/playlists",
    checkLoggedIn, // We also protect this route: authenticated...
    (req, res) => {
        // Verify this is the right user.
        if (req.params.username === req.user) {
            res.sendFile("html/playlists.html", { root: __dirname });
        } else {
            res.redirect("/private/");
        }
    }
);

app.use(express.static("css"));
app.use(express.static("src"));
app.use(express.static("public"));

app.get("/spotify/auth", (req, res) => {
    const authorizeURL = spotifyApi.createAuthorizeURL([
        "user-modify-playback-state",
        "playlist-modify-public",
        "streaming",
        "user-read-private",
        "user-read-email",
    ]);

    res.redirect(authorizeURL);
});

let expireTime = 0;

app.get("/spotify/callback", async (req, res) => {
    const code = req.query.code;
    spotifyApi.authorizationCodeGrant(code).then((data) => {
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);
        expireTime = Date.now() + data.body.expires_in * 1000;
    });
    res.redirect("/private");
});

async function refresh() {
    if (Date.now() > expireTime) {
        spotifyApi.refreshAccessToken().then((data) => {
            spotifyApi.setAccessToken(data.body.access_token);
            spotifyApi.setRefreshToken(data.body.refresh_token);
            expireTime = Date.now() + data.body.expires_in * 1000;
        });
    }
}

app.get("/spotify/token", (req, res) => {
    refresh();
    res.json({ tk: spotifyApi.getAccessToken() });
});

app.get("/spotify/playlist/:query", (req, res) => {
    refresh();
    const query = req.params.query;
    spotifyApi.searchPlaylists(query).then((data) => {
        res.json({ playlist: data.body.playlists.items });
    });
});

app.get("/spotify/playlistid/:query", (req, res) => {
    refresh();
    const query = req.params.query;
    spotifyApi.getPlaylist(query).then((data) => {
        res.json({ playlist: data.body });
    });
});

app.get("/spotify/follow/:query", (req, res) => {
    refresh();
    const query = req.params.query;
    spotifyApi.followPlaylist(query).then(() => {
        res.send();
    });
});
app.get("/setName/:name", (req, res) => {
    const name = req.params.name;
    const user = req.user;
    mdbSetName(user, name);
    res.send();
});
app.get("/setEmail/:email", (req, res) => {
    const email = req.params.email;
    const user = req.user;
    mdbSetEmail(user, email);
    res.send();
});
app.get("/setPassword/:password", (req, res) => {
    const password = req.params.password;
    const salt_hash = mc.hash(password);
    const user = req.user;
    mdbSetPassword(user, salt_hash);
    res.send();
});
app.use("/", dbAPI);

app.get("*", (req, res) => {
    res.statusCode = 404;
    res.send("Error: route not defined.");
});

app.listen(port, () => {
    console.log(`App now listening at http://localhost:${port}`);
});
