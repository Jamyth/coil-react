import React from "react";
import type {useErrorHooks} from "./type";

interface Props {
    useError: () => useErrorHooks;
    children: React.ReactNode;
}

export const ErrorBoundary = React.memo(({children, useError}: Props) => {
    const callback = useError();

    const onUnhandleRejection = React.useCallback(
        (e: PromiseRejectionEvent) => {
            callback(e.reason);
        },
        [callback]
    );

    const onLocalError = React.useCallback(
        (e: ErrorEvent) => {
            callback(e.error);
        },
        [callback]
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
