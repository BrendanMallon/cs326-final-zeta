// import express from "express";
// import router from "./router.js";
// import testAPI from "./testAPI.js";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();
// const port = process.env.PORT ? process.env.PORT : 8080;
// app.use(express.static(__dirname));
// app.get("/", function (req, res) {
//     res.redirect("/login");
// });
// app.use("/", router);
// app.use("/", testAPI);
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
// });

("use strict");
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname } from "path";
import testAPI from "./testAPI.js";
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// For loading environment variables.
require("dotenv").config();

const express = require("express"); // express routing
const expressSession = require("express-session"); // for managing session state
const passport = require("passport"); // handles authentication
const LocalStrategy = require("passport-local").Strategy; // username/password strategy
const app = express();
const port = process.env.PORT || 3000;

/// NEW
import { MiniCrypt } from "./miniCrypt.js";
const mc = new MiniCrypt();

// Session configuration

const session = {
    secret: process.env.SECRET || "SECRET", // set this encryption key in Heroku config (never in GitHub)!
    resave: false,
    saveUninitialized: false,
};

// Passport configuration

const strategy = new LocalStrategy(async (username, password, done) => {
    if (!findUser(username)) {
        // no such user
        await new Promise((r) => setTimeout(r, 2000)); // two second delay
        return done(null, false, { message: "Wrong username" });
    }
    if (!validatePassword(username, password)) {
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

// App configuration

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

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

// ///

// we use an in-memory "database"; this isn't persistent but is easy

// // NEW ////

// We used to use:
//   let users = { 'emery' : 'compsci326' } // default user

// Now, instead of storing the above password in plaintext, we store a
// random salt and the hash of the password concatentated with that
// salt.

const users = {
    John: [
        "9ebe45061f69e9ab6e1735c5a9784367",
        "aa1b1d681a258b0debfedb0fd9a875c6723fdb8f17a824f3bf9b3aa6d5f224fa6160d7e7d32c277eb5b7f58a62b463003d792d63a93425f27f6b0fb6e681ed8d",
    ],
}; // name : [salt, hash]

// Illustration of how salts and hashes look and work
const exampleSalt = "541818e33fa6e21a35b718bbd94d1c7f";
const exampleHash =
    "902f945dc114cdf04bb1b2bbcc2ccdef6e416fdb1dce93ed8f34dc6aac02eefaaaf5d65c657dec6e405efa977a26c8e41ff4eb3f46722fbd88779a25d1a22c5b";
console.log(mc.check("compsci326", exampleSalt, exampleHash)); // true
console.log(mc.check("nope", exampleSalt, exampleHash)); // false

// Returns true iff the user exists.
function findUser(username) {
    if (!users[username]) {
        return false;
    } else {
        return true;
    }
}

// Returns true iff the password is the one we have stored.
function validatePassword(name, pwd) {
    if (!findUser(name)) {
        return false;
    }
    if (mc.check(pwd, users[name][0], users[name][1])) {
        return true;
    }
    return false;
}

// Add a user to the "database".
function addUser(name, pwd) {
    if (findUser(name)) {
        return false;
    }
    const [salt, hash] = mc.hash(pwd);
    users[name] = [salt, hash];
    // Now print the user database
    console.log(users);
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
    res.send("hello world");
});

// Handle post data from the login.html form.
app.post(
    "/login",
    passport.authenticate("local", {
        // use username/password authentication
        successRedirect: "/private", // when we login, go to /private
        failureRedirect: "/login", // otherwise, back to login
    })
);

// Handle the URL /login (just output the login.html file).
app.get("/login", (req, res) =>
    res.sendFile("html/login.html", { root: __dirname })
);

// Handle logging out (takes us back to the login page).
app.get("/logout", (req, res) => {
    // Logs us out!
    req.logout(() => {
        res.redirect("/login"); // back to login
    });
});

// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post("/register", (req, res) => {
    const username = req.body["username"];
    const password = req.body["password"];
    if (addUser(username, password)) {
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

app.use("/", testAPI);

app.get("*", (req, res) => {
    res.statusCode = 404;
    res.send("Error: route not defined.");
});

app.listen(port, () => {
    console.log(`App now listening at http://localhost:${port}`);
});
