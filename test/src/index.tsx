import React from "react";
import {startApp} from "coil-react";

const App = React.memo(() => {
    return <h1>hello World</h1>;
});

startApp({
    MainComponent: App,
    entryElement: document.getElementById("app"),
    onError: (e: any) => {
        alert("error catched");
    },
});
