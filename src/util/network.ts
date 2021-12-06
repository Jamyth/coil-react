import type {AxiosError, AxiosRequestConfig, Method} from "axios";
import axios from "axios";
import {APIException, NetworkConnectionException} from "./Exception";

/* eslint-disable @typescript-eslint/no-unused-vars -- type inference */
// prettier-ignore
export type PathParams<T extends string> = string extends T
  ? { [key: string]: string | number }
  : T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof PathParams<Rest>]: string | number }
  : T extends `${infer _Start}:${infer Param}`
  ? { [k in Param]: string | number }
  : object;
/* eslint-enable */

const APPLICATION_JSON = "application/json";

function parseWithDate(data: string) {
    const ISO_DATE_FORMAT = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-][01]\d:[0-5]\d)$/;
    return JSON.parse(data, (key: any, value: any) => {
        if (typeof value === "string" && ISO_DATE_FORMAT.test(value)) {
            return new Date(value);
        }
        return value;
    });
}

axios.defaults.transformResponse = (data, headers) => {
    const contentType = headers?.["content-type"];
    if (contentType && contentType.startsWith(APPLICATION_JSON)) {
        return parseWithDate(data);
    }
    return data;
};

axios.interceptors.response.use(
    (response) => response,
    // eslint-disable-next-line sonarjs/cognitive-complexity -- well commented
    (e) => {
        // eslint-disable-next-line no-prototype-builtins -- builtins check is necessary
        if (e && typeof e === "object" && e.hasOwnProperty("isAxiosError")) {
            const error = e as AxiosError;
            const requestURL = error.config.url || "-";
            if (error.response) {
                // Try to get server error message/ID/code from response
                const responseData = error.response.data;
                const errorId: string | null = responseData && responseData.id ? responseData.id : null;
                if (!errorId && (error.response.status === 502 || error.response.status === 504)) {
                    // Treat "cloud" error as Network Exception, e.g: gateway issue, load balancer unconnected to application server
                    // Note: Status 503 is maintenance
                    throw new NetworkConnectionException(`Gateway error (${error.response.status})`, requestURL);
                } else {
                    const errorMessage: string = responseData && responseData.message ? responseData.message : `[No Response]`;
                    throw new APIException(errorMessage, error.response.status, requestURL, responseData);
                }
            } else {
                /**
                 * It could be network failure, or CORS pre-flight failure. We cannot distinguish here.
                 * Ref: https://github.com/axios/axios/issues/838
                 */
                throw new NetworkConnectionException(`Failed to connect: ${requestURL}`, requestURL);
            }
        } else {
            throw new NetworkConnectionException(`Unknown network error`, `[No URL]`);
        }
    }
);

export async function ajax<Request, Response, Path extends string>(method: Method, path: Path, pathParams: PathParams<Path>, request: Request, extraConfig: Partial<AxiosRequestConfig> = {}): Promise<Response> {
    const fullURL = urlParams(path, pathParams);
    const config: AxiosRequestConfig = {...extraConfig, method, url: fullURL};

    if (method === "GET" || method === "DELETE") {
        config.params = request;
    } else if (method === "POST" || method === "PUT" || method === "PATCH") {
        config.data = request;
    }

    config.headers = {
        "Content-Type": APPLICATION_JSON,
        Accept: APPLICATION_JSON,
    };

    const response = await axios.request(config);
    return response.data;
}

export function urlParams(pattern: string, params: object): string {
    if (!params) {
        return pattern;
    }
    let url = pattern;
    Object.entries(params).forEach(([name, value]) => {
        const encodedValue = encodeURIComponent(value.toString());
        url = url.replace(":" + name, encodedValue);
    });
    return url;
}
