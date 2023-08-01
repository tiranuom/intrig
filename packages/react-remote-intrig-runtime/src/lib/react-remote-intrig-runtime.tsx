// NetworkStatus is a type representing the different states of network activity.
import {useEffect, useMemo} from "react";
import {NetworkRequest, NetworkRequestMetadata} from "./network-request";
import {NetworkState} from "./network-state";
import {useIntrig} from "./intrig-context";
import {generateRequestKey} from "./generate-request-key";
import {useGetNetworkState, useSetNetworkState} from "./network-context";


/**
 * `useCallIntegration` is a Hook that encapsulates the logic for performing
 * network requests and managing their states.
 *
 * @param requestMetadata - The metadata of the network request.
 *
 * @returns A tuple:
 *  1. The current state of the network request.
 *  2. A function to make a network request.
 *  3. A function to reset the state of the network request.
 *
 * @template T - The type of the body payload
 *
 * @example
 * const [networkState, makeRequest, resetNetworkState] = useCallIntegration(requestMetadata);
 * makeRequest(request);  // Makes network request
 * console.log(networkState);  // Outputs the current state of the network request
 * resetNetworkState();  // Resets the state of the network request
 */
export function useCallIntegration<T>(requestMetadata: NetworkRequestMetadata): [NetworkState<T> | null, (request: NetworkRequest<T>) => void, () => void] {
    const getNetworkState = useGetNetworkState();
    const setNetworkState = useSetNetworkState();
    const axios = useIntrig();

    const currentKey = useMemo(() => generateRequestKey(requestMetadata), [requestMetadata]);

    const makeRequest = async (request: NetworkRequest<T>) => {
        const loadingState = { status: 'loading' } as NetworkState<T>;
        setNetworkState(currentKey, loadingState);

        try {
            const response = await axios({
                method: requestMetadata.method,
                url: request.url,
                headers: {
                    ...requestMetadata.headers,
                    ...request.headers
                },
                data: request.body,
                params: request.params,
            });

            const successState = { status: 'success', data: response.data } as NetworkState<T>;
            setNetworkState(currentKey, successState);

        } catch (error) {
            const errorState = { status: 'error', error } as NetworkState<T>;
            setNetworkState(currentKey, errorState);
        }
    };

    const resetNetworkState = () => setNetworkState(currentKey, { status: 'idle' });

    return [getNetworkState(currentKey) as NetworkState<T>, makeRequest, resetNetworkState];
}
/**
 * `useResetNetworkState` is a hook to reset the state of a specific network request to 'idle'.
 *
 * @returns A function which accepts a key, and resets the state of the network request corresponding to the key.
 */
export function useResetNetworkState() {
    let setNetworkState = useSetNetworkState();
    if (setNetworkState === undefined) {
        throw new Error('useResetNetworkState must be used within a NetworkProvider');
    }
    return (key: string) => setNetworkState(key, { status: 'idle' });
}
