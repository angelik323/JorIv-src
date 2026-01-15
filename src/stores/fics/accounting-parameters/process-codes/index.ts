import { useAccountingParametersProcessCodesStoreV1 } from './process-codes-v1'

export const useAccountingParametersProcessCodesStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useAccountingParametersProcessCodesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
