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
app.post("/genresData", async function (req, res) {
    const genresYearAwardList = req.body.link;
    console.log(req.body);
    // once I receive the user's request I retrieve the information from the website "goodreads.com/choiceawards/best-books-2020"

    const browser = await launch();
    const page = await browser.newPage();
    await page.goto("https://www.goodreads.com" + genresYearAwardList);
    const links = await page
        .evaluate(() => {
            // we retreive the info from a according to the class "category clearFix"
            const genresNode = document.querySelectorAll(
                ".category.clearFix a"
            );
            // here, after mapping into the array, I filter the hrefs that are in my interest
            const hrefs = [...genresNode].map((n) => n.getAttribute("href"));
            const hrefsFiltered = hrefs.filter((n) =>
                n.includes("choiceawards")
            );
            // here I search again into the page, looking for the genres Title
            const genres = document.querySelectorAll(".category.clearFix a h4");
            const genresTitle = [...genres].map((n) => n.innerText);
            // Then I create an Array with all the info, an array like this: [{title: fiction, link: www.example.com}]
            const newArr2 = genresTitle.map((title, i) => ({
                title,
                link: hrefsFiltered[i],
            }));

            return newArr2;
        })
        .catch((err) => console.log("error in links = page.evaluate()", err));
    await browser.close();
    // i send back the info to app.js
    res.json(links);
});

app.listen(3001, () => {
    console.log("The server is listening");
});
