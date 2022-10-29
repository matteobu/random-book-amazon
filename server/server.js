const express = require("express");
const app = express();
const { launch } = require("puppeteer");
app.use(express.json());

const yearChoiceAwards = "/choiceawards/best-books-2021";
const yearListUrl = "https://www.goodreads.com" + yearChoiceAwards;
app.get("/years-list", async (req, res) => {
    let yearsListToDisplay = await gettinYearsList();
    res.json(yearsListToDisplay);
});

app.post("/years-list", async (req) => {
    yearChoiceAwards = req.body.link;
    let yearsListToDisplay = await gettinYearsList(yearChoiceAwards);
    console.log("yearsListToDisplay", yearsListToDisplay);
    res.json(yearsListToDisplay);
    console.log(req.body);
});

const gettinYearsList = async (year) => {
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto(year || yearListUrl);
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
