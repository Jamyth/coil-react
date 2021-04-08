import React from "react";
import ReactDOM from "react-dom";
import Recoil from "recoil";
import {RecoilDebugObserver} from "./RecoilDebugger";
import {BrowserRouter} from "react-router-dom";
import {ErrorBoundary} from "./ErrorBoundary";

interface StartAppOption {
    MainComponent: React.ComponentType<any>;
    entryElement: HTMLElement;
    onError: (e: any) => void;
}

export function startApp({MainComponent, entryElement, onError}: StartAppOption) {
    renderApp(MainComponent, entryElement, onError);
}

function renderApp(MainComponent: React.ComponentType<any>, element: HTMLElement, onError: (e: any) => void) {
    ReactDOM.render(
        <Recoil.RecoilRoot>
            <RecoilDebugObserver />
            <BrowserRouter>
                <ErrorBoundary onError={onError}>
                    <MainComponent />
                </ErrorBoundary>
            </BrowserRouter>
        </Recoil.RecoilRoot>,
        element
    );
}
