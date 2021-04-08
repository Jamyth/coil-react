import {useHistory as useRouterHistory, useLocation} from "react-router";
import {CoilReactRootState} from "./State";
import Recoil from "recoil";
import React from "react";
import {produce, enableES5} from "immer";
import type {SetCoilState} from "./type";

type KeepState = "keep-state";

enableES5();
export const useHistory = <HistoryState>() => {
    const routerHistory = useRouterHistory<Readonly<HistoryState> | undefined>();
    const location = useLocation();

    function pushHistory(url: string): void;
    function pushHistory(url: string, stateMode: KeepState): void;
    function pushHistory<T extends object>(url: string, state: T): void;
    function pushHistory<T extends object>(state: T): void;
    function pushHistory(urlOrState: HistoryState | string, state?: HistoryState | KeepState) {
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

export const useLoadingState = (key: string = "default") => {
    const state = Recoil.useRecoilValue(CoilReactRootState);
    return state[key] || false;
};

export const useLoadingAction = () => {
    const setState = Recoil.useSetRecoilState(CoilReactRootState);
    const start = (key: string = "default") => {
        setState((state) => ({
            ...state,
            loading: {
                ...state.loading,
                [key]: true,
            },
        }));
    };
    const end = (key: string = "default") => {
        setState((state) => ({
            ...state,
            loading: {
                ...state.loading,
                [key]: false,
            },
        }));
    };
    return {
        start,
        end,
    };
};

export const useObjectKeyAction = <T extends object, K extends keyof T>(action: (arg: T) => void, key: K) => {
    return React.useCallback(
        (value: T[K]) => {
            action({[key]: value} as T);
        },
        [action, key]
    );
};

export const useCoilState = <State>(
    recoilState: Recoil.RecoilState<State>
): {
    getState: () => State;
    setState: SetCoilState<State>;
} => {
    const [state, setState] = Recoil.useRecoilState(recoilState);

    let updatedState: State = state;

    const getState = () => updatedState;

    const setCoilState: SetCoilState<State> = (stateOrUpdater: ((state: State) => void) | Pick<State, keyof State> | State) => {
        if (typeof stateOrUpdater === "function") {
            const originalState = updatedState;
            const updater = stateOrUpdater as (state: State) => void;
            const newState = produce<Readonly<State>, State>(originalState, (draftState) => {
                // Wrap into a void function, in case updater() might return anything
                updater(draftState);
            });
            if (newState !== originalState) {
                updatedState = newState;
                setState(newState);
            }
            return;
        } else {
            const partialState = stateOrUpdater as object;
            return setCoilState((state) => Object.assign(state, partialState));
        }
        throw Error("[setCoilState]: only function and state are allowed in this method.");
    };
    return {
        getState,
        setState: setCoilState,
    };
};

export function usePrevious<T>(value: T) {
    const ref = React.useRef(value);
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}
