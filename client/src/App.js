import React, { useState, useEffect } from "react";

function App() {
    const [yearsLinkList, setYearsLinkList] = useState();
    const [yearAward, setYearAward] = useState("2021 AWARDS");
    // const [backendData, setBackendData] = useState();

    useEffect(() => {
        (async () => {
            const res = await fetch("/years-list");
            const data = await res.json();
            setYearsLinkList(data);
        })();
    }, []);

    const handleYears = async (e) => {
        console.log("e", e);
        const yearChoice = setYearAward(e.target.textContent);

        console.log("year", e.target.textContent);
    };
    return (
        <div>
            <h3>This is the {yearAward} genres book list</h3>
            <h6>if you like you can choose another year</h6>
            {yearsLinkList &&
                yearsLinkList.map((year, i) => (
                    <h6
                        value={year.title}
                        id={year.link}
                        onClick={(e) => {
                            handleYears(e);
                        }}
                    >
                        {year.title}
                    </h6>
                ))}
            <button> </button>
        </div>
    );
}

export default App;
