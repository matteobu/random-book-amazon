const express = require("express");
const app = express();
app.use(express.json());
const { launch } = require("puppeteer");

app.get("/api", async (req, res) => {
    res.json({ users: ["user", "another user", "third user"] });
});
app.get("/years-list", async (req, res) => {
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto("https://www.goodreads.com/choiceawards/best-books-2021");
    const yearsList = await page.$$eval(
        "#previousYears > ul > li > a",
        (yearsList) => {
            return yearsList.map((year) => ({
                title: year.innerHTML,
                link: year.getAttribute("href"),
            }));
        }
    );
    res.json(yearsList);
});

app.post("/award", async (req) => {
    console.log(req.body);
});

app.listen(3001, () => {
    console.log("The server is listening");
});
