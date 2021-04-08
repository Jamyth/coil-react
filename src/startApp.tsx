import React from "react";
import ReactDOM from "react-dom";
import Recoil from "recoil";
import {RecoilDebugObserver} from "./RecoilDebugger";
import {BrowserRouter} from "react-router-dom";
import {ErrorBoundary} from "./ErrorBoundary";

interface StartAppOption {
    MainComponent: React.ComponentType<any>;
    entryElement: HTMLElement | null;
    onError: (e: any) => void;
}

export function startApp({MainComponent, entryElement, onError}: StartAppOption) {
    const _entryElement = validateEntryElement(entryElement);
    renderApp(MainComponent, _entryElement, onError);
}

function validateEntryElement(element: HTMLElement | null): HTMLElement {
    if (!element) {
        const _element = document.createElement("div");
        _element.id = "app";
        document.body.appendChild(_element);
        return _element;
    }
    return element;
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
