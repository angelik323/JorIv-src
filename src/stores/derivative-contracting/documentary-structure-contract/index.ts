import { useDocumentaryStructureContractStoreV1 } from './documentary-structure-contract-v1'

export const useDocumentaryStructureContractStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useDocumentaryStructureContractStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
