import { useAccountingParametersAccountingBlockStoreV1 } from './accounting-block-v1'

export const useAccountingParametersAccountingBlockStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useAccountingParametersAccountingBlockStoreV1()
    default:
      throw new Error(`Versión de store no soportada: ${version}`)
  }
}
