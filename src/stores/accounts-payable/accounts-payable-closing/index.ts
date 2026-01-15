import { useAccountsPayableClosingStoreV1 } from './accounts-payable-closing-v1'

export const useAccountsPayableClosingStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useAccountsPayableClosingStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

