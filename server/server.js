const express = require("express");
const app = express();
const { launch } = require("puppeteer");
app.use(express.json());

app.get("/years-list", async (req, res) => {
    var yearChoiceAwards = "/choiceawards/best-books-2021";
    var yearListUrl = "https://www.goodreads.com" + yearChoiceAwards;
    let yearsListToDisplay = await gettinYearsList(yearListUrl);
    res.json(yearsListToDisplay);
});

app.post("/years-list", async (req, res) => {
    yearChoiceAwards = req.body.link;
    var yearListUrl = "https://www.goodreads.com" + yearChoiceAwards;
    var yearsListToDisplay = await gettinYearsList(yearListUrl);
    res.json(yearsListToDisplay);
});

const gettinYearsList = async (year) => {
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto(year);
    const yearsList = await page.$$eval(
        "#previousYears > ul > li > a",
        (yearsList) => {
            return yearsList.map((year) => ({
                title: year.innerHTML,
                link: year.getAttribute("href"),
            }));
        }
    );
    return yearsList;
};

app.listen(3001, () => {
    console.log("The server is listening");
});
