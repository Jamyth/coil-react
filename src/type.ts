import type {Location as HistoryLocation} from "history";

type Location<T> = Omit<HistoryLocation, "state"> & {
    state: T | undefined;
};

export interface DefaultAction<RouteParam, HistoryState> {
    onMount?: () => void;
    onRouteMatched?: (routerParams: RouteParam, location: Location<HistoryState | undefined>) => void;
    [method: string]: ((...args: any[]) => void) | undefined;
}

export type SetCoilState<State> = (stateOrUpdater: ((state: State) => void) | State | Pick<State, keyof State>) => void;
