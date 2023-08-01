import {useCallIntegration} from "@intrig/react-remote-intrig-runtime";
import {InputType} from './types/input-type'
import {OutputType} from './types/output-type'

export function useGetPet() { //Operation Id
    let [state, execute, reset] = useCallIntegration<OutputType>({
        domain: 'petstore',
        method: 'GET',
        url: 'https://petstore.swagger.io/v2/pet/findByStatus',
        key: 'getPet'
    })
    return [state, (
        pathVariables: Record<string, string>,
        body: InputType,
        optional?: {
            params?: Record<string, string>,
            headers?: Record<string, any>
        }) => execute({
        body,
        params: optional?.params,
        headers: optional?.headers
    }), reset]
}
