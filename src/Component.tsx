import React from "react";
import {useLocation, useParams} from "react-router";
import {usePrevious, useNavigationPreventAction} from "./hooks";
import type {DefaultAction} from "./type";

export function injectLifeCycle<RouteParam = object, HistoryState = object>(Component: React.ComponentType<any>, useActions: () => DefaultAction<RouteParam, HistoryState>) {
    return React.memo(() => {
        const location = useLocation<HistoryState>();
        const routeParam = useParams<RouteParam>();
        const {onMount, onRouteMatched} = useActions();
        const previousLocation = usePrevious(location);
        const navigationPreventActions = useNavigationPreventAction();

        React.useEffect(() => {
            onMount?.();
            onRouteMatched?.(routeParam, location);

            return () => {
                if (location) {
                    navigationPreventActions.setNavigationPrevent(false);
                }
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps -- Did mount call
        }, []);

        React.useEffect(() => {
            if (previousLocation && location && previousLocation !== location) {
                onRouteMatched?.(routeParam, location);
                navigationPreventActions.setNavigationPrevent(false);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps -- only track the location
        }, [location]);

        return Component ? <Component /> : null;
    });
}
