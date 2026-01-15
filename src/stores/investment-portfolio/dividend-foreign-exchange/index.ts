import { useDividendForeignStoreV1 } from './dividend-foreign-v1'

export const useDividendForeignStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useDividendForeignStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
