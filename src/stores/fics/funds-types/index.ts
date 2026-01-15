import { useFundsTypesStoreV1 } from './funds-types-v1'

export const useFundsTypeStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useFundsTypesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
