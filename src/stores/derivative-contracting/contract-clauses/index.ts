import { useContractClausesStoreV1 } from './contract-clauses-v1'

export const useContractClausesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useContractClausesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
