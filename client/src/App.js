import React, { useState, useEffect } from "react";

function App() {
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
        })();
    }, []);

    const handleYears = async (e) => {
        const yearTolist = { link: e.target.id, title: e.target.textContent };
        setYearAward(yearTolist);
        await console.log("yearTolist", yearTolist);
        // fetch(`/year-award/${link}`).catch((err) => console.log(err));
        let res = fetch("/years-list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(yearTolist),
        });
        let data = await res.json();

        setYearsLinkList(data);
    };
    return (
        <div>
            <h6>if you like you can choose another year</h6>
            {yearsLinkList &&
                yearsLinkList.map((year, i) => (
                    <h6
                        value={year.title}
                        key={year.title}
                        id={year.link}
                        onClick={(e) => {
                            handleYears(e);
                        }}
                    >
                        {year.title}
                    </h6>
                ))}
            <h3>This is the {yearAward.title} genres book list</h3>
        </div>
    );
}

export default App;
