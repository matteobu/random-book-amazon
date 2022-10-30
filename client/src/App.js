import React, { useState, useEffect } from "react";

function App() {
    const [genresInfo, setGenresInfo] = useState();
    const [yearsLinkList, setYearsLinkList] = useState();
    const [yearAward, setYearAward] = useState({
        title: "2021 AWARDS",
        link: "",
    });
    // const [backendData, setBackendData] = useState();

    useEffect(() => {
        (async () => {
            let res = await fetch("/years-list");
            let data = await res.json();
            setYearsLinkList(data);
            await fetch("/genresData")
                .then((response) => response.json())
                .then((data) =>
                    // when the data are retrieved from the url, then I store them in using useState
                    setGenresInfo(data)
                );
        })();
    }, []);

    const handleYears = async (e) => {
        const yearTolist = { link: e.target.id, title: e.target.textContent };
        setYearAward(yearTolist);
        let res = await fetch("/years-list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(yearTolist),
        });
        let data = await res.json();
        setYearsLinkList(data);
    };

    const handleGenreRequest = async (e, link) => {
        console.log("handle Genre Request clicked");
        // setLookingForBook(true);
        // let linkNotChecked = link;
        // const linkChecked = linkNotChecked.replace("/choiceawards/", "");
        // fetch(`/randomBook/${linkChecked}`).catch((err) => console.log(err));
    };
    return (
        <div>
            <div className="year-choice">
                <h6>if you like you can choose another year</h6>
                {yearsLinkList &&
                    yearsLinkList.map((year) => (
                        <div key={year.title} className="year-award">
                            <h6
                                value={year.title}
                                id={year.link}
                                onClick={(e) => {
                                    handleYears(e);
                                }}
                            >
                                {year.title}
                            </h6>
                        </div>
                    ))}
            </div>
            <h3>This is the {yearAward.title} genres book list</h3>
            {genresInfo &&
                genresInfo.map((genre, i) => (
                    <div key={i}>
                        {/* so then here I  could display all the genres available online*/}
                        <button
                            onClick={(e) => handleGenreRequest(e, genre.link)}
                        >
                            <h6>{genre.title}</h6>
                        </button>
                    </div>
                ))}
        </div>
    );
}

export default App;
