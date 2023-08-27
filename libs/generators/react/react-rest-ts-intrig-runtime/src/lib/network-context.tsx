import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { NetworkState } from './network-state';

type NetworkContextType = {
  getNetworkState: (key: string) => NetworkState<unknown> | undefined;
  setNetworkState: (key: string, state: NetworkState<unknown>) => void;
};

const NetworkStateContext = createContext<NetworkContextType | undefined>(
  undefined
);

function networkStateReducer(
  state: Record<string, NetworkState<unknown>>,
  action: { key: string; state: NetworkState<unknown> }
) {
  return { ...state, [action.key]: action.state };
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [networkStates, dispatch] = useReducer(networkStateReducer, {});

  const getNetworkState = (key: string) => networkStates[key];

  const setNetworkState = (key: string, state: NetworkState<unknown>) =>
    dispatch({ key, state });

  return (
    <NetworkStateContext.Provider value={{ getNetworkState, setNetworkState }}>
      {children}
    </NetworkStateContext.Provider>
  );
}

/**
 * `useGetNetworkState` is a hook to retrieve the state of a specific network request.
 *
 * @param key The key identifying the network request.
 * @returns The current state of the network request.
 */
export function useGetNetworkState(): (key: string) => { status: string } {
  const context = useContext(NetworkStateContext);
  if (context === undefined) {
    throw new Error('useGetNetworkState must be used within a NetworkProvider');
  }
  return (key: string) => context.getNetworkState(key) ?? { status: 'idle' };
}

/**
 * `useSetNetworkState` is a hook to set the state of a specific network request.
 *
 * @returns A function which accepts a key and a state, and sets the state of the network request corresponding to the key.
 */
export function useSetNetworkState() {
  const context = useContext(NetworkStateContext);
  if (context === undefined) {
    throw new Error('useSetNetworkState must be used within a NetworkProvider');
  }
  return context.setNetworkState;
}
