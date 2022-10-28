import React, { useState, useEffect } from "react";

function App() {
    const [backendData, setBackendData] = useState();
    useEffect(() => {
        fetch("/api")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setBackendData(data);
            });
    }, []);

    return (
        <div>
            {backendData &&
                backendData.users.map((user, i) => <p key={i}>{user}</p>)}
        </div>
    );
}

export default App;
