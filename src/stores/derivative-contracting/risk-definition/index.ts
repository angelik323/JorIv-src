import { useRiskDefinitionsStoreV1 } from './risk-definition-v1'

export const useRiskDefinitionStore = (version: 'v1' | 'v2' = 'v1') => {
    switch (version) {
        case 'v1':
            return useRiskDefinitionsStoreV1()
        case 'v2':
            throw new Error(`Versión de store no disponible: ${version}`)
        default:
            throw new Error(`Versión de store no reconocida: ${version}`)
    }
}

