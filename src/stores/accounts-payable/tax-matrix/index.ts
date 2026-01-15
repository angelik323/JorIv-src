// Stores
import { useTaxMatrixStoreV1 } from './tax-matrix-v1'

export const useTaxMatrixStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useTaxMatrixStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}