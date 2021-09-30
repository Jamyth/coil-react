import React from "react";
import ReactDOM from "react-dom";
import Recoil from "recoil";
import {RecoilDebugObserver} from "./RecoilDebugger";
import {RecoilLoader} from "./RecoilLoader";
import {BrowserRouter} from "react-router-dom";
import {ErrorBoundary} from "./ErrorBoundary";
import type {Exception} from "./util/Exception";
import {captureError} from "./util/error-util";
import {NavigationGuard} from "./components/NavigationGuard";

interface StartAppOption {
    MainComponent: React.ComponentType<any>;
    entryElement: HTMLElement | null;
    errorHandler?: (error: Exception) => void;
    browserConfig?: {
        navigationPreventMessage?: string;
    };
}

interface CoilReactApp {
    errorHandler: (error: Exception) => void;
}

export const app: CoilReactApp = {
    errorHandler: () => {},
};

export function startApp({MainComponent, entryElement, errorHandler, browserConfig}: StartAppOption) {
    const _entryElement = validateEntryElement(entryElement);
    renderApp(MainComponent, _entryElement, browserConfig?.navigationPreventMessage ?? "Are you sure to leave current page?");
    setGlobalErrorHandler(errorHandler);
}

function registerApp<Key extends keyof CoilReactApp>(key: Key, value: CoilReactApp[Key]) {
    app[key] = value;
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

function renderApp(MainComponent: React.ComponentType<any>, element: HTMLElement, navigationPreventMessage: string) {
    ReactDOM.render(
        <Recoil.RecoilRoot>
            <RecoilDebugObserver />
            <RecoilLoader />
            <BrowserRouter>
                <NavigationGuard preventMessage={navigationPreventMessage} />
                <ErrorBoundary>
                    <MainComponent />
                </ErrorBoundary>
            </BrowserRouter>
        </Recoil.RecoilRoot>,
        element
    );
}
function setGlobalErrorHandler(errorHandler: ((error: Exception) => void) | undefined) {
    errorHandler && registerApp("errorHandler", errorHandler);
    window.addEventListener(
        "error",
        (event) => {
            try {
                const analyzeByTarget = (): string => {
                    if (event.target && event.target !== window) {
                        const element = event.target as HTMLElement;
                        return `DOM source error: ${element.outerHTML}`;
                    }
                    return `Unrecognized error, serialized as ${JSON.stringify(event)}`;
                };
                captureError(event.error || event.message || analyzeByTarget());
            } catch (e) {
                console.error("[framework]: global error handler");
            }
        },
        true
    );
    window.addEventListener(
        "unhandledrejection",
        (e) => {
            try {
                captureError(e.reason);
            } catch (error) {
                console.error("[framework]: global unhandled rejection handler");
            }
        },
        true
    );
}
