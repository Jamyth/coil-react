import {useHistory as useRouterHistory} from "react-router";

export const useHistory = <HistoryState>() => {
    const routerHistory = useRouterHistory<HistoryState | undefined>();

    function pushHistory(url: string): void;
    function pushHistory(url: string, stateMode: "keep-state"): void;
    function pushHistory<T extends object>(url: string, state: T): void;
    function pushHistory<T extends object>(state: T): void;
    function pushHistory(urlOrState: HistoryState | string, state?: HistoryState | "keep-state") {
        if (typeof urlOrState === "string") {
            const url: string = urlOrState;
            if (state) {
                routerHistory.push(url, state === "keep-state" ? routerHistory.location.state : state);
            } else {
                routerHistory.push(url);
            }
        } else {
            const currentURL = location.pathname + location.search;
            const state: HistoryState = urlOrState;
            routerHistory.push(currentURL, state);
        }
    }
    return Object.assign(routerHistory, {pushHistory});
};
