import PAGES from "constants/pages.js";

const express = require("express");
const path = require("path");
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});

PAGES.forEach((page) => {
    router.get(page.url, function (req, res) {
        res.sendFile(path.join(__dirname, page.path));
    });
});

module.exports = router;
