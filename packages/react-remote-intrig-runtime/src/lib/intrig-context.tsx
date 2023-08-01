import {createContext, PropsWithChildren, useContext} from "react";
import axios, {AxiosInstance} from "axios";
import {NetworkProvider} from "./network-context";

export const IntrigContext = createContext<AxiosInstance | undefined>(undefined);

export function IntrigProvider({children, axiosInstance}: PropsWithChildren<{axiosInstance?: AxiosInstance}>) {
    if (axiosInstance === undefined) {
        axiosInstance = axios.create();
    }
    return (
        <IntrigContext.Provider value={axiosInstance}>
            <NetworkProvider>
                {children}
            </NetworkProvider>
        </IntrigContext.Provider>
    );
}

export function useIntrig(): AxiosInstance {
    const context = useContext(IntrigContext);
    if (context === undefined) {
        throw new Error('useIntrig must be used within an IntrigProvider');
    }
    return context;
}
