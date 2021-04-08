import React from "react";

interface Props {
    onError: (error: any) => void;
    children: React.ReactNode;
}

export const ErrorBoundary = React.memo(({children, onError}: Props) => {
    const onUnhandleRejection = (e: PromiseRejectionEvent) => {
        onError(e.reason);
    };

    const onLocalError = (e: ErrorEvent) => {
        onError(e.error);
    };

    React.useEffect(() => {
        window.addEventListener("unhandledrejection", onUnhandleRejection, true);
        // TODO: Check if the true here is required.
        window.addEventListener("error", onLocalError, true);

        return () => {
            window.removeEventListener("unhandledrejection", onUnhandleRejection, true);
            window.removeEventListener("error", onLocalError, true);
        };
    }, []);

    return <React.Fragment>{children}</React.Fragment>;
});
