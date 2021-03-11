import React from "react";
import ReactDOM from "react-dom";
import Recoil from "recoil";
import {RecoilDebugObserver} from "./RecoilDebugger";

interface StartAppOption {
    MainComponent: React.ComponentType<any>;
    entryElement: HTMLElement;
}

export function startApp({MainComponent, entryElement}: StartAppOption) {
    renderApp(MainComponent, entryElement);
}

function renderApp(MainComponent: React.ComponentType<any>, element: HTMLElement) {
    ReactDOM.render(
        <Recoil.RecoilRoot>
            <RecoilDebugObserver />
            <MainComponent />
        </Recoil.RecoilRoot>,
        element
    );
}
