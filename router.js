import express from "express";
import path from "path";
import PAGES from "./constants/pages.js";
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

export default router;
