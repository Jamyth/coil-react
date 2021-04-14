import React from "react";
import ReactDOM from "react-dom";
import Recoil from "recoil";
import {RecoilDebugObserver} from "./RecoilDebugger";
import {BrowserRouter} from "react-router-dom";
import {ErrorBoundary} from "./ErrorBoundary";
import type {useErrorHooks} from "./type";

interface StartAppOption {
    MainComponent: React.ComponentType<any>;
    entryElement: HTMLElement | null;
    useError: () => useErrorHooks;
}

export function startApp({MainComponent, entryElement, useError}: StartAppOption) {
    const _entryElement = validateEntryElement(entryElement);
    renderApp(MainComponent, _entryElement, useError);
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

function renderApp(MainComponent: React.ComponentType<any>, element: HTMLElement, useError: () => useErrorHooks) {
    ReactDOM.render(
        <Recoil.RecoilRoot>
            <RecoilDebugObserver />
            <BrowserRouter>
                <ErrorBoundary useError={useError}>
                    <MainComponent />
                </ErrorBoundary>
            </BrowserRouter>
        </Recoil.RecoilRoot>,
        element
    );
}
