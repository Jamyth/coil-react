import {JavaScriptException, Exception} from "./Exception";
import {ErrorState} from "../state/ErrorState";
import {set} from "../RecoilLoader";
import {clearLoading} from "../hooks";
import {app} from "../startApp";

function errorToException(error: unknown): Exception {
    if (error instanceof Exception) {
        return error;
    } else {
        let message: string;
        if (!error) {
            message = "[No Message]";
        } else if (typeof error === "string") {
            message = error;
        } else if (error instanceof Error) {
            message = error.message;
        } else {
            try {
                message = JSON.stringify(error);
            } catch (e) {
                message = "[Unknown]";
            }
        }
        return new JavaScriptException(message, error);
    }
}

export function captureError(error: unknown) {
    const exception = errorToException(error);
    set(ErrorState, exception);
    clearLoading();
    app.errorHandler(exception);
    return exception;
}
