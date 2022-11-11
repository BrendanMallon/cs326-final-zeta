import express from "express";
import router from "./router.js";
import testAPI from "./testAPI.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT;
app.use(express.static(__dirname));
app.use("/", router);
app.use("/", testAPI);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
