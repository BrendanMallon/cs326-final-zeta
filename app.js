const express = require("express");
const birds = require("./birds");

const app = express();
const port = process.env.PORT;

app.use("/birds", birds);

app.get("/", (req, res) => {
    res.send("Hello World!\n");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
