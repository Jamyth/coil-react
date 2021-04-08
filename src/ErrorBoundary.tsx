import React from "react";

interface Props {
    onError: (error: any) => void;
    children: React.ReactNode;
}

export const ErrorBoundary = React.memo(({children, onError}: Props) => {
    const onUnhandleRejection = React.useCallback(
        (e: PromiseRejectionEvent) => {
            onError(e.reason);
        },
        [onError]
    );

    const onLocalError = React.useCallback(
        (e: ErrorEvent) => {
            onError(e.error);
        },
        [onError]
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
