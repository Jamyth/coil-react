import React from "react";
import {startApp} from "../../src";

const App = React.memo(() => {
    React.useEffect(() => {
        throw Error("blah");
    }, []);
    return <h1>hello World</h1>;
});

startApp({
    MainComponent: App,
    entryElement: document.getElementById("app"),
    onError: (e: any) => {
        alert("error catched");
    },
});
