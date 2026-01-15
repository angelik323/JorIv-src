import { useFiduciaryCommissionStoreV1 } from './fiduciary-commission-v1'

export const useFiduciaryCommissionStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useFiduciaryCommissionStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
