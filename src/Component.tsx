import React from "react";
import {useLocation, useParams} from "react-router";
import {useHistory} from "./hooks";
import {DefaultAction} from "./type";

export function injectLifeCycle<RouteParam = {}, HistoryState = {}>(Component: React.ComponentType<any>, useActions: () => DefaultAction<RouteParam, HistoryState>) {
    return React.memo(() => {
        const history = useHistory<HistoryState>();
        const location = useLocation();
        const routeParam = useParams<RouteParam>();
        const {onMount, onRouteMatched} = useActions();
        const locationRef = React.useRef(history.location);

        React.useEffect(() => {
            onMount();
        }, []);

        React.useEffect(() => {
            const prevLocation = locationRef.current;
            const currentLocation = history.location;
            if (currentLocation && routeParam && prevLocation !== currentLocation) {
                onRouteMatched(routeParam, currentLocation);
            }
            locationRef.current = history.location;
        }, [location.pathname]);

        return <Component />;
    });
}
