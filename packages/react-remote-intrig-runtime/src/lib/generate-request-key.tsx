import {NetworkRequest, NetworkRequestMetadata} from "./network-request";

/**
 * Function that generates a unique key for a specific network request.
 *
 * This unique key consists of the HTTP method, the URL and optionally, the Content-Type header and custom key if they are included with the request.
 *
 * @function
 * @param {NetworkRequest<any>} request - The HTTP network request object. This object contains details about the request, including the HTTP method, the URL, and potentially headers and a key.
 * @returns {string} The unique key to identify the network request.
 *
 * @example
 * // If the network request object looks like this:
 * // {
 * //  method: 'GET',
 * //  url: 'http://api.example.com/resource',
 * //  headers: { 'Content-Type': 'application/json' },
 * //  key: 'special-request'
 * // };
 *
 * // Then the function will generate the following unique key:
 * // 'GET http://api.example.com/resource application/json (special-request)'
 * //
 * generateRequestKey(request);
 */
export function generateRequestKey(request: NetworkRequestMetadata): string {
    let key = `[${request.domain}] ${request.method} ${request.url}`;

    if (request.headers && request.headers['Content-Type']) {
        key += ` ${request.headers['Content-Type']}`;
    }

    if (request.key) {
        key += ` (${request.key})`;
    }

    return key;
}
