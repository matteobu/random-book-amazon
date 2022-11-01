const express = require("express");
const app = express();
const { launch } = require("puppeteer");
const selectors = {
    searchBox: "#twotabsearchtextbox",
    searchBoxTwo: "#nav-bb-search",
    searchBoxThree: "//*[contains(@id, 'search')]",
    searchBoxFour: `//input[@id="twotabsearchtextbox" or @id="#av-bb-search"]`,
    productLinks: `//span[@class="a-size-medium a-color-base a-text-normal"]`,
    formatsHandles: "#tmmSwatches > ul > li",
    formatLink: `//*[@id="tmmSwatches"]/ul/li[3]/span/span[1]`,
    addToCartLink: `//*[starts-with(@id, 'add-to-cart')]`,
    goToCart: `//*[@id="sw-gtc"]`,
    previousYears: `//*[@id="previousYears"]/ul`,
};
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
app.get("/randomBook/:input", async (req) => {
    let genreLink = req.params.input;
    let url = "https://www.goodreads.com/choiceawards/" + genreLink;

    try {
        const browser = await launch();
        const page = await browser.newPage();
        await page.goto(url);

        //once I recive the genre link, I start to evaluate the page
        const links = await page.evaluate(() => {
            const bestBooks = document.querySelectorAll(`[id^="bookCover"]`);
            const filteredBooksInfo = [...bestBooks].map((n) =>
                n.getElementsByTagName("img")[0].getAttribute("alt")
            );
            return filteredBooksInfo;
        });

        //once I have all the books from the genre, I randomly select a book
        let randomBook = links[Math.floor(Math.random() * links.length)];
        console.log("The random book chosen for the User is:", randomBook);
        const urlAmazon = "https://www.amazon.com/";
        const browser2 = await launch({ headless: false });
        const pageAmazon = await browser2.newPage();
        await pageAmazon.setViewport({ width: 1600, height: 900 });
        await pageAmazon.goto(urlAmazon);

        await pageAmazon.waitForSelector(
            selectors.searchBox,
            selectors.searchBoxTwo
        );

        // Typing the book title in the search bar
        await pageAmazon.type(selectors.searchBox, randomBook + " Hardcover");
        await pageAmazon.keyboard.press("Enter");

        // await pageAmazon.type(
        //     selectors.searchBoxFour,
        //     randomBook + " hardcover"
        // );

        // Waiting and clicking the first result
        const bookChoice = await pageAmazon.waitForXPath(
            selectors.productLinks
        );
        await bookChoice.click();

        // Waiting and clicking the "HardCover" button
        // let arrayOfTotal = [];
        // const rows = await pageAmazon.$$(selectors.formatsHandles);

        // for (let index = 0; index < rows.length; index++) {
        //     const row = rows[index];
        //     const formatTypes = await row.$$eval(
        //         `a[class="a-button-text"] span:nth-child(1)`,
        //         (formatTypes) => {
        //             return formatTypes.map((formatType) =>
        //                 formatType.textContent.trim()
        //             );
        //         }
        //     );
        //     console.log("formatTypes", formatTypes);
        //     const arryOfNumber = formatTypes.indexOf("Hardcover");
        //     arrayOfTotal.push(arryOfNumber);
        // }

        // let indexOfLi = arrayOfTotal.indexOf(0) + 1;
        // console.log("indexOfLi", indexOfLi);

        // const selectFormat = await pageAmazon.waitForXPath(
        //     `//*[@id="tmmSwatches"]/ul/li[${indexOfLi}]/span/span[1]`
        // );

        // await selectFormat.click();

        // // Waiting and clicking the "add to cart" button
        const addToCartButton = await pageAmazon.waitForXPath(
            selectors.addToCartLink
        );
        await addToCartButton.click();

        // // Waiting and clicking the "go to cart" button
        const goToCartButton = await pageAmazon.waitForXPath(
            selectors.goToCart
        );
        await goToCartButton.click();

        // then I close the browser
        // await browser2.close();
    } catch (e) {
        console.log(e);
    }
});

app.listen(3001, () => {
    console.log("The server is listening");
});
