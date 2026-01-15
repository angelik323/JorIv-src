import { useAccountingParametersAccountingCopyStoreV1 } from './accounting-copy-v1'

export const useAccountingParametersAccountingCopyStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useAccountingParametersAccountingCopyStoreV1()
    default:
      throw new Error(`Versión de store no soportada: ${version}`)
  }
}
