import React from "react";
import type {useErrorHooks} from "./type";
import {CoilReactRootState} from "./State";
import {useCoilState} from "./hooks";

interface Props {
    useError: () => useErrorHooks;
    children: React.ReactNode;
}

export const ErrorBoundary = React.memo(({children, useError}: Props) => {
    const {setState} = useCoilState(CoilReactRootState);
    const callback = useError();

    const cleanupAllLoading = React.useCallback(() => {
        setState((state) => (state.loading = {default: false}));
    }, [setState]);

    const onUnhandleRejection = React.useCallback(
        (e: PromiseRejectionEvent) => {
            callback(e.reason);
            cleanupAllLoading();
        },
        [callback, cleanupAllLoading]
    );

    const onLocalError = React.useCallback(
        (e: ErrorEvent) => {
            callback(e.error);
            cleanupAllLoading();
        },
        [callback, cleanupAllLoading]
    );

    React.useEffect(() => {
        window.addEventListener("unhandledrejection", onUnhandleRejection, true);
        // TODO: Check if the true here is required.
        window.addEventListener("error", onLocalError, true);

        return () => {
            window.removeEventListener("unhandledrejection", onUnhandleRejection, true);
            window.removeEventListener("error", onLocalError, true);
        };
    }, [onLocalError, onUnhandleRejection]);

    // eslint-disable-next-line react/jsx-no-useless-fragment -- Type issue
    return <>{children}</>;
});
