import express from "express";
import router from "./router.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = dirname(__filename);
console.log(__dirname);
const app = express();
const port = process.env.PORT;
app.use(express.static(__dirname));
app.use("/", router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
