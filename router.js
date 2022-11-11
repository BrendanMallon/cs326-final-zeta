import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import PAGES from "./constants/pages.js";
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = dirname(__filename);
console.log(__dirname);
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
