import React from "react";
import {RouteComponentProps, useLocation, useParams} from "react-router";
import {useHistory} from "./hooks";
import {DefaultAction} from "./type";

export function injectLifeCycle<RouteParam = {}, HistoryState = {}>(Component: React.ComponentType<any>, useActions: () => DefaultAction<RouteParam, HistoryState>) {
    return React.memo((props: RouteComponentProps<RouteParam>) => {
        const history = useHistory<HistoryState>();
        const location = useLocation();
        const routeParam = useParams<RouteParam>();
        const {onMount, onRouteMatched} = useActions();
        const locationRef = React.useRef(props);

        React.useEffect(() => {
            onMount();
        }, []);

        React.useEffect(() => {
            const prevLocation = locationRef.current.location;
            const currentLocation = history.location;
            const currentRouteParams = props.match ? routeParam : null;
            if (currentLocation && currentRouteParams && prevLocation !== currentLocation) {
                onRouteMatched(currentRouteParams, currentLocation);
            }
        }, [location.pathname]);

        return <Component />;
    });
}
