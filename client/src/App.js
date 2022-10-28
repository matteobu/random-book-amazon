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
            const res = await fetch("/years-list");
            const data = await res.json();
            setYearsLinkList(data);
        })();
    }, []);

    const handleYears = async (e) => {
        const yearTolist = { title: e.target.id, link: e.target.textContent };
        setYearAward(yearTolist);
        await console.log("yearTolist", yearTolist);
        // fetch(`/year-award/${link}`).catch((err) => console.log(err));
        fetch("/award", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(yearTolist),
        });
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
