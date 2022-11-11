const express = require("express");
const router = require("./router");

const app = express();
const port = process.env.PORT;
external_stylesheets = ["assets/template.css", "assets/bootstrap.min.css"];
app.use("/", router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
