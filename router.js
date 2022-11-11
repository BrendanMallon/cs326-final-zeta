const express = require("express");
const path = require("path");
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});

const pageDirectory = [];
const page = (url, result) => ({
    url,
    result,
});

// define pages here:
pageDirectory.push(page("/", "./src/login-page.html"));

pageDirectory.forEach((page) => {
    router.get(page.url, function (req, res) {
        res.sendFile(path.join(__dirname, page.result));
    });
});

module.exports = router;
