import type {Location} from "history";

export interface DefaultAction<RouteParam, HistoryState> {
    onMount: () => void;
    onRouteMatched: (routerParams: RouteParam, location: Location<HistoryState | undefined>) => void;
    [method: string]: (...args: any[]) => void;
}
