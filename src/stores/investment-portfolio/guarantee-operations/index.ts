import { useGuaranteeOperationsStoreV1 } from './guarantee-operations-v1'

export const useGuaranteeOperationsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useGuaranteeOperationsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
