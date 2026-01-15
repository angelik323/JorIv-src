import { useCollectionAccountingBlocksV1 } from './collection-accounting-blocks-v1'

export const useCollectionAccountingBlocksStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useCollectionAccountingBlocksV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
