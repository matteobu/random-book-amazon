const express = require("express");
const app = express();
const PORT = 3001;

app.get("/api", (req, res) => {
    res.json({ message: "api connected" });
});

app.listen(PORT, () => {
    console.log("server is running on port:", PORT);
});
