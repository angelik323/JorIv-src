import { useDefinitionAccountingParametersStoreV1 } from './definition-accounting-parameters-v1'

export const useDefinitionAccountingParametersStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useDefinitionAccountingParametersStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
