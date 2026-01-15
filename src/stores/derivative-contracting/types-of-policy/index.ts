import { useTypeOfPoliciesStoreV1 } from './types-of-policy-v1'

export const useTypeOfPoliciesStore = (version: 'v1' | 'v2' = 'v1') => {
    switch (version) {
        case 'v1':
            return useTypeOfPoliciesStoreV1()
        case 'v2':
            throw new Error(`Versión de store no disponible: ${version}`)
        default:
            throw new Error(`Versión de store no reconocida: ${version}`)
    }
}

