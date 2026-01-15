import { useAccountingBlocksStoreV1 } from './accounting-blocks-v1'

export const useAccountingBlocksStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAccountingBlocksStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}