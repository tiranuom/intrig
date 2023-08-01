type NetworkStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * IdleState represents the state when network activity has not begun.
 */
export interface IdleState {
    status: 'idle';
}

/**
 * LoadingState represents the state when network activity is ongoing.
 */
export interface LoadingState {
    status: 'loading';
}

/**
 * SuccessState represents the state when network activity has been successfully completed.
 * @template T The type of the data payload.
 */
export interface SuccessState<T> {
    status: 'success';
    data: T;
}

/**
 * ErrorState represents the state when network activity has encountered an error.
 */
export interface ErrorState {
    status: 'error';
    error: Error;
}

/**
 * NetworkState represents the possible states of network activity.
 * @template T The type of the data payload.
 */
export type NetworkState<T> = IdleState | LoadingState | SuccessState<T> | ErrorState;

/**
 * Checks whether the network state is 'idle'.
 * @template T The type of the data payload.
 * @param state The state to check.
 * @returns True if the state is 'idle', false otherwise.
 */
export function isIdle<T>(state: NetworkState<T>): state is IdleState {
    return state.status === 'idle';
}

/**
 * Checks whether the network state is 'loading'.
 * @template T The type of the data payload.
 * @param state The state to check.
 * @returns True if the state is 'loading', false otherwise.
 */
export function isLoading<T>(state: NetworkState<T>): state is LoadingState {
    return state.status === 'loading';
}

/**
 * Checks whether the network state is 'success'.
 * @template T The type of the data payload.
 * @param state The state to check.
 * @returns True if the state is 'success', false otherwise.
 */
export function isSuccess<T>(state: NetworkState<T>): state is SuccessState<T> {
    return state.status === 'success';
}

/**
 * Checks whether the network state is 'error'.
 * @template T The type of the data payload.
 * @param state The state to check.
 * @returns True if the state is 'error', false otherwise.
 */
export function isError<T>(state: NetworkState<T>): state is ErrorState {
    return state.status === 'error';
}
