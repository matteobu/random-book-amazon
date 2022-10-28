const express = require("express");
const app = express();

app.get("/api", (req, res) => {
    res.json({ users: ["user", "another user", "third user"] });
});

app.listen(3001, () => {
    console.log("The server is listening");
});
